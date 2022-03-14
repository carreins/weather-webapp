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
import { useGetMultipleForecasts } from "../../hooks/forecast-hooks";
import { filterSearch, setDisplayName, useCountdownTimer } from "../../hooks/location-helper-hooks";

/*Component stylesheet import */
import classes from "./SearchLocations.module.css";

/*IMPORTS END */


/*Content */
const SearchLocations = () => {
    /*useRef */
    const searchInputRef = useRef();


    /*useState properties*/
    const [searchResults, setSearchResults] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    /*Custom hooks */
    const sendLocationRequest = useSearchLocation(setError);
    const sendForecastMultipleRequest = useGetMultipleForecasts(setError);
    const { startOrResetTimer, stopAndClearTimer, isComplete } = useCountdownTimer(1);

    
    /*Functions */
    //changeHandler: event handler for search input changes
    const changeHandler = e => {

        //For any change, remove previous error if exists, and reset search results
        setError(prev => null);
        setSearchResults(prev => []);

        //If search input is empty, interrupt search
        if(e.target.value.trim().length <= 2){
            stopAndClearTimer();
            setIsLoading(prev => false);
            return;
        }

        //Timer is started, and search will execute if no input text exists and no changes are detected 
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


    /*Built-in hooks */
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


    /*Content */
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
                                                    onSelect={() => setSelectedLocation({
                                                        latitude: searchRes.lat,
                                                        longitude: searchRes.lon,
                                                        address: searchRes.address
                                                    })}/>            
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
            {selectedLocation && <SearchModal onClose={() => setSelectedLocation()} 
                                              location={selectedLocation}/>}
        </>
    )
};

export default SearchLocations;