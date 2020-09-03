import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import TitleComponent from "./title";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Login extends Component {

    state = {
        email: '',
        password: '',
        passwordError: false,
        redirect: false,
        authError: false,
        isLoading: false
    };


    handleEmailChange = event => {
        let validateMail = this.ValidateEmail(event.target.value);
        if (validateMail) {
            this.setState({ email: event.target.value, authError: false });
        } else {
            this.setState({ authError: true, isLoading: false });
        }
    };
    handlePwdChange = event => {
        if (event.target.value.length < 8) {
            this.setState({ passwordError: true, isLoading: false });
        } else {
            this.setState({ password: event.target.value, passwordError: false });
        }
    };

    ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    handleSubmit = event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        const url = 'https://mean.stagingsdei.com:6047/user/login';
        let bodyFormData = {
            email: this.state.email,
            password: this.state.password,
            role: 4
        };
        if (this.state.authError || this.state.passwordError) {
            this.setState({ isLoading: false });
        } else {
            axios.post(url, bodyFormData)
                .then(result => {
                    if (result.data.message == 'SUCCESSFUL') {
                        let userData = {
                            email: result.data.data.email,
                            firstname: result.data.data.firstname,
                            lastname: result.data.data.lastname,
                            token: result.data.data.token,
                            _id: result.data.data._id,
                            phone: result.data.data.phone
                        }
                        toast.success('Loggedin Successfully', {
                            position: "top-right",
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        localStorage.setItem('token', JSON.stringify(userData));
                        this.setState({ redirect: true, isLoading: false });
                        localStorage.setItem('isLoggedIn', true);
                    }
                })
                .catch(error => {
                    toast.error('Incorrect email or password', {
                        position: "top-right",
                        autoClose: 4000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    this.setState({ authError: false, isLoading: false });
                });
        }
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/dashboard' />
        }
    };

    render() {
        if(localStorage.getItem('token')) {
            console.log('localStorage-----', localStorage.getItem('token'))
            return <Redirect to='/dashboard' />
        }
        const isLoading = this.state.isLoading;
        return (
            <div className="container" id="wrapper">
                <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <TitleComponent title="React Food Ordering App"></TitleComponent>
                <div className="container d-flex align-items-center justify-content-center">
                    <div className="banner-src-blc">
                        <h1 className="banner-text">Order Delivery Food</h1>

                        <div className="card card-login mx-auto mt-5">
                            <div className="card-header">Login</div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <div className="form-label-group">
                                            <input className={"form-control " + (this.state.authError ? 'is-invalid' : '')} id="inputEmail" placeholder="Email address" type="text" name="email" onChange={this.handleEmailChange} autoFocus required />
                                            <label htmlFor="inputEmail">Email address</label>
                                            <div className="invalid-feedback">
                                                Please provide a valid Email.
                                    </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="form-label-group">
                                            <input type="password" className={"form-control " + (this.state.passwordError ? 'is-invalid' : '')} id="inputPassword" placeholder="******" name="password" onChange={this.handlePwdChange} required />
                                            <label htmlFor="inputPassword">Password</label>
                                            <div className="invalid-feedback">
                                                Password Must be atleast 8 digits
                                    </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="checkbox">
                                            <label>
                                                <input type="checkbox" value="remember-me" />Remember Password
                                    </label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block" type="submit" disabled={this.state.isLoading ? true : false}>Login &nbsp;&nbsp;&nbsp;
                                    {isLoading ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                    <span></span>
                                                )}
                                        </button>
                                    </div>

                                </form>
                                <div className="text-center">
                                    <Link className="d-block small mt-3" to={'register'}>Register an Account</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderRedirect()}

            </div>
        );
    }
}


