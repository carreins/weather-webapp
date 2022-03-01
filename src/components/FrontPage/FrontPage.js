/*IMPORTS */
/*React and React module dependencies */
import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";

/*Custom UI components */
import Card from "../UI/Card";
import LoadingSpinner from "../UI/LoadingSpinner";

/*Custom hooks */
import { useGetLocation } from "../../hooks/location-hooks";
import { useGetForecast } from "../../hooks/forecast-hooks";

/*Component stylesheet import */
import classes from "./FrontPage.module.css";

/*Stylesheet import */
import "bootstrap/dist/css/bootstrap.min.css";

/*IMPORTS END */

const FrontPage = () => {
    const [location, setLocation] = useState();
    const [forecast, setForecast] = useState();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const sendLocationRequest = useGetLocation(setError, setIsLoading);
    const sendForecastRequest = useGetForecast(setError, setIsLoading);

    const getForecast = useCallback(async () => {
        const {lat, lon} = location;
        await sendForecastRequest(lat, lon, setForecast);
    }, [location, sendForecastRequest])

    useEffect(() => {
        if(!isLoading){
            if(!location && !error){
                if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(async (pos) => {
                        await sendLocationRequest(
                            pos.coords.latitude, 
                            pos.coords.longitude,
                            setLocation);
                    }, (msg) => {
                        setError('Kan ikke vise værvarsel; geolokasjon er ikke slått på.');
                    }, {maximumAge: 60000, timeout: 5000, enableHighAccuracy: true});
                } else{
                    setError('Kan ikke vise værvarsel; geolokasjon er ikke tilgjengelig.');
                }
            }
            if(location){
                if(!forecast && !error){
                    getForecast();
                }
            }
        }
    }, [isLoading, location, sendLocationRequest, forecast, error, getForecast])

    let currentImgSrc = "", next6hoursImgSrc = "", next12hoursImgSrc = "";
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
                        {error && <p>{error}</p>}
                    </>
                </div>
            </Card>
        </>
    );
}

export default FrontPage;