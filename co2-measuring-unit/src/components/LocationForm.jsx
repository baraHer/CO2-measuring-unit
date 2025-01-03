import './LocationForm.css'

import {useEffect, useRef, useState} from "react";

const LocationForm = () => {

    const cityRef = useRef(null)

    useEffect(() => {
        cityRef?.current.focus()
    }, [])

    const [locationAutofill, setLocationAutofill] = useState([])
    const [locationInput, setLocationInput] = useState('')
    const [weatherData, setWeatherData] = useState(null)

    const API_BASE_URL = 'http://api.weatherapi.com/v1'
    const API_KEY = '0e813ae11e09437e95934223250301'

    useEffect(() => {
        if (weatherData) {
            console.log(weatherData);
        }
    }, [weatherData]);

    const getWeatherData = async (location) => {
        try {
            const apiUrlWeather = `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=id:${location.id}&lang=cs`
            const response = await fetch(apiUrlWeather)
            const data = await response.json()

            setWeatherData(data)
        }
        catch (error) {
            console.log(error)
        }
    }

    const getLocation = async () => {
        const apiUrlLocation =`${API_BASE_URL}/search.json?key=${API_KEY}&q=${locationInput}&lang=cs`
        try {
            const responseLocation = await fetch(apiUrlLocation)
            return await responseLocation.json()
        }
        catch (error) {
            console.error(error)
        }
    }

    const submit = async (event) => {
        event.preventDefault()
        const location = await getLocation()
        await getWeatherData(location[0])
    }

    const submitDirect = async (suggestedCity) => {
        await getWeatherData(suggestedCity)
    }

    const handleLocationInputChange = async (event) => {
        const newLocation = event.target.value;
        setLocationInput(newLocation);
        if (newLocation.length > 2) {
            const possibleLocations = await getLocation()
            const suggestedCities = possibleLocations.slice(0, 3)
            setLocationAutofill(suggestedCities)
        }
        else {
            setLocationAutofill([])
        }
    }

    return (
        <div>
            <form>
                <h3>Zadej obec:</h3>
                <input
                    name='obec'
                    value={locationInput}
                    onChange={(event) => {handleLocationInputChange(event)}}
                    placeholder='př. Teplice'
                    ref={cityRef}
                />
                <div className='autofill-box'>
                    {
                        locationAutofill.map( (suggestedCity, index) => {
                            const {name, region, country} = suggestedCity
                            return <button type='button' onClick={ () => submitDirect(suggestedCity)} key={index}>{`${name}, ${region}, ${country}`}</button>
                        })
                    }
                </div>
                <button className='submit-btn' onClick={submit} disabled={locationInput.length < 3}>
                    {locationInput.length < 3 || 'Zobraz předpověď!'}
                    {locationInput.length < 3 && 'Zadej alespoň 3 znaky!'}
                </button>
            </form>
        </div>
    );
};

export default LocationForm;