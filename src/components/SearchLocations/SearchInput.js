
import React from "react";
import Card from "../UI/Card";

import classes from "./SearchInput.module.css";

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