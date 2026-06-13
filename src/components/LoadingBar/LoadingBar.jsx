import './LoadingBar.css';

function LoadingBar() {
	return (
		<div className="loading-bar" aria-hidden="true">
			<div className="loading-bar-track">
				<div className="loading-bar-fill" />
			</div>
		</div>
	);
}

export default LoadingBar;
