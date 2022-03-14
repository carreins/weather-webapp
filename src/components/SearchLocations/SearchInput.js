
/*IMPORTS */
/*React */
import React from "react";

/*Custom UI components */
import Card from "../UI/Card";

/*Component stylesheet import */
import classes from "./SearchInput.module.css";

/*IMPORTS END */

/*Content */
const SearchInput = React.forwardRef((props, ref) => {
    const { className, labelText, type, placeholder, error, onChange } = props;
    return (
        <>
            <Card className={`${classes.container} ${className ? className : ''}`}>
                {labelText && <label>{labelText}</label>}
                <input type={type ? type : "text"} 
                    placeholder={placeholder ? placeholder : "Søk"}
                    onChange={onChange}
                    ref={ref}/>
            </Card>
            {error && <p className={classes.error}>{error}</p>}
        </>
    )
});

export default SearchInput;