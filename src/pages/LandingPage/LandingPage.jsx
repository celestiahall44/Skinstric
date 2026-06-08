import './Landingpage.css';
import Header from '../../components/Header/Header';
import SophisticatedSkincare from '../../components/SophisticatedSkincare/SophisticatedSkincare';
import AIparagraph from '../../components/AIparagraph/AIparagraph';
import ButtonIconTextShrunk from '../../components/ButtonIconTextShrunk/ButtonIconTextShrunk';
import ButtonIconTextShrunkRight from '../../components/ButtonIconTextShrunkRight/ButtonIConTextShrunkRight';
import Rectangle2778 from '../../components/Rectangle2778/Rectangle2778';
import Rectangle2779 from '../../components/Rectangle2779/Rectnagle2779';

function LandingPage() {
	return (
		<div className="landing-page">
			<Rectangle2779 />
			<Rectangle2778 />
			<Header />
			<SophisticatedSkincare />
			<AIparagraph />
			<ButtonIconTextShrunk />
			<ButtonIconTextShrunkRight />
		</div>
	);
}

export default LandingPage;
