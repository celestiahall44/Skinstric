import './ButtonIconTextShrunkRight.css';

function ButtonIconTextShrunkRight() {
	return (
		<button type="button" className="button-icon-text-shrunk-right" aria-label="Take test">
			<span className="button-icon-text-shrunk-right-label">TAKE TEST</span>
			<span className="button-icon-text-shrunk-right-icon" aria-hidden="true">
				<span className="button-icon-text-shrunk-right-triangle" />
			</span>
		</button>
	);
}

export default ButtonIconTextShrunkRight;
