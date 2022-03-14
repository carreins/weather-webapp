/*IMPORTS */
/*React and React module dependencies */
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

/*Custom UI components */
import Card from "../UI/Card";
import LoadingSpinner from "../UI/LoadingSpinner";

/*Custom hooks */
import { useGetLocation } from "../../hooks/location-hooks";
import { useGetForecast } from "../../hooks/forecast-hooks";

/*Component stylesheet import */
import classes from "./FrontPage.module.css";

/*IMPORTS END */

const FrontPage = () => {

    /*useState */
    const [location, setLocation] = useState();
    const [forecast, setForecast] = useState();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    /*Custom hooks */
    const sendLocationRequest = useGetLocation(setError);
    const sendForecastRequest = useGetForecast(setError);


    /*Built-in hooks */
    //useEffect method
    useEffect(() => {

        //Check if location data is already loading
        if(!isLoading){

            //If not, check if loading of location is done or failed
            if(!location && !error){

                //If location loading is not done or failed, try to get from geolocation
                if(navigator.geolocation){

                    //Call to custom location hook to determine name of location
                    //Params: 
                    //1. Callback function fecthes location information
                    //2. Error handling sets error and interrupts loading
                    //3. Extra parameters: location data is no older than 60 seconds,
                    //   timeout for request is 5 seconds, high accuracy of position
                    //   is enabled

                    //NB: high accuracy is enabled, but geolocations is still somewhat off
                    navigator.geolocation.getCurrentPosition(async (pos) => {
                        await sendLocationRequest(
                            pos.coords.latitude, 
                            pos.coords.longitude,
                            setLocation);
                    }, (msg) => {
                        setError('Kan ikke vise værvarsel; geolokasjon er ikke slått på.');
                        setIsLoading(prev => false);
                    }, {maximumAge: 60000, timeout: 5000, enableHighAccuracy: true});
                } else{
                    setError('Kan ikke vise værvarsel; geolokasjon er ikke tilgjengelig.');
                }
            }

            //If location is found, go inside
            if(location){

                //If forecast of found location is not fetched, and no error is found, 
                //try to fetch forecast
                if(!forecast && !error){
                    const {lat, lon} = location;
                    sendForecastRequest(lat, lon, setForecast).then(res => setIsLoading(prev => false));
                }
            }
        }
    }, [isLoading, location, sendLocationRequest, forecast, error, sendForecastRequest])


    /*Content */
    //Declare source variables for forecast images
    let currentImgSrc = "", next6hoursImgSrc = "", next12hoursImgSrc = "";

    //If forecast is found, try to set image sources. If match is found in public/Icons folder,
    //icon will display in page
    if(forecast){
        if(forecast.current){
            currentImgSrc = "Icons/" + forecast.current.icon + ".svg";
        }
        if(forecast.next_6_hours){
            next6hoursImgSrc = "Icons/" + forecast.next_6_hours.icon + ".svg";
        }
        if(forecast && forecast.next_12_hours){
            next12hoursImgSrc = "Icons/" + forecast.next_6_hours.icon + ".svg";
        }
    }

    return (
        <>
            <h1>Velkommen til vær-appen</h1>
            <Card>
                <div className={classes.location}>
                    <>
                        <Container>
                            <Row>
                                <Col md="7">
                                    <div className={classes.header}>
                                        <span>Ditt område</span>
                                        <h2>
                                            {location && location.address ? location.address.suburb : ""}, {" "}
                                            {location && location.address ? location.address.municipality : ""}
                                        </h2>
                                    </div>
                                </Col>
                                <Col md="5">
                                    <div className={classes.current}>
                                        <span>{forecast && forecast.current ? forecast.current.temperature : ""} °C</span>
                                        <img src={currentImgSrc} alt="current_weather" height={50}/>
                                    </div>
                                    
                                </Col>
                            </Row>
                            <div className={classes.filler} />
                            <Row>
                                <Col>
                                    <div>
                                        <h5>Neste 6 timer</h5>
                                        <span>{forecast && forecast.next_6_hours ? forecast.next_6_hours.temperature : ""} °C</span>
                                        <img src={next6hoursImgSrc} alt="next_6_hours_weather" height={35}/>
                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        <h5>Neste 12 timer</h5>
                                        <span>{forecast && forecast.next_12_hours ? forecast.next_12_hours.temperature : ""} °C</span>
                                        <img src={next12hoursImgSrc} alt="next_12_hours_weather" height={35}/>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                        {isLoading && !error && <LoadingSpinner className={classes.spinner}/>}
                    </>
                </div>
            </Card>
            {error && <p className={classes.error}>{error}</p>}
        </>
    );
}

export default FrontPage;