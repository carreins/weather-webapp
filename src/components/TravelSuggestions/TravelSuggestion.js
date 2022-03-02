/*IMPORTS */
/*React dependencies */
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

/*Component stylesheet import */
import classes from "./TravelSuggestion.module.css";

/*IMPORTS END */

const TravelSuggestion = props => {

    //Declare state property to expand/collapse description, if existing
    const [collapsed, setCollapsed] = useState(true);

    const {city, population, description, weather} = props;

    //Declare img source variables
    let fridaySrc = "", saturdaySrc = "", sundaySrc = "";

    //If weather is defined in props, try to set img sources
    if(weather){
        fridaySrc = weather.friday && weather.friday.icon ? "Icons/" + weather.friday.icon + ".svg" : "";
        saturdaySrc = weather.saturday && weather.saturday.icon ? "Icons/" + weather.saturday.icon + ".svg" : "";
        sundaySrc = weather.sunday && weather.sunday.icon ? "Icons/" + weather.sunday.icon + ".svg" : "";
    }
    
    return (
        <Container className={classes.container}>
            <Row>
                <Col>
                    <div className={classes.header}>
                        <h3>{city}</h3>
                        <span>{population} Innbyggere</span>
                    </div>
                    {description && 
                    <div className={`${classes.description} ${collapsed ? classes.collapsed : ''}`}
                         onClick={() => setCollapsed(prev => !prev)}>
                        {description}
                    </div>}
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5>Fredag</h5>
                    <div className={classes.forecast}>
                        <img src={fridaySrc} alt="friday" height={50}/>
                        <span>
                            {weather && weather.friday && weather.friday.min_temperature ? weather.friday.min_temperature : ''}
                            {" - "}
                            {weather && weather.friday && weather.friday.max_temperature ? weather.friday.max_temperature : ''}
                            {" °C"}
                        </span>
                    </div>
                </Col>
                <Col>
                    <h5>Lørdag</h5>
                    <div className={classes.forecast}>
                        <img src={saturdaySrc} alt="saturday" height={50}/>
                        <span>
                            {weather && weather.saturday && weather.saturday.min_temperature ? weather.saturday.min_temperature : ''}
                            {" - "}
                            {weather && weather.saturday && weather.saturday.max_temperature ? weather.saturday.max_temperature : ''}
                            {" °C"}
                        </span>
                    </div>
                </Col>
                <Col>
                    <h5>Søndag</h5>
                    <div className={classes.forecast}>
                        <img src={sundaySrc} alt="sunday" height={50}/>
                        <span>
                            {weather && weather.sunday && weather.sunday.min_temperature ? weather.sunday.min_temperature : ''}
                            {" - "}
                            {weather && weather.sunday && weather.sunday.max_temperature ? weather.sunday.max_temperature : ''}
                            {" °C"}
                        </span>
                    </div>
                </Col>
            </Row>
        </Container>
    )
};

export default TravelSuggestion;