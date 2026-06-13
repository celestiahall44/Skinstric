import { useRef, useState } from 'react';
import './Options.css';
import Header from '../../components/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import ToStartAnalysis from '../../components/ToStartAnalysis/ToStartAnalysis';
import Gallery from '../../components/Gallery/Gallery';
import Camera from '../../components/Camera/Camera';
import PhaseTwoLoading from '../../components/PhaseTwoLoading/PhaseTwoLoading';

const PHASE_TWO_ENDPOINT = 'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo';
const MIN_LOADING_DURATION_MS = 5000;

function Options({ onAnalysisComplete }) {
	const fileInputRef = useRef(null);
	const [uploadPhase, setUploadPhase] = useState('idle');
	const [uploadError, setUploadError] = useState('');
	const [loadingPreviewSrc, setLoadingPreviewSrc] = useState('');
	const [uploadResult, setUploadResult] = useState(null);

	const fileToBase64 = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				const dataUrl = typeof reader.result === 'string' ? reader.result : '';
				const base64Value = (dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl).trim();

				if (!base64Value) {
					reject(new Error('Failed to encode image as Base64.'));
					return;
				}

				resolve(base64Value);
			};
			reader.onerror = () => reject(new Error('Failed to read image file.'));
			reader.readAsDataURL(file);
		});

	const tryParseJson = (value) => {
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
	};

	const handleBackClick = () => {
		if (uploadPhase === 'loading' || uploadPhase === 'success') {
			setUploadPhase('idle');
			setUploadError('');
			setUploadResult(null);

			if (loadingPreviewSrc) {
				URL.revokeObjectURL(loadingPreviewSrc);
				setLoadingPreviewSrc('');
			}

			return;
		}

		const currentPath = window.location.pathname;
		window.history.back();

		window.setTimeout(() => {
			if (window.location.pathname === currentPath) {
				window.location.assign('/');
			}
		}, 150);
	};

	const handleGalleryClick = () => {
		setUploadPhase('idle');
		setUploadError('');
		setUploadResult(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
			fileInputRef.current.click();
		}
	};

	const handleFileSelection = async (event) => {
		const selectedFile = event.target.files && event.target.files[0] ? event.target.files[0] : null;

		if (!selectedFile) {
			return;
		}

		if (!selectedFile.type.startsWith('image/')) {
			setUploadError('Please select a valid image file.');
			return;
		}

		const previewObjectUrl = URL.createObjectURL(selectedFile);
		if (loadingPreviewSrc) {
			URL.revokeObjectURL(loadingPreviewSrc);
		}
		setLoadingPreviewSrc(previewObjectUrl);

		setUploadError('');
		setUploadPhase('loading');
		const loadingStartTime = Date.now();
		let uploadSucceeded = false;
		let parsedUploadResult = null;
		let loadingElapsed = false;

		try {
			const imageBase64 = await fileToBase64(selectedFile);
			const payload = {
				image: imageBase64,
				imageBase64,
				fileName: selectedFile.name,
				mimeType: selectedFile.type,
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
				throw new Error(responseText || 'Upload failed.');
			}

			const responseText = await response.text();
			if (responseText.trim()) {
				try {
					parsedUploadResult = JSON.parse(responseText);

					if (typeof parsedUploadResult === 'string') {
						const reparsed = tryParseJson(parsedUploadResult);
						parsedUploadResult = reparsed || { rawResponse: parsedUploadResult };
					}
				} catch {
					const reparsed = tryParseJson(responseText);
					parsedUploadResult = reparsed || { rawResponse: responseText };
				}
			}

			setUploadResult(parsedUploadResult);

			uploadSucceeded = true;
		} catch (error) {
			setUploadPhase('idle');
			setUploadError(error instanceof Error ? error.message : 'Upload failed.');
			setUploadResult(null);
		} finally {
			const elapsed = Date.now() - loadingStartTime;
			if (elapsed < MIN_LOADING_DURATION_MS) {
				await new Promise((resolve) => window.setTimeout(resolve, MIN_LOADING_DURATION_MS - elapsed));
			}

			loadingElapsed = true;

			if (uploadSucceeded && loadingElapsed) {
				setUploadPhase('success');
			} else {
				setUploadPhase('idle');
			}
		}
	};

	const handleSuccessOkClick = () => {
		if (loadingPreviewSrc) {
			URL.revokeObjectURL(loadingPreviewSrc);
			setLoadingPreviewSrc('');
		}

		if (onAnalysisComplete) {
			onAnalysisComplete(uploadResult);
		}
	};

	if (uploadPhase === 'loading' || uploadPhase === 'success') {
		return (
			<main className="options-page" aria-label="Upload analysis state">
				<Header />
				<BackButton onClick={handleBackClick} />
				<ToStartAnalysis />
				<PhaseTwoLoading
					previewSrc={loadingPreviewSrc}
					showOkButton={uploadPhase === 'success'}
					onOkClick={handleSuccessOkClick}
				/>
			</main>
		);
	}

	return (
		<main className="options-page" aria-label="Options page">
			<Header />
			<BackButton onClick={handleBackClick} />
			<ToStartAnalysis />
			<Camera />
			<Gallery onClick={handleGalleryClick} />
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileSelection}
				className="options-gallery-file-input"
			/>
			{uploadError && <p className="options-upload-error">{uploadError}</p>}
		</main>
	);
}

export default Options;
