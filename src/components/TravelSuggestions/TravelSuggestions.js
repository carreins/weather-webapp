/*IMPORTS */
/*React dependencies */
import { useState, useEffect } from "react";

/*Custom components */
import TravelSuggestion from "./TravelSuggestion";

/*Custom UI components */
import Card from "../UI/Card";
import LoadingSpinner from "../UI/LoadingSpinner";

/*Custom hooks */
import { useGetMultipleForecasts } from "../../hooks/forecast-hooks";
import { setSortedTravelSuggestions, getNextWeekendString } from "../../hooks/helper-methods";

/*Component stylesheet import */
import classes from "./TravelSuggestions.module.css";

/*Predefined data */
import Suggestions from "./Suggestions";

/*IMPORTS END */

const TravelSuggestions = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadedSuggestions, setLoadedSuggestions] = useState([]);

    const sendRequest = useGetMultipleForecasts(setError);

    const sortSuggestions = (data) => {
        const sortedData = setSortedTravelSuggestions(data);
        setLoadedSuggestions(prev => sortedData);
    }

    useEffect(() => {
        if(!isLoaded){
            sendRequest(Suggestions, true).then(result => {
                sortSuggestions(result);
                setIsLoaded(prev => !prev);
            });
        }
    }, [isLoaded, sendRequest]);

    const nextWeekendStr = getNextWeekendString();

    let content = <></>
    if(!error){
        if(isLoaded && loadedSuggestions && loadedSuggestions.length > 0){
            content = 
            <ul>
                {loadedSuggestions.map((item, index) => 
                <li key={index}>
                    <TravelSuggestion city={item.city} 
                                      population={item.population} 
                                      weather={item.weather_data}
                                      description={item.description}/>
                </li>)}
            </ul>
        } else if(!isLoaded){
            content = <LoadingSpinner/>
        }
    } else {
        content = <p>{error}</p>
    }

    return (
        <>
            <div className={classes.contents}>
                <div className={classes.header}>
                    <h1>Reisetips</h1>
                    <p>Lyst til å reise? Norge har mange fine byer som er verdt et besøk. 
                        Nedenfor ser du en liste over de største byene i Norge; værvarselet gjelder neste helg (<strong>{nextWeekendStr}</strong>)</p>
                </div>
                
                <div className={classes.section}>
                    <Card className={classes["list-section"]}>
                        {content}
                    </Card>
                </div>
            </div>
        </>
    )
};

export default TravelSuggestions;