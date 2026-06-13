import './AIConfidence.css';

import {
	buildAgeRowsFromResponse,
	buildRaceRowsFromResponse,
	buildSexRowsFromResponse,
} from '../../utils/predictionRows';

function renderSectionRows(rows, sectionKey, selectedDemographic, onSectionSelect, onRowSelect, selectedPredictionRow) {
	if (rows.length === 0) {
		return <div className="ai-confidence-placeholder">No {sectionKey} information found in the API response.</div>;
	}

	const rowsToRender = (sectionKey === 'race' || sectionKey === 'age') ? rows : rows.slice(0, 3);
	const defaultActiveRow = sectionKey === 'age'
		? rowsToRender.reduce((highestRow, row) => {
			if (!highestRow || row.confidence > highestRow.confidence) {
				return row;
			}

			return highestRow;
		}, null)
	: rowsToRender[0] || null;

	return rowsToRender.map((row, index) => {
		const isActive =
			selectedPredictionRow &&
			selectedPredictionRow.section === sectionKey &&
			selectedPredictionRow.label === row.label;
		const isDefaultActive = !selectedPredictionRow && defaultActiveRow && defaultActiveRow.label === row.label;

		return (
		<button
			type="button"
			key={`${sectionKey}-${row.label}`}
			className={`ai-confidence-row${isActive || (selectedDemographic === sectionKey && isDefaultActive) ? ' ai-confidence-row-active' : ''}`}
			onClick={() => {
				onSectionSelect(sectionKey);
				onRowSelect({
					section: sectionKey,
					label: row.label,
					confidence: row.confidence,
				});
			}}
		>
			<div className="ai-confidence-row-left">
				<span className="ai-confidence-diamond" aria-hidden="true" />
				<span>{row.label}</span>
			</div>
			<div className="ai-confidence-row-right">{row.confidence} %</div>
		</button>
		);
	});
}

function getSectionConfig(responseData, selectedDemographic) {
	if (selectedDemographic === 'age') {
		return {
			sectionKey: 'age',
			headerLabel: 'AGE',
			rows: buildAgeRowsFromResponse(responseData),
		};
	}

	if (selectedDemographic === 'sex') {
		return {
			sectionKey: 'sex',
			headerLabel: 'SEX',
			rows: buildSexRowsFromResponse(responseData),
		};
	}

	return {
		sectionKey: 'race',
		headerLabel: 'RACE',
		rows: buildRaceRowsFromResponse(responseData),
	};
}

function AIConfidence({ responseData, selectedDemographic, onSectionSelect, onRowSelect, selectedPredictionRow }) {
	const { sectionKey, headerLabel, rows } = getSectionConfig(responseData, selectedDemographic);

	return (
		<div className="ai-confidence" aria-label="AI confidence visualization">
			<div className="ai-confidence-header-row">
				<div className="ai-confidence-header-race">{headerLabel}</div>
				<div className="ai-confidence-header-value">A.I CONFIDENCE</div>
			</div>
			<div className="ai-confidence-rows" role="list" aria-label="A.I confidence list">
				{renderSectionRows(rows, sectionKey, selectedDemographic, onSectionSelect, onRowSelect, selectedPredictionRow)}
			</div>
		</div>
	);
}

export default AIConfidence;
