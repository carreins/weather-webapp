/*IMPORTS */
/*React dependencies */
import { Container, Row, Col } from "react-bootstrap";

/*Component stylesheet import */
import classes from "./SearchLocation.module.css";

/*IMPORTS END */

const SearchLocation = props => {
    const {address, weather} = props;

    //Declare weather properties
    let temperature = "", imgSrc = "";

    //If weather is defined, set weather properties
    if(weather && weather.current){
        temperature = weather.current.temperature ? weather.current.temperature : '0';
        imgSrc = "Icons/" + weather.current.icon + ".svg";
    }

    return (
        <Container className={classes.container} onClick={props.onSelect}>
            <Row>
                <Col md="7" className={classes.place}>
                    <h3>
                        {address.display_name_1}
                    </h3>
                    <h5>
                        {address.display_name_2}
                    </h5>
                </Col>
                <Col md="5" className={classes["weather-container"]}>
                    <div className={classes.weather}>
                        <h1>{temperature} °C</h1>
                        <img src={imgSrc} 
                            alt="current_weather"
                            height={50}/>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default SearchLocation;