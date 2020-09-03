import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Register extends Component {

    state = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 4,
        phone: '',
        passwordError: false,
        redirect: false,
        authError: false,
        isLoading: false,
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
    handleFNameChange = event => {
        this.setState({ firstname: event.target.value });
    };
    handleLNameChange = event => {
        this.setState({ lastname: event.target.value });
    };
    handlePhoneChange = event => {
        this.setState({ phone: event.target.value })
    }

    ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    handleSubmit = event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        const url = 'https://mean.stagingsdei.com:6047/user/register';
        if (this.state.authError || this.state.passwordError) {
            this.setState({ isLoading: false });
        } else {
            const formData = new FormData();
            formData.append('firstname', this.state.firstname);
            formData.append('lastname', this.state.lastname);
            formData.append('email', this.state.email);
            formData.append('password', this.state.password);
            formData.append('role', '4');
            formData.append('phone', this.state.phone);
            axios.post(url, formData)
                .then(result => {
                    this.setState({ isLoading: false });
                    if (result.data.message == 'SUCCESSFUL') {
                        toast.success('User Registered Successfully', {
                            position: "top-right",
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        this.setState({ redirect: true });
                    } else {
                        this.setState({ redirect: false, authError: true });
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ authError: true, isLoading: false });
                });
        }


    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }
    };

    render() {
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
                <div className="container d-flex align-items-center justify-content-center">
                    <div className="banner-src-blc">
                        <h1 className="banner-text">Order Delivery Food</h1>

                        <div className="card mx-auto mt-5 card-register">
                            <div className="card-header">Register</div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <div className="form-label-group">
                                            <input type="text" id="inputFName" className="form-control" placeholder="First name" name="fname" onChange={this.handleFNameChange} required />
                                            <label htmlFor="inputFName">First Name</label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="form-label-group">
                                            <input type="text" id="inputLName" className="form-control" placeholder="Last name" name="lname" onChange={this.handleLNameChange} required />
                                            <label htmlFor="inputLName">Last Name</label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="form-label-group">
                                            <input id="inputEmail" className={"form-control " + (this.state.authError ? 'is-invalid' : '')} placeholder="Email address" type="text" name="email" onChange={this.handleEmailChange} autoFocus required />
                                            <label htmlFor="inputEmail">Email address</label>
                                            <div className="invalid-feedback">
                                                Please provide a valid Email. or Email Exist
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
                                        <div className="form-label-group">
                                            <input type="number" className="form-control" id="inputPassword" placeholder="Phone" name="phone" onChange={this.handlePhoneChange} required />
                                            <label htmlFor="inputPhone">Phone</label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block" type="submit" disabled={this.state.isLoading ? true : false}>Register &nbsp;&nbsp;&nbsp;
                                    {isLoading ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                    <span></span>
                                                )}
                                        </button>
                                    </div>
                                </form>
                                <div className="text-center">
                                    <Link className="d-block small mt-3" to={''}>Login Your Account</Link>
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


