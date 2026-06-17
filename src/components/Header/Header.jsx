import './Header.css';
import headerArt from './header.svg';

function Header({ hideEnterCode = false }) {
	return (
		<header className="site-header">
			<img src={headerArt} alt="Skintristic header" className="site-header-image" />
			<a href="/" className="site-header-home-link" aria-label="Go to home page" />
			{hideEnterCode ? null : (
				<div className="site-header-enter-code" aria-hidden="true">
					<span className="site-header-enter-code-label">ENTER CODE</span>
				</div>
			)}
		</header>
	);
}

export default Header;
