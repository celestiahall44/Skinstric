import './ProceedButton.css';

function ProceedButton({ onClick, className = '' }) {
	const buttonClassName = `proceed-button ${className}`.trim();

	return (
		<button type="button" className={buttonClassName} aria-label="Proceed" onClick={onClick}>
			<span className="proceed-button-label">PROCEED</span>
			<svg
				className="proceed-button-icon"
				width="44"
				height="44"
				viewBox="0 0 44 44"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M43.293 22L22 43.293L0.707031 22L22 0.707031L43.293 22Z" stroke="#1A1B1C" />
				<path d="M28.2856 22L18.8571 16.5564V27.4436L28.2856 22Z" fill="#1A1B1C" />
			</svg>
		</button>
	);
}

export default ProceedButton;
