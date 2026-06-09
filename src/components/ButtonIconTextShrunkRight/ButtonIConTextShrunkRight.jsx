import './ButtonIconTextShrunkRight.css';

function ButtonIconTextShrunkRight({ onMouseEnter, onMouseLeave, onFocus, onBlur }) {
	return (
		<button
			type="button"
			className="button-icon-text-shrunk-right"
			aria-label="Take test"
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onFocus={onFocus}
			onBlur={onBlur}
		>
			<span className="button-icon-text-shrunk-right-label">TAKE TEST</span>
			<span className="button-icon-text-shrunk-right-icon" aria-hidden="true">
				<span className="button-icon-text-shrunk-right-triangle" />
			</span>
		</button>
	);
}

export default ButtonIconTextShrunkRight;
