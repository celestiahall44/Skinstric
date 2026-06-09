import './TakeTestButton.css';

function TakeTestButton({ onClick, onMouseEnter, onMouseLeave, onFocus, onBlur }) {
	return (
		<button
			type="button"
			className="take-test-button"
			aria-label="Take test"
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onFocus={onFocus}
			onBlur={onBlur}
		>
			<span className="take-test-button-label">TAKE TEST</span>
			<span className="take-test-button-icon" aria-hidden="true">
				<span className="take-test-button-triangle" />
			</span>
		</button>
	);
}

export default TakeTestButton;
