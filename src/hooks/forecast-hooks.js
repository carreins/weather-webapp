const url = 'https://api.met.no/weatherapi/locationforecast/2.0';

function roundMinutes(date) {
    date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
    date.setMinutes(0, 0, 0);
    return date;
}

const extractWeatherData = (weatherData, getWeekend) => {
    const body = {
    };

    var date = new Date();

    if(getWeekend){
        let day = 'friday';
        let clearsky = 0, partlycloudy = 0, cloudy = 0, rain = 0;
        var nextWeekendDate = date;
        nextWeekendDate.setDate(date.getDate() + (7 + 5 - date.getDay()) % 7);
        nextWeekendDate.setMinutes(nextWeekendDate.getTimezoneOffset());
        nextWeekendDate.setHours(12);
        nextWeekendDate.setMinutes(0, 0, 0);
        for(let i = 0; i < weatherData.timeseries.length; i++){
            date = new Date(weatherData.timeseries[i].time);
            date.setMinutes(nextWeekendDate.getTimezoneOffset());
            if(nextWeekendDate.getTime() === date.getTime()){
                body[day] = {
                    min_temperature: weatherData.timeseries[i].data.next_6_hours.details.air_temperature_min,
                    max_temperature: weatherData.timeseries[i].data.next_6_hours.details.air_temperature_max,
                    icon: weatherData.timeseries[i].data.next_6_hours.summary.symbol_code
                };
                if(body[day].icon.includes("clearsky") || body[day].icon.includes('fair')) clearsky = clearsky + 1;
                else if(body[day].icon.includes("partlycloudy")) partlycloudy = partlycloudy + 1;
                else if(body[day].icon.includes("cloudy")) cloudy = cloudy + 1;
                else if(body[day].icon.includes("rain") || body[day].icon.includes("sleet")) rain = rain + 1;
                if(day === 'sunday'){
                    body.summary = (clearsky * 7) + (partlycloudy * 5) + (cloudy * 3) + (rain * (-1));
                    clearsky = 0; partlycloudy = 0; cloudy = 0; rain = 0;
                    console.log(body);
                    break;
                }else{
                    day = day === 'friday' ? 'saturday' : 'sunday';
                    nextWeekendDate.setDate(nextWeekendDate.getDate() + 1);
                }
            } 
        }   
    } else{
        var currentDate = roundMinutes(date);
        let type = 'current';

        for(let i = 0; i < weatherData.timeseries.length; i++){
            date = new Date(weatherData.timeseries[i].time);
            date.setMinutes(currentDate.getTimezoneOffset());
            if(currentDate.getTime() === date.getTime()){
                body[type] = {
                    temperature: weatherData.timeseries[i].data.instant.details.air_temperature,
                    icon: weatherData.timeseries[i].data.next_1_hours.summary.symbol_code
                };
                if(type === 'next_12_hours'){
                    break;
                }else{
                    type = type === 'current' ? 'next_6_hours' : 'next_12_hours';
                    currentDate.setHours(currentDate.getHours() + 6);
                }
            } 
        }
    }

    return body;
}

export const useGetForecast = (setError) => {
    const sendRequest = async (latitude, longitude, fn) => {
        if(!latitude || !longitude){
            setError('Koordinater mangler.');
        }else{
            try{
                const response = await fetch(`${url}/compact?lat=${latitude}&lon=${longitude}`);
            
                if(!response.ok){
                    throw new Error('Spørring feilet.');
                }

                if(fn){
                    const data = await response.json();
                    fn(extractWeatherData(data.properties));
                }
            }catch(err){
                setError(err.message || 'Noe gikk galt.');
            }
        }
    }

    return sendRequest;
};

export const useGetMultipleForecasts = (setError) => {
    const sendRequest = async (coords, getWeekend) => {
        let results = [];
        let endpoint = 'compact';
        if(getWeekend){
            endpoint = 'complete';
        }
        if(!coords || coords.length === 0){
            setError('Koordinater mangler.');
        } else {
            let index = 0;
            do {
                const {lat, lon} = coords[index];
                if(lat && lon){
                    try{
                        const response = await fetch(`${url}/${endpoint}?lat=${lat}&lon=${lon}`);
                    
                        if(!response.ok){
                            throw new Error('Spørring feilet.');
                        }
        
                        const data = await response.json();
                        coords[index].weather_data = extractWeatherData(data.properties, getWeekend);
                    }catch(err){
                        setError(err.message || 'Noe gikk galt.');
                    }
                }
                index++;
            }while(index < coords.length)
            results = coords;
        }
        return results;
    }
    return sendRequest;
}
