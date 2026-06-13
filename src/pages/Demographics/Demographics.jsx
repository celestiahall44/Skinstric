import { useEffect, useState } from 'react';
import './Demographics.css';
import { buildAgeRowsFromResponse, buildRaceRowsFromResponse, buildSexRowsFromResponse } from '../../utils/predictionRows';
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
import HomeButton from '../../components/HomeButton/HomeButton';

function Demographics({ phaseTwoResult }) {
	const [selectedDemographic, setSelectedDemographic] = useState('race');
	const [selectedPredictionRow, setSelectedPredictionRow] = useState(null);
	const raceRows = buildRaceRowsFromResponse(phaseTwoResult);
	const ageRows = buildAgeRowsFromResponse(phaseTwoResult);
	const sexRows = buildSexRowsFromResponse(phaseTwoResult);
	const topRace = raceRows.length > 0 ? raceRows[0] : null;
	const topAge = ageRows.reduce((highestRow, row) => {
		if (!highestRow || row.confidence > highestRow.confidence) {
			return row;
		}

		return highestRow;
	}, null);
	const topSex = sexRows.length > 0 ? sexRows[0] : null;

	useEffect(() => {
		setSelectedDemographic('race');
		setSelectedPredictionRow(topRace ? { section: 'race', label: topRace.label, confidence: topRace.confidence } : null);
	}, [phaseTwoResult]);

	const handleBackClick = () => {
		const currentPath = window.location.pathname;
		window.history.back();

		window.setTimeout(() => {
			if (window.location.pathname === currentPath) {
				window.location.assign('/ai-analysis');
			}
		}, 150);
	};

	const handleHomeClick = () => {
		window.location.assign('/');
	};

	const handleRaceThumbnailClick = () => {
		setSelectedDemographic('race');
		setSelectedPredictionRow(topRace ? { section: 'race', label: topRace.label, confidence: topRace.confidence } : null);
	};

	const handleAgeThumbnailClick = () => {
		setSelectedDemographic('age');
		setSelectedPredictionRow(topAge ? { section: 'age', label: topAge.label, confidence: topAge.confidence } : null);
	};

	const handleSexThumbnailClick = () => {
		setSelectedDemographic('sex');
		setSelectedPredictionRow(topSex ? { section: 'sex', label: topSex.label, confidence: topSex.confidence } : null);
	};

	const handleSectionSelect = (section) => {
		setSelectedDemographic(section);
		setSelectedPredictionRow(null);
	};

	const handleRowSelect = (row) => {
		setSelectedPredictionRow(row);
	};

	const raceTopLabel = topRace ? topRace.label : '';
	const ageTopLabel = topAge ? topAge.label : '';
	const sexTopLabel = topSex ? topSex.label : '';

	return (
		<main className="demographics-page" aria-label="Demographics page">
			<Header />
			<AIHeaderText />
			<DemographicsLarge />
			<PredictionText />
			<UpdateText />
			<RaceThumbnail onClick={handleRaceThumbnailClick} topLabel={raceTopLabel} isActive={selectedDemographic === 'race'} />
			<AgeThumbnail onClick={handleAgeThumbnailClick} topLabel={ageTopLabel} isActive={selectedDemographic === 'age'} />
			<SexThumbnail onClick={handleSexThumbnailClick} topLabel={sexTopLabel} isActive={selectedDemographic === 'sex'} />
			<PieGraph
				responseData={phaseTwoResult}
				selectedDemographic={selectedDemographic}
				selectedPredictionRow={selectedPredictionRow}
			/>
			<AIConfidence
				responseData={phaseTwoResult}
				selectedDemographic={selectedDemographic}
				onSectionSelect={handleSectionSelect}
				onRowSelect={handleRowSelect}
				selectedPredictionRow={selectedPredictionRow}
			/>
			<BackButton onClick={handleBackClick} />
			<HomeButton onClick={handleHomeClick} />
		</main>
	);
}

export default Demographics;
