import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route, useNavigate, BrowserRouter as Router} from "react-router-dom";
import HomePage from "./main/homePage";
import LoginForm from "./auth/register_form";
import LoginPage from "./auth/login_page";
import AdminNav from './control/adminNav';
import ProductTree from "./control/productTree";
import SellerForm from "./seller/seller_form";
import DashboardSeller from "./seller/seller_dashboard";
import AddProduct from "./seller/add_product";
import AuthContext, {AuthProvider} from "./context/AuthContext";
import {Outlet} from 'react-router-dom'
import {useContext} from "react";

const PrivateRoutes = () => {
    let {user} = useContext(AuthContext);
    const nav = useNavigate();
    return (
        user ? nav('/') : <Outlet/>
    )
}


function App() {
    return (
        <div className="App">
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route element={<PrivateRoutes/>}>
                            <Route path="/authentication/register_page" element={<LoginForm/>}/>
                        </Route>
                        <Route path="/authentication/login" element={<LoginPage/>}/>
                        <Route path='/func_control_panel/base' element={<AdminNav/>}/>
                        <Route path="/func_control_panel/productTree" element={<ProductTree/>}/>
                        <Route path="/sellers/seller_form" element={<SellerForm/>}/>
                        <Route path="/sellers/SellerDashboard" element={<DashboardSeller/>}/>
                        <Route path="/sellers/add_product" element={<AddProduct/>}/>
                    </Routes>
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;
