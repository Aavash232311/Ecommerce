import './css/seller_nav.css'
import {Link} from "react-router-dom";
import {BsFillBagPlusFill, BsInfoLg, BsFillHddStackFill} from "react-icons/bs";
import {FcHome} from 'react-icons/fc';
import {useEffect, useState, useRef} from "react";

export default function SellerNav() {
    const sliders = useRef(null);
    const [sideNav, setSideNav] = useState(false);

    const block = {
        display: "none"
    }

    const show = {
        display: "block"
    }

    const leftTrim = {
        float: "left",
        marginLeft: "5px"
    }


    window.addEventListener('resize', function () {
        navTrim(window.innerWidth);
    });

    useEffect(() => {
        navTrim(window.innerWidth);
    }, []);

    function navTrim(width) {
        if (width <= 1000) {
            setSideNav(true);
        } else {
            setSideNav(false);
        }
    }

    const shrinkNav = () => {
        if (sideNav) {
            setSideNav(false);
        } else {
            setSideNav(true);
        }
    }

    const rightTrim = {
        marginLeft: "220px"
    }

    const shrinkNavCheck = () => {
        if (window.innerWidth <= 1000) {
            return true;
        } else {
            return false;
        }
    }

    const mobileNavTrim = {
        marginLeft: "60px"
    }

    return (
        <div>
            <div id="stackIcon">
                <BsFillHddStackFill style={sideNav ? leftTrim : shrinkNavCheck() ? mobileNavTrim : rightTrim}
                                    onClick={shrinkNav} id="icnStack"/>
            </div>
            <div ref={sliders} style={sideNav ? block : show} id="nav_bar">
                <center id="branchLogo">
                    <br/>
                    <span id="logoTag">DeepBasket</span>
                </center>
                <hr id="logoBreak" style={{borderBottom: "1px solid white"}}/>
                <Link className="sideNavLinks" to="/sellers/seller_form"><BsInfoLg className="mobileNavIcons"/>
                    <span className="nav_labels">Personal Info</span></Link>
                <hr/>
                <Link className="sideNavLinks" to="/sellers/add_product"><BsFillBagPlusFill className="mobileNavIcons"/>
                    <span className="nav_labels">Add product</span></Link>
                <hr/>
                <Link className="sideNavLinks" to="/"><FcHome className="mobileNavIcons"/>
                    <span className="nav_labels">surf</span></Link>

            </div>
        </div>
    )
}