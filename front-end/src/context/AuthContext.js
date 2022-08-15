import {useState, createContext, useEffect} from "react";
import {currentDOMAIN} from "../essentials";
import jwt_decode from "jwt-decode";


const AuthContext = createContext(undefined);

export default AuthContext;

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => localStorage.getItem("authToken") ?
        jwt_decode(localStorage.getItem("authToken")) : null
    )
    const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") ?
        JSON.parse(localStorage.getItem("authToken")) : null
    );
    const [loading, setLoading] = useState(true);


    let loginUser = async (e, username, password) => {
        e.preventDefault();
        let response = await fetch(currentDOMAIN() + "/authentication/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        let data = await response.json();
        if (response.status === 200) {
            setAuthToken(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem("authToken", JSON.stringify(data));
            return true;
        } else {
            alert("Something went wrong :( ");
            return false;
        }
    }

    let logOutUser = () => {
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem("authToken");
    }

    let updateToken = async () => {
        if (authToken !== null) {
            let response = await fetch(currentDOMAIN() + "/authentication/token/refresh/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'refresh': authToken?.refresh
                })
            });
            let data = await response.json();
            if (response.status === 200) {
                setAuthToken(data);
                setUser(jwt_decode(data.access));
                localStorage.setItem("authToken", JSON.stringify(data));
            } else {
                logOutUser();
            }
            if (loading) {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if (loading) {
            updateToken().then();
        }
        let interval = setInterval(() => {
            if (authToken) {
                updateToken().then();
            }
        }, 15000);
        return () => {
            clearInterval(interval);
        }
    }, [authToken, loading]);
    let contextData = {
        user: user,
        loginUser: loginUser,
        logOut: logOutUser,
        token: authToken
    }
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}