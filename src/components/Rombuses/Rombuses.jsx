import './Rombuses.css';

function Rombuses({ className = '' }) {
	return (
		<div className={`rombuses ${className}`.trim()} aria-hidden="true">
			<svg
				className="rombuses-svg"
				width="762"
				height="762"
				viewBox="0 0 764 764"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path className="rombuses-ring rombuses-ring-1" d="M382 81L683 382L382 683L81 382L382 81Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8" />
				<path className="rombuses-ring rombuses-ring-2" opacity="0.6" d="M382 41L723 382L382 723L41 382L382 41Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8" />
				<path className="rombuses-ring rombuses-ring-3" opacity="0.3" d="M382 1L763 382L382 763L1 382L382 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8" />
			</svg>
		</div>
	);
}

export default Rombuses;
