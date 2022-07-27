import './css/adminPage.css'
import {Link} from 'react-router-dom';

export default function AdminNav() {
    return (
        <div>
            <nav className="navbar navbar-dark bg-primary">
                <div style={{float: 'left'}}>
                    <span style={{color: "white", fontWeight: "bolder", marginLeft: "5px"}}>
                        DeepBasket
                    </span>
                </div>
                <div id="optionsDiv" style={{float: "right", marginRight: "5px"}}>
                    <Link to="/" className="adminNavOptions">
                        Staff
                    </Link>
                    <Link to="/func_control_panel/productTree" className="adminNavOptions">
                        Products
                    </Link>
                    <Link to="/" className="adminNavOptions">
                        Surf
                    </Link>
                </div>
            </nav>
        </div>
    )
}