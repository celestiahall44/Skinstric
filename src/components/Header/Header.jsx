import './Header.css';
import headerArt from './header.svg';

function Header() {
	return (
		<header className="site-header">
			<a href="/" className="site-header-home-link" aria-label="Go to home page">
				<img src={headerArt} alt="Skintristic header" className="site-header-image" />
			</a>
		</header>
	);
}

export default Header;
