import { useState } from 'react';
import './Landingpage.css';
import Header from '../../components/Header/Header';
import SophisticatedSkincare from '../../components/SophisticatedSkincare/SophisticatedSkincare';
import AIparagraph from '../../components/AIparagraph/AIparagraph';
import DiscoverAIButton from '../../components/DiscoverAIButton/DiscoverAIButton';
import TakeTestButton from '../../components/TakeTestButton/TakeTestButton';
import Rectangle2778 from '../../components/Rectangle2778/Rectangle2778';
import Rectangle2779 from '../../components/Rectangle2779/Rectnagle2779';
import Rombuses from '../../components/Rombuses/Rombuses';

function LandingPage({ onTakeTestClick }) {
	const [hoverSide, setHoverSide] = useState(null);

	const handleTakeTestEnter = () => {
		setHoverSide('right');
	};

	const handleTakeTestLeave = () => {
		setHoverSide((currentSide) => (currentSide === 'right' ? null : currentSide));
	};

	const handleDiscoverEnter = () => {
		setHoverSide('left');
	};

	const handleDiscoverLeave = () => {
		setHoverSide((currentSide) => (currentSide === 'left' ? null : currentSide));
	};

	return (
		<div
			className={`landing-page${hoverSide === 'right' ? ' landing-page--take-test-hover' : ''}${hoverSide === 'left' ? ' landing-page--discover-hover' : ''}`}
		>
			<Rectangle2779 />
			<Rectangle2778 />
			<Rombuses className="rombuses--left" />
			<Rombuses className="rombuses--right" />
			<Header />
			<SophisticatedSkincare />
			<AIparagraph />
			<DiscoverAIButton
				onMouseEnter={handleDiscoverEnter}
				onMouseLeave={handleDiscoverLeave}
				onFocus={handleDiscoverEnter}
				onBlur={handleDiscoverLeave}
			/>
			<TakeTestButton
				onClick={onTakeTestClick}
				onMouseEnter={handleTakeTestEnter}
				onMouseLeave={handleTakeTestLeave}
				onFocus={handleTakeTestEnter}
				onBlur={handleTakeTestLeave}
			/>
		</div>
	);
}

export default LandingPage;
