import './Header.css';
import headerArt from './header.svg';

function Header() {
	return (
		<header className="site-header">
			<img src={headerArt} alt="Skintristic header" className="site-header-image" />
		</header>
	);
}

export default Header;
