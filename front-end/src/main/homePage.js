import 'bootstrap/dist/css/bootstrap.min.css';
import './css/home_page_css.css'
import {Link} from 'react-router-dom';
import React, {useContext, useEffect, useRef} from "react";
import Progress_bar from "./progress_bar";
import AuthContext from '../context/AuthContext'
import {currentDOMAIN} from "../essentials";


function HomePage() {
    let {user, logOut, token, logoutUser} = useContext(AuthContext);
    let progressBarRef = useRef(null);

    let getNotes = async () => {
        if (token === null) {
            logOut();
            return;
        }
        let response = await fetch(currentDOMAIN() + '/func_control_panel/ProductTreeBase', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(token.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            console.log(data);
        } else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }

    }

    useEffect(() => {
        getNotes();
    }, []);

    const TrimLeft = {
        float: "left",
        marginLeft: "10px",
        marginTop: "-18px"
    }

    const SellerDashboardRoute = () => {
        if (user === null){
            return;
        }
        if (user['username'] !== null) {
            return (
                <li style={TrimLeft}>
                    <Link to="/sellers/SellerDashboard" style={{
                        textDecoration: "none",
                        color: "black"
                    }}>Seller dashboard </Link>
                </li>
            )
        }else{
            return null
        }
    }

    const authCallBack = () => {
        return (
            <div>
                <ul style={{listStyle: "none"}}>

                    <li style={TrimLeft}><p onClick={logOut}>Logout</p></li>
                    <SellerDashboardRoute />
                </ul>
            </div>
        )
    }

    return (
        <div className="App">
            <Progress_bar ref={progressBarRef}/>
            <div id="Nav" className="shadow p-3 mb-5 bg-white rounded">
                <Link id="logoMain" className="anchors" to="/">DeepBasket</Link>
                <div id="nav_login_contents">
                    {user ? authCallBack()
                        :
                        <div>
                            <Link to="/authentication/login">Login </Link>
                            <Link to="/authentication/register_page">Register</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default HomePage;