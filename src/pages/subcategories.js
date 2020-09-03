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
export default class Subcategories extends Component {
    state = {
        subcats: [],
        itemValue: localStorage.getItem('itemValue') ? JSON.parse(localStorage.getItem('itemValue')) : null,
        isLoading: true
    }
    constructor(props) {
        super(props);
        this.getSubcategories();
    }

    getSubcategories = () => {
        const url = `https://mean.stagingsdei.com:6047/subCategory/getSubCatId?id=` + this.state.itemValue.categoryId + `&type=merchant&merchantID=` + this.props.match.params.merchant;
        axios.get(url)
            .then(result => {
                toast.info('Select any subcategory to proceed', {
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                this.setState({ subcats: result.data.data, isLoading: false });
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

    render() {
        if(!localStorage.getItem('token')) {
            return <Redirect to='/' />
        }
        const noResults = (
            <div>
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
                <Header />
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
                                <li className="breadcrumb-item active">Sub Categories</li>
                            </ol>
                            <div className="heading-div">
                                <span className="selected-span">
                                    <span className="selected-span-title">Selected Category</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                               - &nbsp;&nbsp;&nbsp;&nbsp; <span className="category-name">
                                        {this.state.itemValue.categoryName}</span>
                                </span>
                                <br />
                                <span className="selected-span">
                                    <span className="selected-span-title">Selected Merchant</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                               - &nbsp;&nbsp;&nbsp;&nbsp; <span className="category-name">
                                        {this.state.itemValue.merchantName}</span>
                                </span>
                            </div>
                            <br /><br />
                            <span className="header-title">
                                {this.state.subcats.length > 0 ? 'Select a Subactegory' : 'No Record Found'
                                }
                            </span>
                            {this.state.isLoading ? <Loader /> :
                                (<div
                                    className="flexContainer" style={styles.paddingTop}>
                                    {this.state.subcats.length > 0 ? (
                                        this.state.subcats.map((item, index) => {
                                            return <div
                                                style={styles.itemWidth}
                                                key={index}>
                                                <Card
                                                    style={styles}
                                                    className="flexItem"
                                                    key={index}>
                                                    <CardContent >

                                                        <Typography
                                                            component="p"
                                                            className="mostOrdered"> Popular
                                                      </Typography> <br />
                                                        <img
                                                            src={item.icon}
                                                            alt="product"
                                                            className="item" />
                                                        <Typography
                                                            color="textSecondary">
                                                        </Typography>
                                                        <Typography
                                                            variant="headline"
                                                            component="h2"
                                                            className="itemName">
                                                            {item.title}
                                                        </Typography>

                                                        <br />
                                                        <Button variant="outlined" color="primary"
                                                            style={styles.color}
                                                        >
                                                            <Link to={`/products/${item._id}`}>
                                                                <span onClick={() => this.saveDataToLocalStorage(item)}>Select</span>
                                                            </Link>

                                                        </Button>
                                                    </CardContent>
                                                    <CardActions>
                                                    </CardActions>
                                                </Card>
                                            </div>

                                        })
                                    ) : noResults}

                                </div>)
                            }

                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
