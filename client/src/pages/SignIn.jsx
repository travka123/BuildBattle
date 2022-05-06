import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServerApi from "../ServerApi";

const SignIn = () => {

    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    
    const [fail, setFail] = useState(null);

    const submit = () => {

        (async () => {

            const result = await ServerApi.signin(login, password);

            if (result.status === 200) {

                localStorage.setItem('jwt', result.text);

                navigate('/', {replace: true});
            }
            else if (result.status === 401) {

                setFail('login or password is invalid');
            }
        })();
    }

    return (
        <div className="SignIn">
            <div style={{width: '100vw', height: '100vh', backgroundColor: 'lightblue', overflow: 'hidden'}}>
                <div className="card" style={{width: '400px', margin: 'auto', marginTop: '20vh'}}>
                    <div className="card-body">

                        <h2>Sign in:</h2>

                        <div className="mt-3">
                            Login:
                            <div>
                                <input value={login} onChange={(e) => setLogin(e.target.value)} className="w-100" />
                            </div>
                        </div>

                        <div className="mt-2">
                            Password:
                            <div>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-100" />
                            </div>
                        </div>

                        {fail ? 
                        <div className="mt-4 alert alert-danger" role='alert'>{fail}</div> :
                        ''}

                        <button className="btn btn-primary btn-block mt-3 mb-1 me-2" onClick={submit}>Sign in</button>

                        <button className="btn btn-secondary btn-block mt-3 mb-1 me-2" onClick={() => navigate('/signup', {replace: true})}>Sign up</button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;