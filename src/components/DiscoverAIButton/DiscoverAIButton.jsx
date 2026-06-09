import './DiscoverAIButton.css';

function DiscoverAIButton({ onMouseEnter, onMouseLeave, onFocus, onBlur }) {
	return (
		<button
			type="button"
			className="discover-ai-button"
			aria-label="Discover A.I."
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onFocus={onFocus}
			onBlur={onBlur}
		>
			<span className="discover-ai-button-icon" aria-hidden="true">
				<span className="discover-ai-button-triangle" />
			</span>
			<span className="discover-ai-button-label">DISCOVER A.I.</span>
		</button>
	);
}

export default DiscoverAIButton;
