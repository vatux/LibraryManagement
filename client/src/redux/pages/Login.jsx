import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../services/authSlice'
import { useLoginMutation } from '../services/authApiSlice'


const Login = () => {
    const emailRef = useRef();
    const errRef = useRef();
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        emailRef.current.focus()
    },[]);

    useEffect(() => {
        setErrMsg('');
    },[email, password])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const userData = await login({email, password}).unwrap();
            const { user, token } = userData.data;
            dispatch(setCredentials({ user, token }));

            // Create localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setEmail('')
            setPassword('')
            navigate('/home');
        } catch (error) {
            if (!error?.originalStatus) {
                setErrMsg('No Server Response');
            }
            else if (error?.originalStatus === 400){
                setErrMsg('Missing email or password');
            }
            else if (error?.originalStatus === 401){
                setErrMsg('Unauthorized');
            }
            else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const handleEmailInput = (e) => setEmail(e.target.value);
    const handlePasswordInput = (e) => setPassword(e.target.value);

    return (
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
            </div>
            <div className="row">
              <div className="col-md-12">
              <div className="card">
                  <div className="card-header">
                    <div className="card-title">Login</div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 col-lg-4">
                      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}></p>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="email">Email Address</label>
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            ref={emailRef}
                            value={email}
                            onChange={handleEmailInput}
                            placeholder="Enter Email"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            onChange={handlePasswordInput}
                            value={password}
                            placeholder="Password"
                          />
                        </div>
                        <button className="btn btn-success">Login</button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Login;