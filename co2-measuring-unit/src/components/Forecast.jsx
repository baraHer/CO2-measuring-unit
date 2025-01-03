import './Forecast.css'

import localtime_icon from '../img/weather-icons/localtime.svg';import feelslike_c_icon from '../img/weather-icons/feelslike_c.svg';
import humidity_icon from '../img/weather-icons/humidity.svg';
import precip_mm_icon from '../img/weather-icons/precip_mm.svg';
import pressure_mb_icon from '../img/weather-icons/pressure_mb.svg';
import temp_c_icon from '../img/weather-icons/temp_c.svg';
import wind_kph_icon from '../img/weather-icons/wind_kph.svg';

import ForecastDataBox from "./ForecastDataBox";

const Forecast = ({weatherData}) => {
    const {location, current, forecast} = weatherData

    const {name, country, localtime} = location
    const {condition, temp_c, feelslike_c, precip_mm, wind_kph, humidity, pressure_mb} = current

    const weatherAttributes = [
        { name: 'Teplota', data: temp_c, unit: ' °C', icon: temp_c_icon },
        { name: 'Pocitová teplota', data: feelslike_c, unit: ' °C', icon: feelslike_c_icon },
        { name: 'Srážky', data: precip_mm, unit: ' mm', icon: precip_mm_icon },
        { name: 'Vítr', data: wind_kph, unit: ' km/h', icon: wind_kph_icon },
        { name: 'Vlhkost vzduchu', data: humidity, unit: ' %', icon: humidity_icon },
        { name: 'Tlak', data: (pressure_mb / 10).toFixed(1), unit: ' kPa', icon: pressure_mb_icon }
    ];

    const formatDateTime = (dateTime) => {
        const [date, time] = dateTime.split(' ');
        const [year, month, day] = date.split('-');
        return `${time} ${day}.${month}.${year}`;
    };

    return (
        <div className='full-forecast-box'>
            <h2>{name + ', ' + country}</h2>
            <h3>{formatDateTime(localtime)}</h3>
            <h3>Počasí dnes: {condition.text}</h3>
            <div className='weather-attributes-box'>
                {
                    weatherAttributes.map( (attribute, index) => {
                        const {name, data, unit, icon} = attribute
                        return <ForecastDataBox key={index} header={name} data={data+unit} icon={icon}/>
                    })
                }
            </div>
        </div>
    );
};

export default Forecast;