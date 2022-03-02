import { extractWeatherData, extractWeatherDataForWeekend } from "./helper-methods";

//Open source API for forecast functionality
const url = 'https://api.met.no/weatherapi/locationforecast/2.0';

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
        if(!coords || coords.length === 0) {
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
                        if(getWeekend) {
                            coords[index].weather_data = extractWeatherDataForWeekend(data.properties);
                        } else {
                            coords[index].weather_data = extractWeatherData(data.properties);
                        }
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
