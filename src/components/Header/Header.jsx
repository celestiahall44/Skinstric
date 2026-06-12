import './Header.css';
import headerArt from './header.svg';

function Header({ hideEnterCode = false }) {
	const headerClassName = `site-header${hideEnterCode ? ' site-header--hide-enter-code' : ''}`;

	return (
		<header className={headerClassName}>
			<img src={headerArt} alt="Skintristic header" className="site-header-image" />
			<a href="/" className="site-header-home-link" aria-label="Go to home page" />
			<div
				className="site-header-enter-code-blocker"
				onClick={(event) => {
					event.preventDefault();
					event.stopPropagation();
				}}
				aria-hidden="true"
			/>
		</header>
	);
}

export default Header;
