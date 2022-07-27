import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "../main/homePage";
import './css/register_form.css';
import {useRef, useState} from "react";
import DOMPurify from 'dompurify';
import React from 'react';
import Progress_bar from "../main/progress_bar";
import {GetCookie, currentDOMAIN} from '../essentials'
import TextField from "@mui/material/TextField";
import {Button, FormControl, IconButton, Input, InputAdornment, InputLabel} from "@mui/material";
import {MdAccountCircle} from 'react-icons/md';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";


const RegisterError = (message) => {

    if (message.avl === true && message.error !== '') {
        const sanitizedData = () => ({
            __html: DOMPurify.sanitize(message.error)
        });
        const styles = {
            height: '100px',
            userSelect: 'none',
            userFocus: 'none',
            fontWeight: 'bold'
        }
        let ui = "p-3 mb-2 bg-success text-white";
        if (message.ui === "danger") {
            ui = "p-3 mb-2 bg-danger text-white";
        }
        return (
            <div style={styles} id="errorRegisterBox" className={ui}
                 dangerouslySetInnerHTML={sanitizedData()}></div>
        )
    } else {
        return null
    }
}


export default function LoginForm() {
    const first_name = useRef(null);
    const last_name = useRef(null);
    const email = useRef(null);
    const username = useRef(null);
    const password1 = useRef(null);
    const password2 = useRef(null);


    let errorMessageJsx = `<div>Hello world</div>`;
    const submitForm = () => {
        progressBarHook.current.style.display = 'block';
        progressBarHook.current.style.width = "25%";
        const request = new Request(currentDOMAIN() + '/authentication/register_form', {
            headers: {'X-CSRFToken': GetCookie("csrftoken"), 'Content-Type': 'application/json'}
        });

        function objectValue(obj) {
            return obj.current.value;
        }

        setTimeout(function () {
            progressBarHook.current.style.width = "50%";
        }, 500);
        fetch(request, {
            method: 'POST',
            mode: 'same-origin',
            body: JSON.stringify({
                first_name: objectValue(first_name),
                last_name: objectValue(last_name),
                username: objectValue(username),
                email: objectValue(email),
                password1: objectValue(password1),
                password2: objectValue(password2)
            })
        }).then(rsp => rsp.json().then(function (res) {
            if (res.email_sent) {
                let username = res.username;
                let email = res.email;
                setAvlJson(true);
                setEmailSuccess("success");
                progressBarHook.current.style.width = '100%';
                getErrJson("Hi " + username + " we have just sent an email to " + email +
                    " please click the link in the email to verify your account");
                setTimeout(function () {
                    progressBarHook.current.style.display = 'none';
                }, 500);
            } else {
                res = JSON.parse(res);
                let errors = [];
                for (let i in res) {
                    let errorMessage = res[i][0].message;
                    console.log(res[i][0]);
                    errors.push(`<li>${errorMessage}</li>`);
                }
                errorMessageJsx = `<div>
                <ul>${errors.join('')}</ul>
            </div>`;
                if (errors.length > 0) {
                    setAvlJson(true);
                    getErrJson(errorMessageJsx);
                    setEmailSuccess("danger")
                }
            }
            let inputFields = document.getElementsByClassName('form-control');
            let i;
            for (i = 0; i < inputFields.length; i++) {
                inputFields[i].value = '';
            }
        }));
    }

    const [avlJson, setAvlJson] = useState(false);
    const [errJson, getErrJson] = useState("");
    const [emailSuccess, setEmailSuccess] = useState(null);
    const progressBarHook = useRef(null);


    const [values, setValues] = useState({
        password: '',
        showPassword: false,
    });
    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    function Copyright(props) {

        return (
            <Typography variant="body2" color="text.secondary" align="center" {...props}>
                {'Copyright © '}
                <Link color="inherit" href="/">
                    DeepBasket
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    return (
        <div id="registerPageWrapper">
            <Progress_bar ref={progressBarHook}/>
            <HomePage/>
            <center>
                <RegisterError ui={emailSuccess} avl={avlJson} error={errJson}/>
                <div id="register_form_frame" className="shadow p-3 mb-5 bg-white rounded">
                    <center>
                        <span>Register</span>
                    </center>
                    <br/>
                    <div id="registerForm">
                        <TextField inputProps={{ref: first_name}}  className="register_input" id="first_name" label="First Name" variant="standard"/>
                        <br/>
                        <TextField inputProps={{ref: last_name}}  className="register_input" id="last_name" label="Last Name" variant="standard"/>
                        <br/>
                        <TextField inputProps={{ref: email}}  className="register_input" id="email" label="Email" variant="standard"/>
                        <TextField
                            id="input-with-icon-textfield"
                            className="register_input"
                            label="create username"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MdAccountCircle/>
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                        />
                        <br/>
                        <FormControl className="register_input" variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                inputProps={{ref: password1}}
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <br/>
                        <FormControl className="register_input" variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">conform password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                className="register_input"
                                inputProps={{ref: password2}}
                                onChange={handleChange('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <Button onSubmit={submitForm} style={{marginTop: "30px"}} className="register_input" variant="contained"
                                color="success">
                            Submit
                        </Button> <hr style={{visibility: "hidden", height: "260px"}} />
                        <Copyright/>
                    </div>
                </div>
            </center>
        </div>
    )
}