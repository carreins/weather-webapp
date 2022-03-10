/*IMPORTS */
/*React and React module dependencies */
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

/*Custom UI components */
import LoadingSpinner from '../UI/LoadingSpinner';

/*Custom hooks */
import { useGetForecast } from '../../hooks/forecast-hooks';

/*Component stylesheet */
import classes from './SearchModal.module.css';

/*IMPORTS END */


//Backdrop component for visual effect of modal
const Backdrop = props => <div className={classes.backdrop} onClick={props.onClose}/>


//ModalOverlay for display of weather data
const ModalOverlay = props => {

    //Extract data from props.location
    const { latitude, longitude, address } = props.location; 


    /*useState */
    const [weather, setWeather] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    /*Custom hooks */
    const sendForecastRequest = useGetForecast(setError);


    /*Functions */
    //selectHandler: function to handle selection of a single search result
    const loadWeather = () => {

        //If latitude and longitude are set, try to fetch weather data
        if(latitude && longitude){
            setIsLoading(prev => true);
            sendForecastRequest(latitude, longitude, setWeather, true).then(res => {

                //Insert display name for modal usage
                setWeather(prev => {
                    return {...prev, display_name: address.display_name_1 + (address.display_name_2 ? ", " + address.display_name_2 : '')}
                })
                setIsLoading(prev => false);
            });
        } else{
            setError("Koordinater mangler.");
        }
    }


    /*Built-in hooks */
    //useEffect method for loading weather based on props 
    useEffect(() => {
        if(!weather && !error) {
            loadWeather();
        }
    }, [weather, error, loadWeather])


    /*Content */
    //Declare array of JSX content for display
    let weatherArray = [];

    if(weather){

        //Only enter if weather object is defined;
        //Iterate properties 
        for(const weatherInst in weather) {

            //One property in weather is the displayed name; skip this
            if(weatherInst === "display_name")
                continue;

            //Declare image source string
            let src = ""
            if(weather[weatherInst].icon){

                //set image source if property has icon 
                src = 'Icons/' + weather[weatherInst].icon + '.svg';
            }

            //Push onto array
            weatherArray.push(
                <div className={classes["weather-instance"]} key={weatherInst}>
                    <h5>{weatherInst}</h5>
                    <img src={src} alt={weatherInst} height={50}/>
                    <span>
                        {weather[weatherInst].min_temperature ? weather[weatherInst].min_temperature : ''}
                        {" - "}
                        {weather[weatherInst].max_temperature ? weather[weatherInst].max_temperature : ''}
                        {" °C"}
                    </span>
                </div>
            );
        }
    }

    return (
        <>
            <div className={classes.modal}>
                {weather && !isLoading && 
                <div className={classes.content}>
                    {weather["display_name"] && <h2>{weather["display_name"]}</h2>}
                    <h4>Værvarsel neste 7 dager</h4>
                    <div className={classes.weather}>
                        {weatherArray}
                    </div>
                </div>}
                {isLoading && <LoadingSpinner />}
                {error && <p>{error}</p>}
            </div>
        </>
    )
}



const portalElement = document.getElementById('overlays');

const Modal = props => {
    return <>
        {ReactDOM.createPortal(<Backdrop onClose={props.onClose}/>, portalElement)}
        {ReactDOM.createPortal(<ModalOverlay isLoading={props.isLoading} location={props.location}/>, portalElement)}
    </>
}

export default Modal;