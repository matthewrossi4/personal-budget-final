import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function Signup() {
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
        .post('206.81.15.62/api/signup', {getUsername, getPassword})
        .then((res) => {
            history.push("/login");
        })
        .catch((error) => {
            console.log(error);
            document.getElementById('message').innerHTML = error.response.data.err;
        });
    }

    return (
        <div className="signup">
            <h1 className="head">Sign Up</h1>
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
                    <input type="submit" value="Signup" id="signup" />
                </div>
            </form>
        </div>
    );
}

export default Signup;