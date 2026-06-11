import './IntroduceYourself.css';
import { useEffect, useState } from 'react';

function IntroduceYourself() {
	const [name, setName] = useState('');
	const [location, setLocation] = useState('');
	const [isLocationStep, setIsLocationStep] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmissionComplete, setIsSubmissionComplete] = useState(false);
	const [submissionOutput, setSubmissionOutput] = useState('');
	const [validationError, setValidationError] = useState('');
	const invalidEntryMessage = 'Invalid Entry, use of numbers or special characters not allowed.';

	const hasInvalidCharacters = (value) => /[^A-Za-z\s]/.test(value);
	const isValidName = (value) => /^[A-Za-z\s]{2,50}$/.test(value.trim());
	const isValidLocation = (value) => /^[A-Za-z\s]{2,80}$/.test(value.trim());

	useEffect(() => {
		const handleBackIntent = (event) => {
			if (!isLocationStep) {
				return;
			}

			event.preventDefault();
			setIsLocationStep(false);
			setLocation('');
			setValidationError('');
		};

		window.addEventListener('introductionBackIntent', handleBackIntent);
		return () => window.removeEventListener('introductionBackIntent', handleBackIntent);
	}, [isLocationStep]);

	useEffect(() => {
		const shouldHideGuidance = isSubmitting || isSubmissionComplete;
		document.body.classList.toggle('introduction-submitting', shouldHideGuidance);

		return () => {
			document.body.classList.remove('introduction-submitting');
		};
	}, [isSubmitting, isSubmissionComplete]);

	useEffect(() => {
		document.body.classList.toggle('introduction-complete', isSubmissionComplete);

		return () => {
			document.body.classList.remove('introduction-complete');
		};
	}, [isSubmissionComplete]);

	const saveAndSubmitProfile = async (enteredName, enteredLocation) => {
		const profile = {
			name: enteredName,
			location: enteredLocation,
		};

		localStorage.setItem('skinstricUserProfile', JSON.stringify(profile));
		localStorage.setItem('skinstricUserName', enteredName);
		localStorage.setItem('skinstricUserLocation', enteredLocation);

		setIsSubmissionComplete(false);
		setIsSubmitting(true);
		const submitStartTime = Date.now();

		try {
			const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(profile),
			});

			if (response.ok) {
				const output = `"SUCCESS": "added ${enteredName} from ${enteredLocation}"`;
				setSubmissionOutput(output);
				localStorage.setItem('skinstricSubmissionOutput', output);
				console.log(output);
			}
		} catch (error) {
			console.error('Failed to submit profile:', error);
		} finally {
			const elapsed = Date.now() - submitStartTime;
			if (elapsed < 3000) {
				await new Promise((resolve) => window.setTimeout(resolve, 3000 - elapsed));
			}

			setIsSubmitting(false);
			setIsSubmissionComplete(true);
		}
	};

	const handleKeyDown = (event) => {
		if (event.key !== 'Enter') {
			return;
		}

		event.preventDefault();

		const enteredName = name.trim();
		const enteredLocation = location.trim();

		if (!isLocationStep) {
			if (!isValidName(enteredName)) {
				setValidationError(invalidEntryMessage);
				return;
			}

			setValidationError('');
			setIsLocationStep(true);
			return;
		}

		if (isLocationStep && !isSubmitting) {
			if (!isValidName(enteredName) || !isValidLocation(enteredLocation)) {
				setValidationError(invalidEntryMessage);
				return;
			}

			setValidationError('');
			saveAndSubmitProfile(enteredName, enteredLocation);
		}
	};

	return (
		<>
			<div className="introduction-text" aria-label="Introduction text">
				<span className="introduction-text-label">TO START ANALYSIS</span>
			</div>

			<div
				className={`introduce-yourself${isSubmitting ? ' introduce-yourself--loading' : ''}${isSubmissionComplete ? ' introduce-yourself--complete' : ''}`}
			>
				{isSubmitting ? (
					<div className="introduce-yourself-loading" aria-live="polite" aria-label="Processing Submission">
						<span className="introduce-yourself-loading-text">Processing Submission</span>
						<span className="introduce-yourself-loading-dots" aria-hidden="true">
							<span className="loading-dot" />
							<span className="loading-dot" />
							<span className="loading-dot" />
						</span>
					</div>
				) : isSubmissionComplete ? (
					<p className="introduce-yourself-complete" aria-live="polite">
						<span className="introduce-yourself-complete-title">Thank you!</span>
						<span className="introduce-yourself-complete-subtitle">Proceed to the next step</span>
					</p>
				) : (
					<input
						key={isLocationStep ? 'location' : 'name'}
						type="text"
						className={`introduce-yourself-input${isLocationStep ? ' location-step' : ''}`}
						placeholder={isLocationStep ? 'Where are you from?' : 'Introduce Yourself'}
						aria-label={isLocationStep ? 'Where are you from?' : 'Introduce yourself'}
						value={isLocationStep ? location : name}
						onChange={(event) => {
							const nextValue = event.target.value;

							if (hasInvalidCharacters(nextValue)) {
								setValidationError(invalidEntryMessage);
								return;
							}

							setValidationError('');

							if (isLocationStep) {
								setLocation(nextValue);
								return;
							}

							setName(nextValue);
						}}
						onKeyDown={handleKeyDown}
						autoFocus
					/>
				)}
				{validationError && (
					<p className="introduce-yourself-error" aria-live="polite">
						{validationError}
					</p>
				)}
				<span style={{ display: 'none' }} aria-live="polite">
					{submissionOutput}
				</span>
			</div>
		</>
	);
}

export default IntroduceYourself;
