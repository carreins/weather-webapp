import ReactDOM from 'react-dom';

import LoadingSpinner from '../UI/LoadingSpinner';

import classes from './SearchModal.module.css';

const Backdrop = props => <div className={classes.backdrop} onClick={props.onClose}/>

const ModalOverlay = props => {
    const { weatherData: weather, isLoading, error } = props; 

    let weatherArray = [];

    for(const weatherInst in weather) {
        if(weatherInst === "display_name")
            continue;
        let src = ""
        if(weather[weatherInst].icon){
            src = 'Icons/' + weather[weatherInst].icon + '.svg';
        }
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
        {ReactDOM.createPortal(<ModalOverlay isLoading={props.isLoading} weatherData={props.weatherData}/>, portalElement)}
    </>
}

export default Modal;