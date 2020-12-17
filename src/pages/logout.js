import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Logout() {
    var history = useHistory();

    useEffect(() => {
        localStorage.removeItem("tkn");
        history.push("/");
    });

    return (
        <></>
    );
}

export default Logout;