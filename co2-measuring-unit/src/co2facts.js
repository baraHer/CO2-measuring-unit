import imgMeasurement from './img/measurement.jpg'
import imgEffects from './img/effects.jpg'
import imgAtmosphere from './img/atmosphere.jpg'

const allFacts = [
    {
        title: 'CO2 je neviditelné, ale technologie nám ho pomáhají odhalit.',
        text: 'Měření CO2 je klíčové pro pochopení kvality vzduchu. Nejčastěji se používají infračervené senzory (NDIR), které analyzují světlo absorbované molekulami CO2. Přenosné měřiče jsou praktické pro domácí použití, zatímco přesnější laboratorní přístroje pomáhají při výzkumu a monitoringu v průmyslu. Data z těchto senzorů poskytují přehled o tom, kdy je třeba větrat, nebo jak ovlivnit větrací systémy.',
        image: imgMeasurement,
        description: 'měření CO2'
    },
    {
        title: 'Vysoké hodnoty CO2 pociťujeme sami na svém těle.',
        text: 'Koncentrace CO2 v interiéru by měla být pod 800 ppm, což je ideální hladina pro koncentraci a pohodlí. Hodnoty mezi 1000 a 2000 ppm mohou způsobovat únavu, ospalost a zhoršenou produktivitu. Při více než 2000 ppm už hrozí zdravotní komplikace, jako jsou bolesti hlavy nebo závratě. Vyšší hodnoty navíc ukazují na nedostatečné větrání, což může znamenat i přítomnost dalších škodlivin ve vzduchu.',
        image: imgEffects,
        description: 'efekt na člověka'
    },
    {
        title: 'Koncentrace CO2 v atmosféře stále narůstá.',
        text: 'Atmosférická koncentrace CO2 byla před průmyslovou revolucí stabilní kolem 280 ppm. Dnes je to už přes 420 ppm, což přispívá ke skleníkovému efektu a globálním změnám klimatu. Hlavní příčinou je spalování fosilních paliv a odlesňování. Každý nárůst hladiny znamená větší oteplování planety, tání ledovců a extrémnější počasí. Monitorování CO2 je proto klíčové pro ochranu budoucnosti naší planety.',
        image: imgAtmosphere,
        description: 'Vypouštění CO2 do atmosféry'
    },
]

export default allFacts