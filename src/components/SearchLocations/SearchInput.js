
/*IMPORTS */
/*React */
import React from "react";

/*Custom UI components */
import Card from "../UI/Card";

/*Component stylesheet import */
import classes from "./SearchInput.module.css";

/*IMPORTS END */

const SearchInput = React.forwardRef((props, ref) => {
    return (
        <Card className={`${classes.container} ${props.className ? props.className : ''}`}>
            {props.labelText && <label>{props.labelText}</label>}
            <input type={props.type ? props.type : "text"} 
                   placeholder={props.placeholder ? props.placeholder : "Søk"}
                   onChange={props.onChange}
                   ref={ref}/>
        </Card>
    )
});

export default SearchInput;