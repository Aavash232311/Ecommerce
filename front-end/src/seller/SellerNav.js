import './css/seller_nav.css'
import {Link} from "react-router-dom";
import {BsFillBagPlusFill, BsInfoLg} from "react-icons/bs";
import {FcHome} from 'react-icons/fc';

export default function SellerNav() {
    return (
        <div id="nav_bar">
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
    )
}