/*IMPORTS */
/*React and React module dependencies */
import { useState, useEffect, useCallback, useRef } from "react";

/*Custom components */
import SearchInput from "./SearchInput";
import SearchLocation from "./SearchLocation";

/*Custom UI components */
import LoadingSpinner from "../UI/LoadingSpinner";
import SearchModal from "./SearchModal";

/*Custom hooks */
import { useSearchLocation } from "../../hooks/location-hooks";
import { useGetForecast, useGetMultipleForecasts } from "../../hooks/forecast-hooks";
import { filterSearch, setDisplayName, useCountdownTimer } from "../../hooks/location-helper-hooks";

/*Component stylesheet import */
import classes from "./SearchLocations.module.css";

/*IMPORTS END */

const SearchLocations = () => {
    /*useRef */
    const searchInputRef = useRef();

    /*useState */
    const [searchResults, setSearchResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState();

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [modalError, setModalError] = useState(null);
    const [modalIsLoading, setModalIsLoading] = useState(false);

    const sendLocationRequest = useSearchLocation(setError);
    const sendForecastRequest = useGetForecast(setModalError);
    const sendForecastMultipleRequest = useGetMultipleForecasts(setError);
    const { startOrResetTimer, stopAndClearTimer, isComplete } = useCountdownTimer(2);

    //changeHandler: event handler for search input changes
    const changeHandler = e => {

        //For any change, remove previous error if exists, and reset search results
        setError(prev => null);
        setSearchResults(prev => []);

        //If search input is empty, interrupt search
        if(e.target.value.trim().length === 0){
            stopAndClearTimer();
            setIsLoading(prev => false);
            return;
        }

        //Search will execute if no input text exists and no changes are detected 
        //in the last 2 seconds  
        setIsLoading(prev => true);
        
        startOrResetTimer();
    }

    //handleSearch: function to handle the searching based on input value
    const handleSearch = useCallback(async () => {

        //Get current value of input through ref variable
        const curValue = searchInputRef.current.value;

        //Search for locations with matching name
        let results = await sendLocationRequest(curValue);   

        //If no results are found, interrupt
        if(results.length === 0){
            setIsLoading(prev => false);
        
        //If results are found, try to find forecasts for all found areas
        } else {

            //Set display name for search results
            results = setDisplayName(results);

            //Filter out irrelevant/unfitting results
            results = filterSearch(results);

            //Send request for remaining results
            results = await sendForecastMultipleRequest(results);

            //Show results if found
            if(results && results.length){
                setSearchResults(results);
            }

            //End loading
            setIsLoading(prev => false);
        }
    }, [sendLocationRequest, sendForecastMultipleRequest]);

    //selectHandler: function to handle selection of a single search result
    const selectHandler = (latitude, longitude, address) => {

        //If latitude and longitude are set, try to fetch weather data
        if(latitude && longitude){
            setModalIsLoading(prev => true);
            sendForecastRequest(latitude, longitude, setSelectedResult, true).then(res => {

                //Insert display name for modal usage
                setSelectedResult(prev => {
                    return {...prev, display_name: address.display_name_1 + (address.display_name_2 ? ", " + address.display_name_2 : '')}
                })
                setModalIsLoading(prev => false);
            });
        } else{
            alert("Koordinater mangler.");
        }
    }

    //When modal is closed, reset all modal properties
    const resetModal = () => {
        setModalError(null);
        setModalIsLoading(false);
        setSelectedResult();
    }

    //useEffect method for SearchLocations component
    useEffect(() => {

        //Check if search is loading
        if(isLoading){

            //If yes, check if countdown has reached 0 and interval exists
            if(isComplete){

                //If yes, clear timer and execute search
                stopAndClearTimer();
                handleSearch();
            } 
        }
    }, [isLoading, isComplete, stopAndClearTimer, handleSearch])

    //Declare search content JSX below SearchInput component
    let content = <div>Ingen resultater funnet.</div>

    if(error){

        //If error is found, display error text
        content = <p>{error}</p>
    } else if(isLoading){

        //Else if loading, display loading spinner
        content = <div><LoadingSpinner/></div>
    } else if(searchResults && searchResults.length > 0){

        //Else if search results are found, map and display list
        content = <div className={classes["search-results"]}>
                    <ul>
                        {searchResults.map((searchRes, index) => {
                            return (
                                <li key={index}>
                                    <SearchLocation address={searchRes.address} 
                                                    weather={searchRes.weather_data} 
                                                    onSelect={() => selectHandler(searchRes.lat, searchRes.lon, searchRes.address)}/>            
                                </li>
                            )
                        })} 
                    </ul>
                </div>
    }

    return (
        <>
            <h1>Søk</h1>
            <SearchInput placeholder={"Søk stedsnavn"} onChange={changeHandler} ref={searchInputRef}
                         error={error}/>
            {content}
            {(selectedResult || modalIsLoading) && <SearchModal onClose={resetModal} 
                                                                isLoading={modalIsLoading} 
                                                                error={modalError}
                                                                weatherData={selectedResult}/>}
        </>
    )
};

export default SearchLocations;