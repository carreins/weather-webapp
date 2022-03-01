const url = 'https://nominatim.openstreetmap.org';

export const useGetLocation = (setError, setIsLoading) => {
    const sendRequest = async (latitude, longitude, fn) => {
        if(!latitude || !longitude){
            setError('Koordinater mangler.');
        }
        setIsLoading(prev => true);
        try{
            const response = await fetch(`${url}/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        
            if(!response.ok){
                throw new Error('Spørring feilet.');
            }

            if(fn){
                const data = await response.json();
                fn(data);
            }
        }catch(err){
            setError(err.message || 'Noe gikk galt.');
        }
        setIsLoading(prev => false);
    }

    return sendRequest;
};

export const useSearchLocation = (setError) => {
    const sendRequest = async (searchString, limit) => {
        let results = [];
        if(!searchString){
            setError('Søkestreng mangler.');
        }
        try{
            const response = await fetch(`${url}/search?q=${searchString}&limit=${limit ? limit : 10}&format=json&countrycodes=no&addressdetails=1`);
        
            if(!response.ok){
                throw new Error('Spørring feilet.');
            }

            const data = await response.json();
            results = data;    
        }catch(err){
            setError(err.message || 'Noe gikk galt.');
        }
        return results;
    }

    return sendRequest;
}