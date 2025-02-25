import React, { useEffect, useState } from "react";
import axios from "axios";
import './ClimateDataPage.css'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import humidity_icon from '../img/weather-icons/humidity.svg';
import temp_c_icon from '../img/weather-icons/temp_c.svg';
import carbon_icon from '../img/weather-icons/carbon.svg';


const ClimateDataPage = () => {
    const [climateData, setClimateData] = useState([]);
    const formatDate = (dataString) => {
        return new Date(dataString).toLocaleString('cs-CZ', {
            weekday: 'long',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const formatDateNoWeekday = (dateString) => {
        const formattedDate = new Date(dateString);
        const day = formattedDate.getDate().toString().padStart(2, '0');
        const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
        const hour = formattedDate.getHours().toString().padStart(2, '0');
        const minute = formattedDate.getMinutes().toString().padStart(2, '0');
        const second = formattedDate.getSeconds().toString().padStart(2, '0');

        return `${day}.${month} ${hour}:${minute}:${second}`;
    };

    useEffect(() => {
        axios
            .get("http://localhost:5000/climate_data")
            .then((response) => setClimateData(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const mostRecentData = climateData[climateData.length - 1];

    return (
        <div>
            {mostRecentData && (
                <div className="recent-data">
                    <h2>Nejnovější data</h2>
                    <div>
                        <h3>{formatDate(mostRecentData.datetime)}</h3>
                        <p><img className='data-icon' alt='ikonka co2' src={carbon_icon}/> {mostRecentData.carbon} ppm
                        </p>
                        <p><img className='data-icon' alt='ikonka teploty'
                                src={temp_c_icon}/> {mostRecentData.temperature}°C</p>
                        <p><img className='data-icon' alt='ikonka vlhkosti'
                                src={humidity_icon}/> {mostRecentData.humidity}%</p>
                    </div>
                </div>
            )}
            <ResponsiveContainer width="85%" height={400}>
                <LineChart data={climateData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="datetime" textAnchor="end" stroke="#CCCCCC" tickFormatter={formatDateNoWeekday}/>
                    <YAxis yAxisId="left" domain={[0, 2000]} stroke="#CCCCCC"/>
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#CCCCCC"/>
                    <Tooltip contentStyle={{
                        backgroundColor: "#222",
                        borderRadius: "8px",
                        border: "1px solid #555",
                        color: "#fff"
                    }}
                             labelStyle={{fontWeight: "bold", color: "#cccccc"}}
                             labelFormatter={(value) => formatDateNoWeekday(value)}/>
                    <Legend/>

                    <Line yAxisId="left" dataKey="carbon" stroke="#FF5733" name="CO2 (ppm)"/>

                    <Line yAxisId="right" dataKey="temperature" stroke="#33A1FF" name="Teplota (°C)"/>

                    <Line yAxisId="right" dataKey="humidity" stroke="#33FFBD" name="Vlhkost (%)"/>
                </LineChart>
            </ResponsiveContainer>

            <div>
                <ul>
                    {climateData.map((data, index) => (
                        <li key={index}>
                            <div>{formatDate(data.datetime)}</div>
                            <img className='data-icon' alt='ikonka co2' src={carbon_icon}/>
                            <div>Koncentrace {data.carbon} ppm</div>
                            <img className='data-icon' alt='ikonka teploty' src={temp_c_icon}/>
                            <div>Teplota {data.temperature}°C</div>
                            <img className='data-icon' alt='ikonka vlhkosti' src={humidity_icon}/>
                            <div>Vlhkost {data.humidity}%</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ClimateDataPage;