import './IntroduceYourself.css';
import { useEffect, useState } from 'react';

function IntroduceYourself() {
	const [name, setName] = useState('');
	const [location, setLocation] = useState('');
	const [isLocationStep, setIsLocationStep] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
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

	const saveAndSubmitProfile = async (enteredName, enteredLocation) => {
		const profile = {
			name: enteredName,
			location: enteredLocation,
		};

		localStorage.setItem('skinstricUserProfile', JSON.stringify(profile));
		localStorage.setItem('skinstricUserName', enteredName);
		localStorage.setItem('skinstricUserLocation', enteredLocation);

		setIsSubmitting(true);

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
			setIsSubmitting(false);
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
			<div className="introduction-text" aria-label="Introduction text" role="img">
				<svg
					className="introduction-text-svg"
					width="142"
					height="12"
					viewBox="0 0 142 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M5.50396 11.328V1.952H8.87996V0.128002H-4.296e-05V1.952H3.39196V11.328H5.50396ZM14.276 11.456C17.524 11.456 19.924 9.024 19.924 5.728C19.924 2.432 17.524 2.86102e-06 14.276 2.86102e-06C11.012 2.86102e-06 8.61196 2.432 8.61196 5.728C8.61196 9.024 11.012 11.456 14.276 11.456ZM14.26 9.616C12.228 9.616 10.74 7.968 10.74 5.728C10.74 3.488 12.228 1.824 14.26 1.824C16.308 1.824 17.796 3.488 17.796 5.728C17.796 7.968 16.308 9.616 14.26 9.616ZM28.1167 11.456C30.5807 11.456 32.2927 10.192 32.2927 8.112C32.2927 3.744 26.1967 5.6 26.1967 3.12C26.1967 2.336 26.8847 1.824 27.9887 1.824C29.1727 1.824 29.9407 2.48 30.0367 3.456H32.0527C31.9567 1.36 30.3567 2.86102e-06 27.9887 2.86102e-06C25.7167 2.86102e-06 24.1327 1.28 24.1327 3.12C24.1327 7.408 30.1487 5.744 30.1487 8.144C30.1487 9.136 29.3167 9.616 28.1167 9.616C26.7727 9.616 25.9407 8.816 25.8287 7.568H23.7967C23.9087 9.92 25.5727 11.456 28.1167 11.456ZM37.7865 11.328V1.952H41.1625V0.128002H32.2825V1.952H35.6745V11.328H37.7865ZM50.21 11.328L45.89 0.128002H43.906L39.602 11.328H41.778L42.738 8.72H47.058L48.018 11.328H50.21ZM44.914 2.832L46.418 6.928H43.41L44.914 2.832ZM59.1051 8.336C59.0251 7.312 58.5291 6.48 57.7611 6C58.6891 5.52 59.2651 4.736 59.2651 3.584C59.2651 1.552 57.8891 0.128002 55.5531 0.128002H50.9611V11.328H53.0891V7.12H55.5051C56.3371 7.12 56.9291 7.728 57.0091 8.576L57.2811 11.328H59.3771L59.1051 8.336ZM55.4571 1.904C56.7051 1.904 57.2171 2.688 57.2171 3.584C57.2171 4.48 56.7051 5.296 55.4571 5.296H53.0891V1.904H55.4571ZM64.9827 11.328V1.952H68.3587V0.128002H59.4787V1.952H62.8707V11.328H64.9827ZM82.0706 11.328L77.7506 0.128002H75.7666L71.4626 11.328H73.6386L74.5986 8.72H78.9186L79.8786 11.328H82.0706ZM76.7746 2.832L78.2786 6.928H75.2706L76.7746 2.832ZM84.9337 11.328V3.44L89.7977 11.328H92.0697V0.128002H89.9577V8.032L85.1097 0.128002H82.8217V11.328H84.9337ZM103.524 11.328L99.2043 0.128002H97.2203L92.9163 11.328H95.0923L96.0523 8.72H100.372L101.332 11.328H103.524Z"
						fill="currentColor"
					/>
				</svg>
			</div>

			<div className="introduce-yourself">
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
					disabled={isSubmitting}
					autoFocus
				/>
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
