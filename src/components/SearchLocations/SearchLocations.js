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

    const changeHandler = e => {
        setError(prev => null);
        setSearchResults(prev => []);
        if(e.target.value.trim().length === 0){
            clearTimer();
            setIsLoading(prev => false);
            return;
        }
        if(custInterval){
            setTimeUntilSearch(prev => 2);
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

    const clearTimer = useCallback(() => {
        setCustInterval(prev => {
            clearInterval(custInterval);
            return undefined;
        })
        setTimeUntilSearch(prev => 2);
    }, [custInterval]);

    const handleSearch = useCallback(async () => {
        const curValue = searchInputRef.current.value;
        let results = await sendLocationRequest(curValue);   
        if(results.length === 0){
            setIsLoading(prev => false);
        } else {
            results = await sendForecastRequest(results);
            if(results && results.length){
                results = setDisplayName(results);
                results = filterSearch(results);
                setSearchResults(results);
            }
            setIsLoading(prev => false);
        }
    }, [sendLocationRequest, sendForecastRequest]);

    useEffect(() => {
        if(isLoading){
            if(timeUntilSearch === 0 && custInterval){
                clearTimer();
                handleSearch();
            } 
        }
    }, [timeUntilSearch, custInterval, searchResults, isLoading, clearTimer, handleSearch])

    let content = <div>Ingen resultater funnet.</div>
    if(error){
        content = <p>{error}</p>
    } else if(isLoading){
        content = <div><LoadingSpinner/></div>
    } else if(searchResults && searchResults.length > 0){
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