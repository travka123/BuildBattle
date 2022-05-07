import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServerApi from "../ServerApi";

const SignUp = () => {

    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');

    const [problems, setProblems] = useState({});

    const register = () => {
        let problems = {};
        let pass = true;

        if (login.length <= 3) {
            pass = false;
            problems.login = "login length must be > 3";
        }

        if (password.length <= 3) {
            pass = false;
            problems.password = "password length must be > 3";
        }

        if (password !== passwordConf) {
            pass = false;
            problems.pnmatch = "Passwords do not match";
        }

        setProblems(problems);

        if (pass) {
            (async () => {

                const {status, token} = await ServerApi.signup(login, password);

                if (status === 200) {

                    localStorage.setItem('jwt', token);

                    navigate('/', {replace : true})
                }
                else if (status === 409) {

                    setProblems({...problems, login : 'already exists'});
                }
            })();
        }
    }

    return (
        <div className="SignUp">
            <div style={{width: '100vw', height: '100vh', backgroundColor: 'lightblue', overflow: 'hidden'}}>
                <div className="card" style={{width: '400px', margin: 'auto', marginTop: '20vh'}}>
                    <div className="card-body">

                        <h2>Sign up:</h2>

                        <div>
                            Login:
                            <div>
                                <input value={login} 
                                    onChange={(e) => setLogin(e.target.value)} 
                                    className={`w-100 ${problems.login ? 'form-control is-invalid' : ''}`} />
                                {problems.login ? <div className="invalid-feedback">{problems.login}</div> : ''}
                            </div>
                        </div>
                
                
                        <div className="mt-2">
                            Password:
                            <div>
                                <input value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className={`w-100 ${(problems.password || problems.pnmatch) ? 'form-control is-invalid' : ''}`} />
                                {problems.password ? <div className="invalid-feedback">{problems.password}</div> : ''}
                            </div>
                        </div>

                        <div className="mb-2">
                            Confirm password:
                            <div>
                                <input value={passwordConf} 
                                    onChange={(e) => setPasswordConf(e.target.value)} 
                                    className={`w-100 ${(problems.password || problems.pnmatch)? 'form-control is-invalid' : ''}`} />
                                {problems.pnmatch ? <div className="invalid-feedback">{problems.pnmatch}</div> : ''}
                            </div>
                        </div>

                        <button onClick={() => register()} className="btn btn-primary btn-block mt-2 mb-1 me-2">Sign up</button>

                        <button onClick={() => navigate('/signin', {replace: true})} className="btn btn-secondary btn-block mt-2 mb-1 me-2">Sign in</button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;