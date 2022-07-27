import './css/seller_form.css';
import {BsCardImage, BsImages} from 'react-icons/bs';
import {GetCookie, currentDOMAIN} from "../essentials";
import {useRef, useState, useEffect, useContext} from "react";
import SellerNav from "./SellerNav";
import AuthContext from "../context/AuthContext";


export default function SellerForm() {
    let {token} = useContext(AuthContext);
    const shop_name = useRef(null);
    const seller_address = useRef(null);
    const warehouse_address = useRef(null);
    const contact_number = useRef(null);
    const seller_fullname = useRef(null);
    const business_email = useRef(null);
    const shop_photo = useRef(null);
    const cover_photo = useRef(null);

    const [otpFrame, setOtpFrame] = useState(false);

    function currentValue(ref) {
        return ref.current.value;
    }

    const formSubmission = () => {
        let className = document.getElementsByClassName('sellerFormInput');
        let append = true;
        let i;
        for (i = 0; i < className.length; i++) {
            if (className[i].value === '') {
                append = false;
                className[i].style.border = '1px solid red';
            }
        }
        const request = new Request(currentDOMAIN() + '/sellers/uploadProfile/',
        );


        const formData = new FormData();

        let cover_photos = cover_photo.current.files[0];
        let profile_photo = shop_photo.current.files[0];
        if (cover_photos === undefined) {
            cover_photos = null;
        }
        if (profile_photo === undefined) {
            profile_photo = null;
        }
        formData.append("cover_profile", cover_photos);
        formData.append("shop_profile", profile_photo);
        formData.append("seller_name", currentValue(seller_fullname));
        formData.append("seller_email", currentValue(business_email));
        formData.append("seller_warehouse", currentValue(warehouse_address));
        formData.append("seller_address", currentValue(seller_address));
        formData.append("contact_number", currentValue(contact_number));
        formData.append("shop_name", currentValue(shop_name));
        const phoneNumber = currentValue(contact_number);
        fetch(request, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': GetCookie('csrftoken'),
                'Authorization': 'Bearer ' + String(token)
            },
            body: formData
        }).then(rsp => rsp.json()).then(function (response) {
            let i;
            for (i = 0; i < className.length; i++) {
                className[i].value = '';
            }
            if (response.message !== undefined) {
                alert(response.message);
            } else {
                if (response.length !== undefined) {
                    response = JSON.parse(response);
                    for (let i in response) {
                        document.querySelector('#' + i).innerHTML = response[i][0].message;
                    }
                } else {
                    if (response.verified !== undefined) {
                        if (response.verified === true) {
                            setInfo(false);
                            setOtpFrame(false);
                            preFilledForms();
                        }
                    } else {
                        setInfo(true);
                        setPhone(phoneNumber);
                    }
                }
            }
        });
    }
    const [info, setInfo] = useState(false);
    const [phone, setPhone] = useState(0);

    const OtpSuccess = (params) => {
        if (params.bool === true) {
            return (
                <div id="OtpSuccessInfo" className="p-3 mb-2 bg-info text-white">
                    <center>
                        We've sent message to {contact_number.current.value} verify your seller profile verify within a
                        minute
                    </center>
                </div>
            )
        }
    }


    const blockFrame = {
        display: "none"
    }
    const showOTPInput = {
        display: "block"
    }
    const verify = useRef(null);

    const verifyOtp = () => {
        const request = new Request(currentDOMAIN() + '/sellers/validCode/', {
            headers: {
                'X-CSRFToken': GetCookie("csrftoken"),
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(token.access)
            }
        });
        fetch(request, {
            method: 'post',
            body: JSON.stringify({
                code: parseInt(verify.current.value)
            })
        }).then(rsp => rsp.json()).then(function (response) {
            if (response.error === false) {
                verify.current.value = '';
            } else {
                alert("Your account is profile is verified ");
                setInfo(false);
                setOtpFrame(false);
            }
        })
    }
    const [profile, setProfile] = useState(false);
    const [profileUrl, setProfileUrl] = useState("");
    const [cover, setCover] = useState(false);
    const [coverUrl, serCoverUrl] = useState("");
    const prvImageProfile = (ev, cd) => {
        let file = URL.createObjectURL(ev.currentTarget.files[0]);
        if (cd === "profile") {
            setProfile(true);
            setProfileUrl(file);
        } else {
            setCover(true);
            serCoverUrl(file);
        }
    }


    const PrvProfileImage = (params) => {
        if (params.bool === true) {
            return (
                <img className="imgs" width="100%" height="auto" src={params.image} alt=""/>
            )
        }
    }

    function preFilledForms() {
        fetch(currentDOMAIN() + '/sellers/SellerProfile/', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + String(token.access)
            }
        }).then(rsp => rsp.json()).then(function (response) {
            // REACT JS SUCKS I GAVE UP AND MANIPULATED THE DOM FOR MY LOGIC
            for (let [key, value] of Object.entries(response)) {
                if (key === "shop_profile") {
                    setProfile(true);
                    setProfileUrl(currentDOMAIN() + value)
                } else if (key === "cover_profile") {
                    setCover(true);
                    serCoverUrl(currentDOMAIN() + value);
                }

                if (key === 'is_phone_verified') {
                    if (value === false) {
                        setOtpFrame(true);
                    }
                }
                let reactJSSUCKS = document.querySelector('#' + key);
                if (reactJSSUCKS !== null && reactJSSUCKS.nodeName === "INPUT") {
                    try {
                        reactJSSUCKS.value = value;
                    } catch (err) {

                    }
                }
            }
        });
    }

    useEffect(() => {
        preFilledForms();
    }, []);

    const ResendSMS = () => {
        const request = new Request(currentDOMAIN() + '/sellers/smsReq/', {
            headers: {'X-CSRFToken': GetCookie("csrftoken"), 'Content-Type': 'application/json'}
        });
        fetch(request, {
            method: 'post',
            mode: 'same-origin',
            body: JSON.stringify({
                phone_number: currentValue(contact_number)
            })
        }).then(rsp => rsp.json()).then(function (response) {
            let message = response.message;
            if (message === true) {
                alert("Message sent")
            } else {
                alert("Something went wrong")
            }
        });
    }

    return (
        <div>
            <SellerNav/>
            <br/>
            <center style={otpFrame ? showOTPInput : blockFrame}>
                <div className="shadow p-3 mb-5 bg-white rounded" id="OTP_input">
                    <center>
                        <h5>Enter code that we've just sent you </h5>
                    </center>
                    <br/>
                    <input ref={verify} type="number" className="form-control o" placeholder="Enter Code"/>
                    <span onClick={ResendSMS} style={{textDecoration: "underline"}}>Resend code? </span>
                    <br/> <br/>
                    <button onClick={verifyOtp} className="btn btn-success o">Verify</button>
                </div>
            </center>
            <div style={otpFrame ? blockFrame : showOTPInput}>
                <center>
                    <OtpSuccess phone={phone} bool={info}/>
                    <div id="sellerFormPage" className="shadow p-3 mb-5 bg-white rounded">
                        <b style={{float: "left"}}>Register Seller Form</b>
                        <br/>
                        <input id="shop_name" ref={shop_name} required={true} placeholder="shop name" type="text"
                               className="sellerFormInput form-control"/> <br/>
                        <input id="seller_address" ref={seller_address} required={true} type="text"
                               placeholder="seller address"
                               className="form-control sellerFormInput"/> <br/>
                        <input id="seller_warehouse" ref={warehouse_address} required={true} type="text"
                               placeholder="warehouse address"
                               className="form-control sellerFormInput"/> <br/>
                        <input id="contact_number" ref={contact_number} required={true} type="number"
                               placeholder="contact number"
                               className="form-control sellerFormInput"/> <br/>
                        <input id="seller_name" ref={seller_fullname} required={true} type="text"
                               placeholder="seller full name"
                               className="form-control sellerFormInput"/> <br/>
                        <input id="seller_email" ref={business_email} required={true} type="email"
                               placeholder="seller email"
                               className="form-control sellerFormInput"/>
                        <br/>
                        <div className="errorBox" id="seller_email"></div>
                        <br/>
                        <div style={{display: "none"}}>
                            <input onInput={(e) => {
                                prvImageProfile(e, "profile")
                            }} ref={shop_photo} type="file" id="shop_profile" accept="image/*"/>
                            <input onInput={(e) => {
                                prvImageProfile(e, "cover")
                            }} ref={cover_photo} type="file" id="cover_profile" accept="image/*"/>
                        </div>
                        <hr style={{height: "100px", visibility: "hidden"}}/>
                        <label id="shopProfileLabel"
                               className="p-3 mb-2 bg-light text-dark"
                               htmlFor="shop_profile">
                            <div style={profile ? blockFrame : showOTPInput}>
                                <BsImages/> <br/>
                                <span style={{fontSize: "10px"}}>Profile Image 500x500px</span>
                            </div>
                            <PrvProfileImage bool={profile} image={profileUrl}/>
                        </label>
                        <label style={{marginLeft: "2%"}} className="p-3 mb-2 bg-light text-dark"
                               id="ShopProfileCover" htmlFor="cover_profile">
                            <div style={cover ? blockFrame : showOTPInput}>
                                <BsCardImage/> <br/>
                                <span style={{fontSize: "8.5px"}}>Cover Image 1200x128px</span>
                            </div>
                            <PrvProfileImage bool={cover} image={coverUrl}/>
                        </label>
                        <hr style={{visibility: "hidden", height: "115px"}}/>
                        <br/>
                        <button onClick={formSubmission} className="btn btn-primary sellerFormInput">submit</button>
                    </div>
                </center>
            </div>
        </div>
    )
}