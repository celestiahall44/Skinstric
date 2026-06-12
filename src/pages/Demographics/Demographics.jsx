import './Demographics.css';
import Header from '../../components/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import AIHeaderText from '../../components/AIHeaderText/AIHeaderText';
import DemographicsLarge from '../../components/DemographicsLarge/DemographicsLarge';
import PredictionText from '../../components/PredictionText/PredictionText';
import UpdateText from '../../components/UpdateText/UpdateText';
import RaceThumbnail from '../../components/RaceThumbnail/RaceThumbnail';
import AgeThumbnail from '../../components/AgeThumbnail/AgeThumbnail';
import SexThumbnail from '../../components/SexThumbnail/SexThumbnail';
import PieGraph from '../../components/PieGraph/PieGraph';
import AIConfidence from '../../components/AIConfidence/AIConfidence';
import ResetButton from '../../components/ResetButton/ResetButton';
import ConfirmButton from '../../components/ConfirmButton/ConfirmButton';

function Demographics() {
	const handleBackClick = () => {
		const currentPath = window.location.pathname;
		window.history.back();

		window.setTimeout(() => {
			if (window.location.pathname === currentPath) {
				window.location.assign('/ai-analysis');
			}
		}, 150);
	};

	return (
		<main className="demographics-page" aria-label="Demographics page">
			<Header />
			<AIHeaderText />
			<DemographicsLarge />
			<PredictionText />
			<UpdateText />
			<RaceThumbnail />
			<AgeThumbnail />
			<SexThumbnail />
			<PieGraph />
			<AIConfidence />
			<BackButton onClick={handleBackClick} />
			<ResetButton />
			<ConfirmButton />
		</main>
	);
}

export default Demographics;
