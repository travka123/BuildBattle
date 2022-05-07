import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthorizedAccess = ({children}) => {

    const navigate = useNavigate();

    const jwt = localStorage.getItem('jwt');

    useEffect(() => {

        if (!jwt) {

            navigate('/signin', {replace: true});
        }
    }, [navigate, jwt]) 

    return (
        
        <div className="AuthorizedAccess">

            {jwt ?
                React.Children.map(children, (child) => React.cloneElement(child, {jwt: jwt})) :
                null}

        </div>
    );
}

export default AuthorizedAccess;