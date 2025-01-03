import './FactTabs.css'
import allFacts from "../co2facts";

import {useState} from "react";

import OneFactTab from "./OneFactTab";

const FactTabs = () => {
    const [tab, setTab] = useState(0)
    const { title, text, image, description } = allFacts[tab]

    return (
        <section>
            <h2>Poznej svého tichého spolubydlícího – CO2</h2>

            <div className='fact-tab-btns'>
                <button className={tab === 0 ? 'active-tab-btn' : ''} onClick={ () => {setTab(0)} }>Jak fungují měřiče CO2?</button>
                <button className={tab === 1 ? 'active-tab-btn' : ''} onClick={ () => {setTab(1)} }>Kdy už je CO2 moc?</button>
                <button className={tab === 2 ? 'active-tab-btn' : ''} onClick={ () => {setTab(2)} }>CO2 v atmosféře</button>
            </div>

            <OneFactTab title={title} text={text} image={image} description={description}/>
        </section>
    );
};

export default FactTabs;