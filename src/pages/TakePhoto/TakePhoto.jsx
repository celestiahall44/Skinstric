import { useEffect, useRef } from 'react';
import './TakePhoto.css';
import TakePhotoHeader from '../../components/TakePhotoHeader/TakePhotoHeader';
import TakePic from '../../components/TakePic/TakePic';
import Suggestions from '../../components/Suggestions/Suggestions';
import BackButton from '../../components/BackButton/BackButton';

function TakePhoto({ onLogoClick, onBack }) {
	const videoRef = useRef(null);

	useEffect(() => {
		let stream = null;
		let cancelled = false;

		navigator.mediaDevices
			.getUserMedia({ video: { facingMode: { ideal: 'user' } }, audio: false })
			.then((s) => {
				stream = s;
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
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	return (
		<main className="take-photo-page" aria-label="Take photo page">
			<video
				ref={videoRef}
				className="take-photo-feed"
				autoPlay
				playsInline
				muted
			/>
			<TakePhotoHeader onLogoClick={onLogoClick} />
			<BackButton inverted onClick={onBack} />
			<Suggestions inverted bottom />
			<TakePic />
		</main>
	);
}

export default TakePhoto;
