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
import { setSortedTravelSuggestions, getNextWeekendString } from "../../hooks/location-helper-hooks";

/*Component stylesheet import */
import classes from "./TravelSuggestions.module.css";

/*Predefined data */
import Suggestions from "./Suggestions";

/*IMPORTS END */


const TravelSuggestions = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const sendRequest = useGetMultipleForecasts(setError);

    useEffect(() => {
        if(!isLoaded){
            sendRequest(Suggestions, true).then(result => {
                const sortedData = setSortedTravelSuggestions(result);
                setSuggestions(sortedData);
                setIsLoaded(true);
            });
        }
    }, [isLoaded, sendRequest]);

    //Get formatted string for next weekend dates
    const nextWeekendStr = getNextWeekendString();

    //declare variable for JSX content below header div
    let content = <></>

    //Check if any error is found
    if(!error){

        //If no error is found, check if loading is completed and results have been found
        if(isLoaded && suggestions && suggestions.length > 0){

            //If yes, generate list
            content = 
                <ul>
                    {suggestions.map((item, index) => 
                    <li key={index}>
                        <TravelSuggestion city={item.city} 
                                        population={item.population} 
                                        weather={item.weather_data}
                                        description={item.description}/>
                    </li>)}
                </ul>

        //If loading is not complete, show loading spinner
        } else if(!isLoaded){
            content = <LoadingSpinner/>
        }
    
    //If error is detected, show in paragraph
    } else {
        content = <p>{error}</p>
    }

    return (
        <>
            <div className={classes.contents}>
                <div className={classes.header}>
                    <h1>Reisetips</h1>
                    <p>Lyst til å reise? Norge har mange fine byer som er verdt et besøk. 
                        Nedenfor ser du en liste over byer i Norge; fem byer er valgt basert på værvarselet, som gjelder neste helg (<strong>{nextWeekendStr}</strong>)</p>
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