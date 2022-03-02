//Open source API for maps functionality
const url = 'https://nominatim.openstreetmap.org';

//useGetLocation
//Custom hook returns async function; enables calling component to fetch location data
//Param setError used to set error on state from calling component
export const useGetLocation = (setError) => {

    //Async function returned
    //If params latitude and longitude is set, request is sent to API to receive location data
    //If param fn is set, it will receive the resulting response data if the request is successful
    const sendRequest = async (latitude, longitude, fn) => {

        //If latitude or longitude is missing, add error and skip rest
        if(!latitude || !longitude){
            setError('Koordinater mangler.');
            
        } else {

            try{

                //Try to send request to maps API
                const response = await fetch(`${url}/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            
                //If request is not successful, throw error
                if(!response.ok){
                    throw new Error('Spørring feilet.');
                }

                //If fn is set, send response data through it
                if(fn){
                    const data = await response.json();
                    fn(data);
                }

            }catch(err){

                //Catch and set error 
                setError(err.message || 'Noe gikk galt.');
            }
        }
    }

    return sendRequest;
};


//useSearchLocation
//Custom hook returns async function; enables calling component to fetch search results for locations
//Param setError used to set error on state from calling component
export const useSearchLocation = (setError) => {

    //Async function returned
    //If param searchString is set, request is sent to API to fetch search results matching the param
    //Param limit sets limit on number of results
    const sendRequest = async (searchString, limit) => {

        //declare results array
        let results = [];

        //If searchString is not set, add error and skip rest
        if(!searchString){
            setError('Søkestreng mangler.');

        } else{

            try{

                //Try to send request to maps API
                const response = await fetch(`${url}/search?q=${searchString}&limit=${limit ? limit : 10}&format=json&countrycodes=no&addressdetails=1`);
            
                //If request is not successful, throw error
                if(!response.ok){
                    throw new Error('Spørring feilet.');
                }

                //If request is successful, populate results array with response data
                const data = await response.json();
                results = data;    

            }catch(err){

                //Catch and set error
                setError(err.message || 'Noe gikk galt.');
            }
        }

        return results;
    }

    return sendRequest;
}