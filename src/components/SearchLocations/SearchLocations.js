/*IMPORTS */
/*React and React module dependencies */
import { useState, useEffect, useCallback, useRef } from "react";

/*Custom components */
import SearchInput from "./SearchInput";
import SearchLocation from "./SearchLocation";

/*Custom UI components */
import LoadingSpinner from "../UI/LoadingSpinner";

/*Custom hooks */
import { useSearchLocation } from "../../hooks/location-hooks";
import { useGetMultipleForecasts } from "../../hooks/forecast-hooks";
import { filterSearch, setDisplayName } from "../../hooks/helper-methods";

/*Component stylesheet import */
import classes from "./SearchLocations.module.css";

/*IMPORTS END */

const SearchLocations = () => {
    const searchInputRef = useRef();

    const [timeUntilSearch, setTimeUntilSearch] = useState(2);
    const [custInterval, setCustInterval] = useState();
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const sendLocationRequest = useSearchLocation(setError);
    const sendForecastRequest = useGetMultipleForecasts(setError);

    //changeHandler: event handler for search input changes
    const changeHandler = e => {

        //For any change, remove previous error if exists, and reset search results
        setError(prev => null);
        setSearchResults(prev => []);

        //If search input is empty, interrupt search
        if(e.target.value.trim().length === 0){
            clearTimer();
            setIsLoading(prev => false);
            return;
        }

        //Search will execute if no input text exists and no changes are detected 
        //in the last 2 seconds

        //If interval already exists, timer is reset
        if(custInterval){
            setTimeUntilSearch(prev => 2);

        //If interval does not exist, it is created;
        //Interval counts down to search
        } else{
            setIsLoading(prev => true);
            setCustInterval(setInterval(() => {
                setTimeUntilSearch(prev => {
                    if (prev > 0) {
                        return prev - 1;
                    }  
                })
            }, 1000));
        }
    }

    //clearTimer: function to reset and remove search timer
    const clearTimer = useCallback(() => {
        setCustInterval(prev => {
            clearInterval(custInterval);
            return undefined;
        })
        setTimeUntilSearch(prev => 2);
    }, [custInterval]);

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
            results = await sendForecastRequest(results);

            //Show results if found
            if(results && results.length){
                setSearchResults(results);
            }

            //End loading
            setIsLoading(prev => false);
        }
    }, [sendLocationRequest, sendForecastRequest]);

    //useEffect method for SearchLocations component
    useEffect(() => {

        //Check if search is loading
        if(isLoading){

            //If yes, check if countdown has reached 0 and interval exists
            if(timeUntilSearch === 0 && custInterval){

                //If yes, clear timer and execute search
                clearTimer();
                handleSearch();
            } 
        }
    }, [timeUntilSearch, custInterval, isLoading, clearTimer, handleSearch])

    //Declare search content JSX below SearchInput component
    let content = <div>Ingen resultater funnet.</div>

    //Check if error is found
    if(error){
        content = <p>{error}</p>

    //Else, check if search is loading
    } else if(isLoading){
        content = <div><LoadingSpinner/></div>

    //Else, check if results are found 
    } else if(searchResults && searchResults.length > 0){

        //If yes, generate list
        content = <div className={classes["search-results"]}>
                    <ul>
                        {searchResults.map((searchRes, index) => {
                            console.log(searchRes);
                            return (
                                <li key={index}>
                                    <SearchLocation address={searchRes.address} weather={searchRes.weather_data}/>            
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
        </>
    )
};

export default SearchLocations;