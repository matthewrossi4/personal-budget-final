import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [getUsername, setUsername] = useState("");
    const [getPassword, setPassword] = useState("");

    const history = useHistory();

    const settingUsername = (event) => {
        setUsername(event.target.value);
    }

    const settingPassword = (event) => {
        setPassword(event.target.value);
    }

    const submitThis = (event) => {
        event.preventDefault();

        if (getUsername.length === 0 || getPassword.length === 0) {
            document.getElementById('message').innerHTML = "Username or Password field is blank."
            throw new Error("Blank field.");
        }

        axios
        .post('http://134.209.220.164:4000/api/login', {getUsername, getPassword})
        .then((res) => {
            localStorage.setItem("tkn", res.data.token);
            history.push("/dashboard");
        })
        .catch((error) => {
            console.log(error);
            document.getElementById('message').innerHTML = error.response.data.err;
        });
    }

    return (
        <div className="login">
            <h1 className="head">Login</h1>
            <form onSubmit={submitThis}>
                <div className="row">
                    <label>Username</label>
                    <br />
                    <input type="text" value={getUsername} onChange={settingUsername} id="username"  />
                </div>
                <div className="row">
                    <label>Password</label>
                    <br />
                    <input type="password" value={getPassword} onChange={settingPassword} id="password" />
                </div>
                <p id="message"></p>
                <div>
                    <input type="submit" value="Login" id="login" />
                </div>
            </form>
        </div>
    );
}

export default Login;