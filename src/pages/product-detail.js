import React, { Component } from 'react';
import Header from "../elements/header";
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Loader from '../elements/Loader/Loader';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const styles = {
    marginBottom: '5%'
    , italian: {
        fontFamily: 'serif'
    }
    , color: {
        color: '#795548'
    }
    , itemWidth: {
        minWidth: '30%'
    },
    divCounter: {
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    countercolor: {
        color: '#795548!important'
    },
    itemNotMostOrdered: {
        margin: '0',
        marginBottom: '30px'
    },
    itemText: {
        padding: 0
    },
    paddingTop: {
        paddingTop: '35px'
    },
    itemNav: {
        marginTop: '9%',
        overflowY: 'scroll',
        maxHeight: '145px'
    },
    itemPlus: {
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    placeholderImage: {
        height: '10em',
        width: '94%',
        backgroundColor: 'rgb(224, 224, 224)'
    }
}
export default class ProductDetail extends Component {
    state = {
        product: {},
        itemValue: localStorage.getItem('itemValue') ? JSON.parse(localStorage.getItem('itemValue')) : null,
        isLoading: true,
    }
    constructor(props) {
        super(props);
        this.getDetail();
    }

    getDetail = () => {
        const url = `https://mean.stagingsdei.com:6047/product/find?id=` + this.props.match.params.id;
        let token = JSON.parse(localStorage.getItem('token'));
        const config = {
            headers: { Authorization: `${token.token}` }
        };
        axios.get(url, config)
            .then(result => {
                this.setState({ product: result.data.data, isLoading: false });
            })
            .catch(error => {
                console.log(error);
                this.setState({ isLoading: false });
            });
    }

    saveDataToLocalStorage = (item) => {
        let objToSet = {
            subCatName: item.title,
            subCatId: item._id,
            merchantName: this.state.itemValue.merchantName,
            merchantId: this.state.itemValue.merchantId,
            categoryName: this.state.itemValue.categoryName,
            categoryId: this.state.itemValue.categoryId,
            description: item.description
        }
        localStorage.setItem('itemValue', JSON.stringify(objToSet));
    }

    updateQuantity = (item) => {
        this.state.products.forEach(ele => {
            if (ele._id == item._id) {
                ele['qty'] = ele.qty + 1;
            }
        });
        this.setState({ products: this.state.products });
    }


    render() {
        if (!localStorage.getItem('token')) {
            return <Redirect to='/' />
        }
        const noResults = (
            <div>
                <p>No Records Found</p>
                <p>You have a unique taste!!</p>
                <img
                    src="http://images.clipartpanda.com/dinner-clipart-black-and-white-9iR4kekie.svg"
                    width="250"
                    height="250"
                    alt="desc" />
            </div>
        );
        return (
            <div>
                <Header
                    ref={this.child}
                />
                <ToastContainer
                    position="top-center"
                    autoClose={4000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <div id="wrapper">
                    <div id="content-wrapper">
                        <div className="container-fluid">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    User
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to={'/dashboard'} >Product Categories</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to={`/merchants/${this.state.itemValue.categoryId}`}
                                    >Merchants</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to={`/subcategories/${this.state.itemValue.merchantId}`}
                                    >Sub Categories</Link></li>
                                <li className="breadcrumb-item">
                                <Link to={`/products/${this.state.product.subcategoryID}`}
                                    >Products</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                     Detail
                                </li>
                            </ol>
                            
                            <br /><br />
                            <span className="header-title">
                                Product Details
                            </span>

                            {this.state.isLoading ? <Loader /> :
                                (<div
                                    className="flexContainer" style={styles.paddingTop}>
                                    <div className="wrapper-detail">
                                        <div className="first-div">
                                            <img
                                                src={this.state.product.icon}
                                                alt="product"
                                                className="image-detail" />
                                        </div>
                                        <div className="second-div">
                                            <div className="row">
                                                <div className="col-sm-6 text-head">
                                                    Name &nbsp;&nbsp;&nbsp; -
                                                </div>
                                                <div className="col-sm-6 text-detail">
                                                    {this.state.product.title}
                                                </div>
                                            </div>
                                            <br /><br />
                                            <div className="row">
                                                <div className="col-sm-6 text-head">
                                                    Description &nbsp;&nbsp;&nbsp; -
                                                </div>
                                                <div className="col-sm-6 text-detail">
                                                    {this.state.product.description}
                                                </div>
                                            </div>
                                            <br /><br />
                                            <div className="row">
                                                <div className="col-sm-6 text-head">
                                                    Variation &nbsp;&nbsp;&nbsp; -
                                                </div>

                                                <div className="col-sm-6 text-detail">
                                                    {this.state.product.variation.map((item, index) => {
                                                        return <ul className="variation-list">
                                                            <li>Title : {item.title}</li>
                                                            <li>Variation Flat Price : {item.variationFlatPrice}/-</li>
                                                            <li>Variation Size : {item.variationSize}</li>
                                                            <li>Title : {item.title}</li>
                                                        </ul>
                                                    })
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                </div>)
                            }
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
