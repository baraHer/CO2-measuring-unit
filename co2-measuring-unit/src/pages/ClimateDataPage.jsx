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
    Label
} from "recharts";

import humidity_icon from '../img/weather-icons/humidity.svg';
import temp_c_icon from '../img/weather-icons/temp_c.svg';
import carbon_icon from '../img/weather-icons/carbon.svg';

const ClimateDataPage = () => {
    const [climateData, setClimateData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    const fetchData = () => {
        axios
            .get("http://localhost:5000/climate_data")
            .then((response) => setClimateData(response.data.reverse())) // Reverse the data once when fetched
            .catch((error) => console.error("Error fetching data:", error));
    };

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

        return `${day}.${month} ${hour}:${minute}`;
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, []);

    const getColorBasedOnValue = (value, thresholds) => {
        if (value <= thresholds.green.max) {
            return 'green';
        } else if (value <= thresholds.orange.max) {
            return 'orange';
        } else {
            return 'red';
        }
    };

    const handlePeriodChange = (event) => {
        setCurrentPage(1);
        setSelectedPeriod(event.target.value);
    };

    const filterDataByPeriod = (data) => {
        const now = new Date();
        let filteredData = data;

        switch (selectedPeriod) {
            case 'hour':
                filteredData = data.filter(item => new Date(item.datetime) >= new Date(now - 60 * 60 * 1000));
                break;
            case '24h':
                filteredData = data.filter(item => new Date(item.datetime) >= new Date(now - 24 * 60 * 60 * 1000));
                break;
            case 'week':
                filteredData = data.filter(item => new Date(item.datetime) >= new Date(now - 7 * 24 * 60 * 60 * 1000));
                break;
            case 'month':
                filteredData = data.filter(item => new Date(item.datetime) >= new Date(now - 30 * 24 * 60 * 60 * 1000));
                break;
            default:
                break;
        }

        return filteredData;
    };

    const calculateStats = (data, key) => {
        if (data.length === 0) return { avg: '-', min: '-', max: '-' };

        const sum = data.reduce((total, item) => total + item[key], 0);
        const avg = (sum / data.length).toFixed(1);
        const min = Math.min(...data.map(item => item[key]));
        const max = Math.max(...data.map(item => item[key]));

        return { avg, min, max };
    };

    const filteredData = filterDataByPeriod(climateData);
    const reversedFilteredData = [...filteredData].reverse(); // Reverse the data for the graph

    const mostRecentData = climateData[0]; // The most recent data is the first item in the reversed array

    const temperatureStats = calculateStats(filteredData, 'temperature');
    const humidityStats = calculateStats(filteredData, 'humidity');
    const carbonStats = calculateStats(filteredData, 'carbon');

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (indexOfLastItem < filteredData.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className='climate-data-container'>
            {mostRecentData && (
                <div className="recent-data">
                    <h2>Nejnovější data:</h2>
                    <h3>{formatDate(mostRecentData.datetime)}</h3>
                    <div className='recent-data-box'>
                        <img className='data-icon' alt='ikonka co2' src={carbon_icon}/>
                        <p className={getColorBasedOnValue(mostRecentData.carbon, { green: { max: 1200 }, orange: { max: 1500 } })}>
                            {mostRecentData.carbon} ppm
                        </p>
                        <img className='data-icon' alt='ikonka teploty' src={temp_c_icon}/>
                        <p className={getColorBasedOnValue(mostRecentData.temperature, { green: { max: 24, min: 20 }, orange: { max: 25, min: 18 } })}>
                            {mostRecentData.temperature}°C
                        </p>
                        <img className='data-icon' alt='ikonka vlhkosti' src={humidity_icon}/>
                        <p className={getColorBasedOnValue(mostRecentData.humidity, { green: { max: 65, min: 30 }, orange: { max: 75, min: 20 } })}>
                            {mostRecentData.humidity}%
                        </p>
                    </div>
                </div>
            )}

            <div className="period-selection">
                <label htmlFor="period">Vyberte časové období: </label>
                <select id="period" value={selectedPeriod} onChange={handlePeriodChange}>
                    <option value="all">Celé období měření</option>
                    <option value="hour">Poslední hodina</option>
                    <option value="24h">Posledních 24 hodin</option>
                    <option value="week">Poslední týden</option>
                    <option value="month">Poslední měsíc</option>
                </select>
            </div>

            <div className="stats">
                <p><strong>CO₂:</strong> průměr: {carbonStats.avg} ppm, min: {carbonStats.min} ppm,
                    max: {carbonStats.max} ppm</p>
                <p><strong>Teplota:</strong> průměr: {temperatureStats.avg}°C, min: {temperatureStats.min}°C,
                    max: {temperatureStats.max}°C</p>
                <p><strong>Vlhkost:</strong> průměr: {humidityStats.avg}%, min: {humidityStats.min}%,
                    max: {humidityStats.max}%</p>
            </div>

            <ResponsiveContainer width="85%" height={400}>
                <LineChart data={reversedFilteredData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="datetime" textAnchor="end" stroke="#CCCCCC" tickFormatter={formatDateNoWeekday}
                           tick={{ fontSize: 12, dy: 6 }}>
                        <Label value="Datum a čas" offset={-10} position="insideBottomRight"
                               style={{fill: '#CCCCCC', fontSize: '12px', fontWeight: 'bold'}}/>
                    </XAxis>
                    <YAxis yAxisId="left" domain={[0, 2000]} stroke="#CCCCCC">
                        <Label value="CO₂ (ppm)" angle={-90} dx={-30} position="center"
                               style={{fill: '#CCCCCC', fontSize: '12px', fontWeight: 'bold'}}/>
                    </YAxis>
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#CCCCCC">
                        <Label value="Teplota (°C) / Vlhkost (%)" angle={270} position="center" dx={20}
                               style={{fill: '#CCCCCC', fontSize: '12px', fontWeight: 'bold'}}/>
                    </YAxis>
                    <Tooltip contentStyle={{
                        backgroundColor: "#222",
                        borderRadius: "8px",
                        border: "1px solid #555",
                        color: "#fff"
                    }}
                             labelStyle={{fontWeight: "bold", color: "#cccccc"}}
                             labelFormatter={(value) => formatDateNoWeekday(value)}/>
                    <Legend wrapperStyle={{ paddingTop: "10px" }}/>

                    <Line yAxisId="left" dataKey="carbon" stroke="#FF5733" name="CO₂ (ppm)"/>

                    <Line yAxisId="right" dataKey="temperature" stroke="#33A1FF" name="Teplota (°C)"/>

                    <Line yAxisId="right" dataKey="humidity" stroke="#33FFBD" name="Vlhkost (%)"/>
                </LineChart>
            </ResponsiveContainer>

            <div>
                <table style={{borderCollapse: 'separate', borderSpacing: '20px 4px'}}>
                    <thead>
                    <tr>
                        <th><p className='label-date'>Datum</p></th>
                        <th>
                            <img className='data-icon label-icon' alt='ikonka co2' src={carbon_icon}/>
                            <p className='label-text'>Koncentrace (ppm)</p>
                        </th>
                        <th>
                            <img className='data-icon label-icon' alt='ikonka teploty' src={temp_c_icon}/>
                            <p className='label-text'>Teplota (°C)</p>
                        </th>
                        <th>
                            <img className='data-icon label-icon' alt='ikonka vlhkosti' src={humidity_icon}/>
                            <p className='label-text'>Vlhkost (%)</p>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentData.map((data, index) => (
                        <tr key={index}>
                            <td>{formatDate(data.datetime)}</td>
                            <td>{data.carbon}</td>
                            <td>{data.temperature}</td>
                            <td>{data.humidity}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>{"<"}</button>
                    <button onClick={handleNextPage} disabled={indexOfLastItem >= filteredData.length}>{">"}</button>
                </div>
                <div className="pagination-info">
                    {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} ze {filteredData.length} záznamů
                </div>
            </div>
        </div>
    );
};

export default ClimateDataPage;