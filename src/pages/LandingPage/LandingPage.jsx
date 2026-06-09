import { useState } from 'react';
import './Landingpage.css';
import Header from '../../components/Header/Header';
import SophisticatedSkincare from '../../components/SophisticatedSkincare/SophisticatedSkincare';
import AIparagraph from '../../components/AIparagraph/AIparagraph';
import ButtonIconTextShrunk from '../../components/ButtonIconTextShrunk/ButtonIconTextShrunk';
import ButtonIconTextShrunkRight from '../../components/ButtonIconTextShrunkRight/ButtonIConTextShrunkRight';
import Rectangle2778 from '../../components/Rectangle2778/Rectangle2778';
import Rectangle2779 from '../../components/Rectangle2779/Rectnagle2779';

function LandingPage() {
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
			<Header />
			<SophisticatedSkincare />
			<AIparagraph />
			<ButtonIconTextShrunk
				onMouseEnter={handleDiscoverEnter}
				onMouseLeave={handleDiscoverLeave}
				onFocus={handleDiscoverEnter}
				onBlur={handleDiscoverLeave}
			/>
			<ButtonIconTextShrunkRight
				onMouseEnter={handleTakeTestEnter}
				onMouseLeave={handleTakeTestLeave}
				onFocus={handleTakeTestEnter}
				onBlur={handleTakeTestLeave}
			/>
		</div>
	);
}

export default LandingPage;
