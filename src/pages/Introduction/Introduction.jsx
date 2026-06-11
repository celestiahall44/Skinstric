import './Introduction.css';
import Header from '../../components/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import ProceedButton from '../../components/ProceedButton/ProceedButton';
import Rombuses from '../../components/Rombuses/Rombuses';
import ClickToType from '../../components/ClickToType/ClickToType';
import IntroduceYourself from '../../components/IntroduceYourself/IntroduceYourself';

function Introduction({ onProceedClick }) {
	const handleBackClick = () => {
		const backIntentEvent = new CustomEvent('introductionBackIntent', { cancelable: true });
		window.dispatchEvent(backIntentEvent);

		if (backIntentEvent.defaultPrevented) {
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

	return (
		<main className="introduction-page" aria-label="Introduction page">
			<Header />
			<Rombuses />
			<BackButton onClick={handleBackClick} />
			<ProceedButton onClick={onProceedClick} />
			<ClickToType />
			<IntroduceYourself />
		</main>
	);
}

export default Introduction;
