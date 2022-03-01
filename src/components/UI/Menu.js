/*IMPORTS */
/*React module dependencies */
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

/*Menu icon SVG as ReactComponent */
import { ReactComponent as MenuIcon } from "./Icons/menu.svg";

/*Component stylesheet import */
import classes from "./Menu.module.css";

/*IMPORTS END */

const Menu = props => {
    const { pathname } = useLocation();

    const [currentPage, setCurrentPage] = useState("/");

    useEffect(() => {
        if(pathname !== currentPage){
            setCurrentPage(prev => pathname);
        }
    }, [pathname, currentPage])

    const isFrontpage = currentPage === "/";
    const isSearch = currentPage === "/search";
    const isSuggestions = currentPage === "/suggestions";
    return (
        <div className={`${classes.menu} ${props.isOpen ? classes["open-menu"] : ''}`}>
                <h4>Meny</h4>
                <div data-testid="menuicon" onClick={props.onToggle}>
                    <MenuIcon  className={`${classes.toggle} ${props.isOpen ? classes["open-toggle"] : ""}`}/>
                </div>           
                <div data-testid='menulinks'>
                    {isFrontpage && <strong>Forside</strong>}
                    {!isFrontpage && <NavLink to={'/'}>Forside {"=>"}</NavLink>}
                    {isSearch && <strong>Søk</strong>}
                    {!isSearch && <NavLink to={'/search'}>Søk {"=>"}</NavLink>}
                    {isSuggestions && <strong>Reisetips</strong>}
                    {!isSuggestions && <NavLink to={'/suggestions'}>Reisetips {"=>"}</NavLink>}
                </div>
        </div>
    )
};

export default Menu;