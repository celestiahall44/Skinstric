import './ButtonIconTextShrunk.css';

function ButtonIconTextShrunk() {
	return (
		<button type="button" className="button-icon-text-shrunk" aria-label="Discover A.I.">
			<span className="button-icon-text-shrunk-icon" aria-hidden="true">
				<span className="button-icon-text-shrunk-triangle" />
			</span>
			<span className="button-icon-text-shrunk-label">DISCOVER A.I.</span>
		</button>
	);
}

export default ButtonIconTextShrunk;
