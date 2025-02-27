import './MainPage.css'
import introductionImg from '../img/introduction.webp'

import FactTabs from "../components/FactTabs";
import AppIntroduction from "../components/AppIntroduction";
import Footer from "../components/Footer";
const MainPage = () => {
    const slogans = [
        'Víte, že lidský dech je hlavním zdrojem CO₂ v interiéru?',
        'Vysoká koncentrace CO₂ snižuje schopnost soustředit se.',
        'Hladinu CO₂ lze snížit dostatečnou ventilací.',
        'Infračervené senzory jsou nejběžnější technologií pro měření CO₂.',
        'CO₂ v atmosféře přispívá k oteplování planety.',
    ]

    const randomIndex = Math.floor(Math.random() * 5)

    return (
        <div>
            <div className='banner'>
                <img src={introductionImg} alt='krajina'/>
                <h1>Klimastanice</h1>
                <p className='slogan'>{slogans[randomIndex]}</p>
            </div>
            <AppIntroduction />
            <FactTabs />
            <Footer />
        </div>
    );
};

export default MainPage;