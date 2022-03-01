import { NavLink } from "react-router-dom";

import { ReactComponent as MenuIcon } from "./Icons/menu.svg";

import classes from "./Menu.module.css";

const Menu = props => {
    return (
        <div className={`${classes.menu} ${props.isOpen ? classes["open-menu"] : ''}`}>
                <h4>Meny</h4>
                <div data-testid="menuicon" onClick={props.onToggle}>
                    <MenuIcon  className={`${classes.toggle} ${props.isOpen ? classes["open-toggle"] : ""}`}/>
                </div>           
                <div data-testid='menulinks'>
                    <NavLink to={'/'}>Forside {"=>"}</NavLink>
                    <NavLink to={'/search'}>Søk {"=>"}</NavLink>
                    <NavLink to={'/suggestions'}>Reisetips {"=>"}</NavLink>
                </div>
        </div>
    )
};

export default Menu;