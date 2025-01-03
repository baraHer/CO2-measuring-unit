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

    const getWeatherData = async (location) => {

        const apiUrlWeather = `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=id:${location.id}&lang=cs`
        const response = await fetch(apiUrlWeather)
        const data = await response.json()

        console.log(data)
        setWeatherData(data)
    }

    const getLocation = async () => {
        const apiUrlLocation =`${API_BASE_URL}/search.json?key=${API_KEY}&q=${locationInput}&lang=cs`
        const responseLocation = await fetch(apiUrlLocation)
        return await responseLocation.json()
    }

    const submit = async (event) => {
        event.preventDefault()
        const location = await getLocation()
        await getWeatherData(location[0])
    }

    const handleLocationInputChange = async (event) => {
        const newLocation = event.target.value;
        setLocationInput(newLocation);
        if (newLocation.length > 1) {
            const possibleLocations = await getLocation()
            let suggestedCities = []
            for (let i = 0; i < possibleLocations.length && i < 3; i++) {
                suggestedCities.push(possibleLocations[i])
                setLocationAutofill(suggestedCities)
                console.log(suggestedCities)
            }
        }
    }

    return (
        <div>
            <form onSubmit={submit}>
                <h3>Zadej obec:</h3>
                <input
                    name='obec'
                    value={locationInput}
                    onChange={(event) => {handleLocationInputChange(event)}}
                    placeholder='př. Teplice'
                    ref={cityRef}
                />
                <button>Odeslat</button>
            </form>
        </div>
    );
};

export default LocationForm;