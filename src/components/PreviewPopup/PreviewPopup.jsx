import './PreviewPopup.css';

function PreviewPopup({ onRetake, onSubmit, isSubmitting, error }) {
	return (
		<div className="preview-popup" role="dialog" aria-label="Preview">
			<h2 className="preview-popup-title">PREVIEW</h2>
			<p className="preview-popup-text">Use this photo or retake another one.</p>
			{error ? <p className="preview-popup-error">{error}</p> : null}
			<div className="preview-popup-actions">
				<button type="button" className="preview-popup-button preview-popup-button-secondary" onClick={onRetake} disabled={isSubmitting}>
					RETAKE
				</button>
				<button type="button" className="preview-popup-button preview-popup-button-primary" onClick={onSubmit} disabled={isSubmitting}>
					{isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
				</button>
			</div>
		</div>
	);
}

export default PreviewPopup;