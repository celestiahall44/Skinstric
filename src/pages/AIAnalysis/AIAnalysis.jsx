
import './AIAnalysis.css';
import Header from '../../components/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import GetSummaryButton from '../../components/GetSummaryButton/GetSummaryButton';
import Group39959 from '../../components/Group39959/Group39959';
import AIHeaderText from '../../components/AIHeaderText/AIHeaderText';
import AIParagraph from '../../components/AIparagraph/AIparagraph';
import Rombuses from '../../components/Rombuses/Rombuses';

function AIAnalysis() {
	const handleNavigateToDemographics = () => {
		if (window.location.pathname === '/demographics') {
			return;
		}

		window.history.pushState({}, '', '/demographics');
		window.dispatchEvent(new PopStateEvent('popstate'));
	};

	const handleBackClick = () => {
		if (window.location.pathname === '/options') {
			return;
		}

		window.history.pushState({}, '', '/options');
		window.dispatchEvent(new PopStateEvent('popstate'));
	};

	return (
		<main className="ai-analysis-page" aria-label="AI Analysis page">
			<Header />
			<Rombuses />
			<AIHeaderText />
			<AIParagraph />
			<BackButton onClick={handleBackClick} />
			<GetSummaryButton onClick={handleNavigateToDemographics} />
			<Group39959 onDemographicsClick={handleNavigateToDemographics} />
		</main>
	);
}

export default AIAnalysis;
