import classes from "./MainArea.module.css"

const MainArea = props => {
    return (
        <div className={`${classes.mainarea} ${props.menuIsOpen ? classes.menuopen : ""}`}>{props.children}</div>
    )
}

export default MainArea;