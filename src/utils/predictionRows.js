const DEFAULT_AGE_ROWS = [
	{ label: '0-9', confidence: 0 },
	{ label: '10-19', confidence: 0 },
	{ label: '20-29', confidence: 0 },
	{ label: '30-39', confidence: 0 },
	{ label: '40-49', confidence: 0 },
	{ label: '50-59', confidence: 0 },
	{ label: '60-69', confidence: 0 },
	{ label: '70+', confidence: 0 },
];

const AGE_KEY_LABELS = {
	'0-9': '0-9',
	'0to9': '0-9',
	'0_9': '0-9',
	'00-09': '0-9',
	'10-19': '10-19',
	'10to19': '10-19',
	'10_19': '10-19',
	'20-29': '20-29',
	'20to29': '20-29',
	'20_29': '20-29',
	'30-39': '30-39',
	'30to39': '30-39',
	'30_39': '30-39',
	'40-49': '40-49',
	'40to49': '40-49',
	'40_49': '40-49',
	'50-59': '50-59',
	'50to59': '50-59',
	'50_59': '50-59',
	'60-69': '60-69',
	'60to69': '60-69',
	'60_69': '60-69',
	'70+': '70+',
	'70plus': '70+',
	'70andup': '70+',
	'70_': '70+',
};

const DEFAULT_RACE_ROWS = [
	{ label: 'East Asian', confidence: 96 },
	{ label: 'White', confidence: 6 },
	{ label: 'Black', confidence: 3 },
	{ label: 'South Asian', confidence: 2 },
	{ label: 'Latino Hispanic', confidence: 0 },
	{ label: 'South East Asian', confidence: 0 },
	{ label: 'Middle Eastern', confidence: 0 },
];

const RACE_KEY_LABELS = {
	eastasian: 'East Asian',
	white: 'White',
	black: 'Black',
	southasian: 'South Asian',
	latinohispanic: 'Latino Hispanic',
	southeastasian: 'South East Asian',
	middleeastern: 'Middle Eastern',
};

const DEFAULT_SEX_ROWS = [
	{ label: 'Male', confidence: 0 },
	{ label: 'Female', confidence: 0 },
];

const SEX_KEY_LABELS = {
	male: 'Male',
	man: 'Male',
	m: 'Male',
	female: 'Female',
	woman: 'Female',
	f: 'Female',
};

function toNormalizedKey(value) {
	return String(value || '')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '');
}

function toPercentNumber(value) {
	if (typeof value === 'string') {
		const cleaned = value.replace('%', '').trim();
		const parsed = Number(cleaned);
		if (!Number.isFinite(parsed)) {
			return null;
		}
		return parsed <= 1 ? Math.round(parsed * 100) : Math.round(parsed);
	}

	if (typeof value === 'number' && Number.isFinite(value)) {
		return value <= 1 ? Math.round(value * 100) : Math.round(value);
	}

	return null;
}

function tryParseJson(value) {
	if (typeof value !== 'string') {
		return null;
	}

	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) {
		return null;
	}

	try {
		return JSON.parse(trimmed);
	} catch {
		return null;
	}
}

function collectContainers(value, seen, containers, depth = 0) {
	if (!value || typeof value !== 'object' || seen.has(value) || depth > 4) {
		return;
	}

	seen.add(value);
	containers.push(value);

	if (Array.isArray(value)) {
		for (const item of value) {
			collectContainers(item, seen, containers, depth + 1);
		}
		return;
	}

	for (const nestedValue of Object.values(value)) {
		collectContainers(nestedValue, seen, containers, depth + 1);
	}
}

function normalizeAgeLabel(labelValue) {
	if (!labelValue) {
		return null;
	}

	const raw = String(labelValue).toLowerCase().trim();
	const stripped = raw.replace(/\s+/g, '');
	const normalized = stripped.replace(/[^a-z0-9+_-]/g, '');

	if (AGE_KEY_LABELS[normalized]) {
		return AGE_KEY_LABELS[normalized];
	}

	const match = normalized.match(/^(\d{1,2})[-_to]+(\d{1,2})$/);
	if (match) {
		const from = Number(match[1]);
		const to = Number(match[2]);
		if (from <= 9 && to <= 9) {
			return '0-9';
		}
		return `${from}-${to}`;
	}

	if (/^70(\+|plus|andup)?$/.test(normalized)) {
		return '70+';
	}

	const digitsOnlyMatch = normalized.match(/(\d{1,2}).*?(\d{1,2})/);
	if (digitsOnlyMatch) {
		const from = Number(digitsOnlyMatch[1]);
		const to = Number(digitsOnlyMatch[2]);
		if (Number.isFinite(from) && Number.isFinite(to)) {
			if (from <= 9 && to <= 9) return '0-9';
			if (from <= 10 && to <= 19) return '10-19';
			if (from <= 20 && to <= 29) return '20-29';
			if (from <= 30 && to <= 39) return '30-39';
			if (from <= 40 && to <= 49) return '40-49';
			if (from <= 50 && to <= 59) return '50-59';
			if (from <= 60 && to <= 69) return '60-69';
			if (from >= 70 || to >= 70) return '70+';
		}
	}

	if (/\bchild|infant|toddler|baby\b/.test(normalized)) {
		return '0-9';
	}

	if (/\bteen|adolescent\b/.test(normalized)) {
		return '10-19';
	}

	if (/\byoungadult|youngadult\b/.test(normalized)) {
		return '20-29';
	}

	if (/\badult\b/.test(normalized)) {
		return '30-39';
	}

	if (/^age\d{1,3}$/.test(normalized)) {
		const age = Number(normalized.replace('age', ''));
		if (Number.isFinite(age)) {
			if (age <= 9) return '0-9';
			if (age <= 19) return '10-19';
			if (age <= 29) return '20-29';
			if (age <= 39) return '30-39';
			if (age <= 49) return '40-49';
			if (age <= 59) return '50-59';
			if (age <= 69) return '60-69';
			return '70+';
		}
	}

	return null;
}

function bucketForAgeEstimate(ageValue) {
	if (!Number.isFinite(ageValue)) {
		return null;
	}

	if (ageValue <= 9) return '0-9';
	if (ageValue <= 19) return '10-19';
	if (ageValue <= 29) return '20-29';
	if (ageValue <= 39) return '30-39';
	if (ageValue <= 49) return '40-49';
	if (ageValue <= 59) return '50-59';
	if (ageValue <= 69) return '60-69';
	return '70+';
}

function findCandidateContainers(responseData) {
	const parsedRoot =
		typeof responseData === 'string'
			? tryParseJson(responseData)
			: responseData && typeof responseData === 'object' && typeof responseData.rawResponse === 'string'
				? tryParseJson(responseData.rawResponse) || responseData
				: responseData;

	if (!parsedRoot || typeof parsedRoot !== 'object') {
		return [];
	}

	const containers = [];
	const seen = new Set();
	collectContainers(parsedRoot, seen, containers);

	const parsedBody =
		typeof parsedRoot.body === 'string'
			? tryParseJson(parsedRoot.body)
			: typeof parsedRoot.payload === 'string'
				? tryParseJson(parsedRoot.payload)
				: null;

	const parsedData =
		typeof parsedRoot.data === 'string'
			? tryParseJson(parsedRoot.data)
			: typeof parsedRoot.result === 'string'
				? tryParseJson(parsedRoot.result)
				: null;

	collectContainers(parsedBody, seen, containers);
	collectContainers(parsedData, seen, containers);

	return containers;
}

function findFirstKey(containers, keys) {
	for (const container of containers) {
		for (const key of keys) {
			if (key in container) {
				return container[key];
			}
		}
	}
	return null;
}

function sortRows(rows) {
	return rows.sort((a, b) => b.confidence - a.confidence);
}

export function buildRaceRowsFromResponse(responseData) {
	const containers = findCandidateContainers(responseData);
	const source = findFirstKey(containers, [
		'raceConfidence',
		'race_confidence',
		'raceConfidences',
		'race_confidences',
		'race',
	]);

	if (!source) {
		return DEFAULT_RACE_ROWS;
	}

	const mapped = new Map();

	if (Array.isArray(source)) {
		for (const item of source) {
			if (!item || typeof item !== 'object') {
				continue;
			}

			const labelValue = item.race || item.label || item.name || item.ethnicity;
			const confidence = toPercentNumber(item.confidence || item.score || item.value || item.probability);
			if (!labelValue || confidence === null) {
				continue;
			}

			const normalized = toNormalizedKey(labelValue);
			const label = RACE_KEY_LABELS[normalized] || String(labelValue);
			mapped.set(label, confidence);
		}
	} else if (typeof source === 'object') {
		for (const [key, value] of Object.entries(source)) {
			const confidence = toPercentNumber(value);
			if (confidence === null) {
				continue;
			}
			const normalized = toNormalizedKey(key);
			const label = RACE_KEY_LABELS[normalized] || key;
			mapped.set(label, confidence);
		}
	}

	if (mapped.size === 0) {
		return DEFAULT_RACE_ROWS;
	}

	const mergedRows = DEFAULT_RACE_ROWS.map((defaultRow) => ({
		label: defaultRow.label,
		confidence: mapped.has(defaultRow.label) ? mapped.get(defaultRow.label) : 0,
	}));

	for (const [label, confidence] of mapped.entries()) {
		if (!mergedRows.some((row) => row.label === label)) {
			mergedRows.push({ label, confidence });
		}
	}

	return sortRows(mergedRows);
}

export function buildAgeRowsFromResponse(responseData) {
	const containers = findCandidateContainers(responseData);
	const confidenceSource = findFirstKey(containers, [
		'age',
		'ageConfidence',
		'age_confidence',
		'ageConfidences',
		'age_confidences',
		'ageDistribution',
		'age_distribution',
		'ageGroups',
		'age_groups',
		'age_predictions',
		'agePredictions',
	]);

	if (confidenceSource) {
		const mapped = new Map();
		if (Array.isArray(confidenceSource)) {
			for (const item of confidenceSource) {
				if (!item || typeof item !== 'object') {
					continue;
				}
				const label = item.ageRange || item.range || item.label || item.name || item.group || item.age;
				const mappedLabel = normalizeAgeLabel(label);
				const confidence = toPercentNumber(item.confidence || item.score || item.value || item.probability);
				if (!mappedLabel || confidence === null) {
					continue;
				}
				mapped.set(mappedLabel, confidence);
			}
		} else if (typeof confidenceSource === 'object') {
			for (const [key, value] of Object.entries(confidenceSource)) {
				const mappedLabel = normalizeAgeLabel(key);
				if (!mappedLabel) {
					continue;
				}

				const confidence =
					value && typeof value === 'object'
						? toPercentNumber(value.confidence || value.score || value.value || value.probability)
						: toPercentNumber(value);
				if (confidence === null) {
					continue;
				}
				mapped.set(mappedLabel, confidence);
			}
		}

		const mergedRows = DEFAULT_AGE_ROWS.map((defaultRow) => ({
			label: defaultRow.label,
			confidence: mapped.has(defaultRow.label) ? mapped.get(defaultRow.label) : 0,
		}));

		return mergedRows;
	}

	const estimate = findFirstKey(containers, [
		'estimatedAge',
		'estimated_age',
		'predictedAge',
		'predicted_age',
		'ageEstimate',
		'age',
	]);

	if (typeof estimate === 'number' && Number.isFinite(estimate)) {
		const bucket = bucketForAgeEstimate(Math.round(estimate));
		if (!bucket) {
			return DEFAULT_AGE_ROWS;
		}

		return DEFAULT_AGE_ROWS.map((row) => ({
			label: row.label,
			confidence: row.label === bucket ? 100 : 0,
		}));
	}

	if (typeof estimate === 'string' && estimate.trim()) {
		const asNumber = Number(estimate.trim());
		if (Number.isFinite(asNumber)) {
			const bucket = bucketForAgeEstimate(Math.round(asNumber));
			if (bucket) {
				return DEFAULT_AGE_ROWS.map((row) => ({
					label: row.label,
					confidence: row.label === bucket ? 100 : 0,
				}));
			}
		}

		const mappedLabel = normalizeAgeLabel(estimate.trim());
		if (mappedLabel) {
			return DEFAULT_AGE_ROWS.map((row) => ({
				label: row.label,
				confidence: row.label === mappedLabel ? 100 : 0,
			}));
		}

		return DEFAULT_AGE_ROWS;
	}

	if (estimate && typeof estimate === 'object') {
		const value = estimate.value || estimate.age || estimate.estimate;
		if (typeof value === 'number' && Number.isFinite(value)) {
			const bucket = bucketForAgeEstimate(Math.round(value));
			if (bucket) {
				return DEFAULT_AGE_ROWS.map((row) => ({
					label: row.label,
					confidence: row.label === bucket ? 100 : 0,
				}));
			}

			return DEFAULT_AGE_ROWS;
		}
		if (typeof value === 'string' && value.trim()) {
			const asNumber = Number(value.trim());
			if (Number.isFinite(asNumber)) {
				const bucket = bucketForAgeEstimate(Math.round(asNumber));
				if (bucket) {
					return DEFAULT_AGE_ROWS.map((row) => ({
						label: row.label,
						confidence: row.label === bucket ? 100 : 0,
					}));
				}
			}

			const mappedLabel = normalizeAgeLabel(value.trim());
			if (mappedLabel) {
				return DEFAULT_AGE_ROWS.map((row) => ({
					label: row.label,
					confidence: row.label === mappedLabel ? 100 : 0,
				}));
			}

			return DEFAULT_AGE_ROWS;
		}
	}

	return DEFAULT_AGE_ROWS;
}

export function buildSexRowsFromResponse(responseData) {
	const containers = findCandidateContainers(responseData);
	const confidenceSource = findFirstKey(containers, [
		'sexConfidence',
		'sex_confidence',
		'sexConfidences',
		'sex_confidences',
		'genderConfidence',
		'gender_confidence',
		'genderConfidences',
		'gender_confidences',
		'sexDistribution',
		'sex_distribution',
		'genderDistribution',
		'gender_distribution',
		'gender',
		'sex',
	]);

	if (confidenceSource) {
		const mapped = new Map();
		if (Array.isArray(confidenceSource)) {
			for (const item of confidenceSource) {
				if (!item || typeof item !== 'object') {
					continue;
				}
				const label = item.sex || item.gender || item.label || item.name || item.group;
				const confidence = toPercentNumber(item.confidence || item.score || item.value || item.probability);
				if (!label || confidence === null) {
					continue;
				}
				const normalized = toNormalizedKey(label);
				const mappedLabel = SEX_KEY_LABELS[normalized];
				if (!mappedLabel) {
					continue;
				}
				mapped.set(mappedLabel, confidence);
			}
		} else if (typeof confidenceSource === 'object') {
			for (const [key, value] of Object.entries(confidenceSource)) {
				const normalized = toNormalizedKey(key);
				const mappedLabel = SEX_KEY_LABELS[normalized];
				if (!mappedLabel) {
					continue;
				}

				if (typeof value === 'string' && value.trim() && !Number.isFinite(Number(value))) {
					const valueLabel = SEX_KEY_LABELS[toNormalizedKey(value)] || mappedLabel;
					mapped.set(valueLabel, 100);
					continue;
				}

				const confidence = toPercentNumber(value);
				if (confidence === null) {
					continue;
				}
				mapped.set(mappedLabel, confidence);
			}
		}

		const mergedRows = DEFAULT_SEX_ROWS.map((defaultRow) => ({
			label: defaultRow.label,
			confidence: mapped.has(defaultRow.label) ? mapped.get(defaultRow.label) : 0,
		}));

		return sortRows(mergedRows);
	}

	const estimate = findFirstKey(containers, [
		'predictedGender',
		'predicted_gender',
		'estimatedGender',
		'estimated_gender',
	]);

	if (typeof estimate === 'string' && estimate.trim()) {
		const mappedLabel = SEX_KEY_LABELS[toNormalizedKey(estimate)];
		if (!mappedLabel) {
			return DEFAULT_SEX_ROWS;
		}

		return sortRows(
			DEFAULT_SEX_ROWS.map((row) => ({
				label: row.label,
				confidence: row.label === mappedLabel ? 100 : 0,
			}))
		);
	}

	if (estimate && typeof estimate === 'object') {
		const value = estimate.value || estimate.sex || estimate.gender || estimate.label;
		if (typeof value === 'string' && value.trim()) {
			const mappedLabel = SEX_KEY_LABELS[toNormalizedKey(value)];
			if (!mappedLabel) {
				return DEFAULT_SEX_ROWS;
			}

			return sortRows(
				DEFAULT_SEX_ROWS.map((row) => ({
					label: row.label,
					confidence: row.label === mappedLabel ? 100 : 0,
				}))
			);
		}
	}

	return DEFAULT_SEX_ROWS;
}
