import FactTabs from "../components/FactTabs";
import AppIntroduction from "../components/AppIntroduction";
const MainPage = () => {
    const slogans = [
        'Víte, že lidský dech je hlavním zdrojem CO2 v interiéru?',
        'Vysoká koncentrace CO2 snižuje schopnost soustředit se.',
        'Hladinu CO2 lze snížit dostatečnou ventilací.',
        'Infračervené senzory jsou nejběžnější technologií pro měření CO2.',
        'CO2 v atmosféře přispívá k oteplování planety.',
    ]

    const randomIndex = Math.floor(Math.random() * 5)

    return (
        <div>
            <p>{slogans[randomIndex]}</p>
            <AppIntroduction />
            <FactTabs />
        </div>
    );
};

export default MainPage;