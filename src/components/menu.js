import React, {useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Menu() {
    const [getLogin, setLogin] = useState(false);
    const location = useLocation();
    
    useEffect(() => {
        const tkn = localStorage.getItem("tkn");
        setLogin(tkn ? true : false);
    }, [location]);

    return (
        <div className="heads">
            <h1>Personal Budget</h1>
            <br />
            <div className="alignment">
                <ul className="nav">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    {getLogin ? (
                        <li><Link to="/logout">Logout</Link></li>
                    ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Signup</Link></li>
                    </>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Menu;