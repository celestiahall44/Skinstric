import { useEffect, useRef, useState } from 'react';
import './TakePhoto.css';
import Header from '../../components/Header/Header';
import TakePhotoHeader from '../../components/TakePhotoHeader/TakePhotoHeader';
import TakePic from '../../components/TakePic/TakePic';
import Suggestions from '../../components/Suggestions/Suggestions';
import BackButton from '../../components/BackButton/BackButton';
import GreatShot from '../../components/GreatShot/GreatShot';
import PreviewPopup from '../../components/PreviewPopup/PreviewPopup';
import PhaseTwoLoading from '../../components/PhaseTwoLoading/PhaseTwoLoading';

const CAPTURED_PHOTO_STORAGE_KEY = 'skinstricCapturedPhoto';
const PHASE_TWO_ENDPOINT = 'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo';
const MIN_LOADING_DURATION_MS = 5000;
const GREAT_SHOT_BOUNDS = {
	right: 63,
	topOffsetFromCenter: -58,
	width: 86,
	height: 24,
};

function tryParseJson(value) {
	if (typeof value !== 'string') {
		return null;
	}

	const trimmed = value.trim();
	if (!trimmed || !(trimmed.startsWith('{') || trimmed.startsWith('['))) {
		return null;
	}

	try {
		return JSON.parse(trimmed);
	} catch {
		return null;
	}
}

function averageLuminanceForGreatShot(videoElement) {
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	if (!viewportWidth || !viewportHeight) {
		return 0;
	}

	const sourceWidth = videoElement.videoWidth;
	const sourceHeight = videoElement.videoHeight;
	if (!sourceWidth || !sourceHeight) {
		return 0;
	}

	const sampleCanvas = document.createElement('canvas');
	sampleCanvas.width = viewportWidth;
	sampleCanvas.height = viewportHeight;
	const sampleContext = sampleCanvas.getContext('2d');
	if (!sampleContext) {
		return 0;
	}

	const sourceAspect = sourceWidth / sourceHeight;
	const viewportAspect = viewportWidth / viewportHeight;

	let drawWidth = viewportWidth;
	let drawHeight = viewportHeight;
	let drawX = 0;
	let drawY = 0;

	if (sourceAspect > viewportAspect) {
		drawHeight = viewportHeight;
		drawWidth = drawHeight * sourceAspect;
		drawX = (viewportWidth - drawWidth) / 2;
	} else {
		drawWidth = viewportWidth;
		drawHeight = drawWidth / sourceAspect;
		drawY = (viewportHeight - drawHeight) / 2;
	}

	sampleContext.drawImage(videoElement, drawX, drawY, drawWidth, drawHeight);

	const sampleX = Math.max(0, Math.round(viewportWidth - GREAT_SHOT_BOUNDS.right - GREAT_SHOT_BOUNDS.width));
	const sampleY = Math.max(0, Math.round(viewportHeight / 2 + GREAT_SHOT_BOUNDS.topOffsetFromCenter));
	const sampleWidth = Math.max(1, Math.min(GREAT_SHOT_BOUNDS.width, viewportWidth - sampleX));
	const sampleHeight = Math.max(1, Math.min(GREAT_SHOT_BOUNDS.height, viewportHeight - sampleY));

	const imageData = sampleContext.getImageData(sampleX, sampleY, sampleWidth, sampleHeight).data;
	let totalLuminance = 0;
	let pixelCount = 0;

	for (let i = 0; i < imageData.length; i += 4) {
		const red = imageData[i];
		const green = imageData[i + 1];
		const blue = imageData[i + 2];
		totalLuminance += 0.2126 * red + 0.7152 * green + 0.0722 * blue;
		pixelCount += 1;
	}

	return pixelCount ? totalLuminance / pixelCount : 0;
}

function TakePhoto({ onLogoClick, onBack, onAnalysisComplete }) {
	const videoRef = useRef(null);
	const streamRef = useRef(null);
	const [capturedPhoto, setCapturedPhoto] = useState('');
	const [hasCapturedPhoto, setHasCapturedPhoto] = useState(false);
	const [useDarkGreatShotText, setUseDarkGreatShotText] = useState(false);
	const [submitPhase, setSubmitPhase] = useState('idle');
	const [submitError, setSubmitError] = useState('');
	const [analysisResult, setAnalysisResult] = useState(null);

	const setVideoElementRef = (node) => {
		videoRef.current = node;
		if (node && streamRef.current) {
			node.srcObject = streamRef.current;
		}
	};

	const startCamera = () => {
		navigator.mediaDevices
			.getUserMedia({ video: { facingMode: { ideal: 'user' } }, audio: false })
			.then((s) => {
				streamRef.current = s;
				if (videoRef.current) {
					videoRef.current.srcObject = s;
				}
			})
			.catch((err) => {
				console.error('Camera access error:', err);
			});
	};

	const handleRetake = () => {
		setSubmitPhase('idle');
		setSubmitError('');
		setAnalysisResult(null);
		setCapturedPhoto('');
		setHasCapturedPhoto(false);
		setUseDarkGreatShotText(false);
		window.localStorage.removeItem(CAPTURED_PHOTO_STORAGE_KEY);
		startCamera();
	};

	const handleSubmit = async () => {
		if (!capturedPhoto || submitPhase === 'loading' || submitPhase === 'success') {
			return;
		}

		setSubmitPhase('loading');
		setSubmitError('');
		setAnalysisResult(null);
		const loadingStartTime = Date.now();
		let uploadSucceeded = false;
		let parsedResult = null;

		try {
			const imageBase64 = (capturedPhoto.includes(',') ? capturedPhoto.split(',')[1] : capturedPhoto).trim();
			if (!imageBase64) {
				throw new Error('Captured image is empty. Please retake your photo.');
			}

			const payload = {
				image: imageBase64,
				imageBase64,
				fileName: 'live-selfie.jpg',
				mimeType: 'image/jpeg',
			};

			const response = await fetch(PHASE_TWO_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const responseText = await response.text();
				throw new Error(responseText || 'Analysis failed.');
			}

			const responseText = await response.text();
			if (responseText.trim()) {
				try {
					parsedResult = JSON.parse(responseText);
					if (typeof parsedResult === 'string') {
						const reparsed = tryParseJson(parsedResult);
						parsedResult = reparsed || { rawResponse: parsedResult };
					}
				} catch {
					const reparsed = tryParseJson(responseText);
					parsedResult = reparsed || { rawResponse: responseText };
				}
			}

			setAnalysisResult(parsedResult);
			console.log('API response:', parsedResult);
			uploadSucceeded = true;
		} catch (error) {
			setSubmitError(error instanceof Error ? error.message : 'Analysis failed.');
		} finally {
			const elapsed = Date.now() - loadingStartTime;
			if (elapsed < MIN_LOADING_DURATION_MS) {
				await new Promise((resolve) => window.setTimeout(resolve, MIN_LOADING_DURATION_MS - elapsed));
			}

			if (uploadSucceeded) {
				setSubmitPhase('success');
			} else {
				setSubmitPhase('idle');
			}
		}
	};

	const handleAnalysisOkClick = () => {
		if (typeof onAnalysisComplete === 'function') {
			onAnalysisComplete(analysisResult);
		}
	};

	const handleTakePic = () => {
		const videoElement = videoRef.current;
		if (!videoElement) {
			return;
		}

		const width = videoElement.videoWidth || videoElement.clientWidth || 1280;
		const height = videoElement.videoHeight || videoElement.clientHeight || 720;

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;

		const context = canvas.getContext('2d');
		if (!context) {
			return;
		}

		try {
			context.drawImage(videoElement, 0, 0, width, height);
			const capturedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
			window.localStorage.setItem(CAPTURED_PHOTO_STORAGE_KEY, capturedDataUrl);
			setCapturedPhoto(capturedDataUrl);
		} catch (error) {
			console.error('Photo capture failed:', error);
		}

		setHasCapturedPhoto(true);

		try {
			const averageLuminance = averageLuminanceForGreatShot(videoElement);
			setUseDarkGreatShotText(averageLuminance > 145);
		} catch (error) {
			console.error('GreatShot contrast sampling failed:', error);
			setUseDarkGreatShotText(false);
		}

		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
	};

	const handleBackClick = () => {
		if (typeof onBack === 'function') {
			onBack();
		}
	};

	useEffect(() => {
		let stream = null;
		let cancelled = false;

		navigator.mediaDevices
			.getUserMedia({ video: { facingMode: { ideal: 'user' } }, audio: false })
			.then((s) => {
				stream = s;
				streamRef.current = s;
				if (!cancelled && videoRef.current) {
					videoRef.current.srcObject = s;
				} else if (cancelled) {
					s.getTracks().forEach((track) => track.stop());
				}
			})
			.catch((err) => {
				console.error('Camera access error:', err);
			});

		return () => {
			cancelled = true;
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			} else if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	if (submitPhase === 'loading' || submitPhase === 'success') {
		return (
			<main className="take-photo-page" aria-label="Take photo analysis state">
				<Header />
				<PhaseTwoLoading
					previewSrc={capturedPhoto}
					showOkButton={submitPhase === 'success'}
					onOkClick={handleAnalysisOkClick}
				/>
			</main>
		);
	}

	return (
		<main className="take-photo-page" aria-label="Take photo page">
			{capturedPhoto ? (
				<img className="take-photo-feed" src={capturedPhoto} alt="Captured" />
			) : (
				<video
					ref={setVideoElementRef}
					className="take-photo-feed"
					autoPlay
					playsInline
					muted
				/>
			)}
			<TakePhotoHeader onLogoClick={onLogoClick} />
			<BackButton inverted onClick={handleBackClick} />
			{hasCapturedPhoto ? null : <Suggestions inverted bottom />}
			{hasCapturedPhoto ? <GreatShot darkText={useDarkGreatShotText} /> : null}
			{hasCapturedPhoto ? <PreviewPopup onRetake={handleRetake} onSubmit={handleSubmit} error={submitError} /> : null}
			{hasCapturedPhoto ? null : <TakePic onClick={handleTakePic} />}
		</main>
	);
}

export default TakePhoto;
