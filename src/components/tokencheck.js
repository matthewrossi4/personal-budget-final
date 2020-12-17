import React from 'react';
import { Link } from 'react-router-dom';

var tokencheck = (Component) => {
    return (props) => {
        const tkn = localStorage.getItem("tkn");
        if (tkn) return <Component {...props} />;

        return (
            <div>
                <h1>Please <Link to="/login">login</Link> or <Link to="/signup">sign up</Link> to access this page.</h1>
            </div>
        )
    }
};

export default tokencheck;