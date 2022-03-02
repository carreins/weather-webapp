/*IMPORTS */
/*React dependencies */
import { useState, useReducer, useEffect } from "react";

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

//Initial state for reducer
const initSuggestionState = { isLoaded: false, sortOnTemp: false, suggestions: [] }

//suggestionsReducer: function for reducer handling on suggestions loading/sorting
const suggestionsReducer = (state, action) => {
    switch(action.type){
        case 'REFRESH':
            return { isLoaded: true, sortOnTemp: state.sortOnTemp, suggestions: action.data }
        case 'SORT_ON_TEMP':
            return { isLoaded: state.sortOnTemp === true, sortOnTemp: true, suggestions: state.suggestions }
        case 'SORT_ON_WEATHER':
            return { isLoaded: state.sortOnTemp === false, sortOnTemp: false, suggestions: state.suggestions }
    }
    return initSuggestionState;
}

const TravelSuggestions = () => {
    const [error, setError] = useState(null);
    const [suggestionsState, suggestionsDispatcher] = useReducer(suggestionsReducer, initSuggestionState)

    const sendRequest = useGetMultipleForecasts(setError);

    const {isLoaded, sortOnTemp, suggestions} = suggestionsState;

    useEffect(() => {
        if(!isLoaded){
            sendRequest(Suggestions, true).then(result => {
                const sortedData = setSortedTravelSuggestions(result, sortOnTemp);
                suggestionsDispatcher({type: 'REFRESH', data: sortedData});
            });
        }
    }, [isLoaded, sendRequest, sortOnTemp]);

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
                        Nedenfor ser du en liste over de største byene i Norge; værvarselet gjelder neste helg (<strong>{nextWeekendStr}</strong>)</p>
                </div>
                <div className={classes.sort}>
                    <button className={sortOnTemp ? '' : classes.active}
                        onClick={() => suggestionsDispatcher({type: 'SORT_ON_WEATHER'})}>
                        Sorter etter vær
                    </button>
                    <button className={sortOnTemp ? classes.active : ''}
                        onClick={() => suggestionsDispatcher({type: 'SORT_ON_TEMP'})}>
                        Sorter etter gj. temperatur
                    </button>
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