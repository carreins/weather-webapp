/*IMPORTS */
/*Custom hooks */
import { extractWeatherData, extractWeatherDataForWeek, extractWeatherDataForWeekend } from "./forecast-helper-hooks";

/*IMPORTS END */

//Open source API for forecast functionality
const url = 'https://api.met.no/weatherapi/locationforecast/2.0';

//useGetForecast
//Custom hook returns async function; enables calling component to fetch forecast data
//Param setError used to set error on state from calling component
export const useGetForecast = (setError) => {

    //Async function returned
    //If params latitude and longitude is set, request is sent to API to receive forecast data
    //If param fn is set, it will receive the resulting response data if the request is successful
    //If param getWeek is true, forecast for entire week is fetched
    const sendRequest = async (latitude, longitude, fn, getWeek) => {

        //If latitude or longitude is missing, add error and skip rest
        if(!latitude || !longitude){
            setError('Koordinater mangler.');

        } else {

            try{

                //Try to send request to forecast API
                const response = await fetch(`${url}/${getWeek ? 'complete' : 'compact'}?lat=${latitude}&lon=${longitude}`);
            
                //If request is not successful, throw error
                if(!response.ok){
                    throw new Error('Spørring feilet.');
                }

                //If fn is set, send response data through it
                if(fn){
                    const data = await response.json();
                    let extractedData = [];

                    if(getWeek){
                        extractedData = extractWeatherDataForWeek(data.properties);

                    } else {
                        extractedData = extractWeatherData(data.properties);
                        
                    }
                    fn(extractedData);
                }

            }catch(err){

                //Catch and set error
                setError(err.message || 'Noe gikk galt.');
            }
        }
    }

    return sendRequest;
};


//useGetMultipleForecasts
//Custom hook returns async function; enables calling component to fetch forecast data
//Param setError used to set error on state from calling component
export const useGetMultipleForecasts = (setError) => {

    //Async function returned
    //If param coords is set, request is sent to API to fetch search results matching the param
    //Param getWeekend is used to extract data based on API call:
    //  - If true, weather data for next weekend is fetched
    //  - Otherwise, weather data for current time, next 6 hours and next 12 hours is fetched
    const sendRequest = async (coords, getNextweekend) => {

        //Declare results array
        let results = [];

        //If coords are undefined or empty, add error and skip rest
        if(!coords || coords.length === 0) {
            setError('Koordinater mangler.');

        } else {

            //Declare endpoint for forecast API
            let endpoint = 'compact';

            //If getWeekend is defined and true, change endpoint to receive different data
            if(getNextweekend){
                endpoint = 'complete';
            }

            //Declare starting index
            let index = 0;

            // Do/While
            do {

                //Declare variables for latitude and longitude on current array index
                const {lat, lon} = coords[index];

                //If latitude and longitude are defined, continue
                if(lat && lon){

                    try{

                        //Try to send request to forecast API
                        const response = await fetch(`${url}/${endpoint}?lat=${lat}&lon=${lon}`);
                    
                        //If request is not successful, throw error
                        if(!response.ok){
                            throw new Error('Spørring feilet.');
                        }
        
                        //Get data from response
                        const data = await response.json();

                        //Extract data and set on array
                        if(getNextweekend) {
                            coords[index].weather_data = extractWeatherDataForWeekend(data.properties);

                        } else {
                            coords[index].weather_data = extractWeatherData(data.properties);

                        }

                    }catch(err){

                        //Catch and set error
                        setError(err.message || 'Noe gikk galt.');
                    }
                }

                //Increase index
                index++;

            }while(index < coords.length)

            //Once loop is done, set results array
            results = coords;
        }

        return results;
    }
    
    return sendRequest;
}
