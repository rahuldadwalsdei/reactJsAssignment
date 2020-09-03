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
export default class Products extends Component {
    state = {
        products: [],
        itemValue: localStorage.getItem('itemValue') ? JSON.parse(localStorage.getItem('itemValue')) : null,
        isLoading: true,
        cartItem: []
    }
    constructor(props) {
        super(props);
        this.child = React.createRef();
        this.getProducts();
    }

    getProducts = () => {
        const url = `https://mean.stagingsdei.com:6047/product/pagination?perPage=10&page=1&subcategoryID=` + this.props.match.params.subcategory + `&merchantID=` + this.state.itemValue.merchantId;
        // const url = `https://mean.stagingsdei.com:6047/product/pagination?perPage=10&page=1&filter=&sortBy=title&orderBy=asc`;
        let token = JSON.parse(localStorage.getItem('token'));
        const config = {
            headers: { Authorization: `${token.token}` }
        };
        axios.get(url, config)
            .then(result => {
                result.data.data.data.forEach(element => {
                    element['qty'] = 0;
                });
                toast.info('Add Products to cart and Checkout', {
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                this.setState({ products: result.data.data.data, isLoading: false });
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
    removeQuantity = (item) => {
        this.state.products.forEach(ele => {
            if (ele._id == item._id) {
                if (item.qty > 0)
                    ele['qty'] = ele.qty - 1;
            }
        });
        console.log('this.state.products', this.state.products)
        this.setState({ products: this.state.products });

    }

    addToCart = async (item) => {
        console.log('-----item', item)
        let myCart = await localStorage.getItem('MyCart') ? JSON.parse(localStorage.getItem('MyCart')) : [];
        if(!myCart) myCart = [];
        this.state.cartItem = await myCart.concat(this.state.cartItem);
        if (item.qty > 0) {
            let obj = await this.state.cartItem.find(o => o._id === item._id);
            if (obj && obj.name) {
                let index = await this.state.cartItem.findIndex(x => x._id === item._id);
                this.state.cartItem[index]['quantity'] = obj.quantity + item.qty;
                this.state.cartItem[index]['price'] = obj.price + item.variation[0].variationFlatPrice;
            } else {
                let cartPushed = {
                    _id: item._id,
                    price: item.variation[0].variationFlatPrice * item.qty,
                    name: item.title,
                    description: item.description,
                    quantity: item.qty,
                    image: item.icon
                }

                await this.state.cartItem.push(cartPushed);
            }
            localStorage.setItem('MyCart', JSON.stringify(this.state.cartItem));
            await this.setState({ cartItem: this.state.cartItem })
            this.child.current.updateQuantity(this.state.cartItem);
            toast.success('Product Added To Cart SuccessFully', {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.warn('Please Select Product Quantity First', {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

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
                                <li className="breadcrumb-item active">
                                    Products
                                </li>
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
                                </span><br />
                                <span className="selected-span">
                                    <span className="selected-span-title">Selected Subactegory</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                               - &nbsp;&nbsp;&nbsp;&nbsp; <span className="category-name">
                                        {this.state.itemValue.subCatName}</span>
                                </span>
                            </div>
                            <br /><br />
                            <span className="header-title">
                                {this.state.products.length > 0 ? 'Add Products in Cart' : 'No Record Found'
                                }
                            </span>

                            {this.state.isLoading ? <Loader /> :
                                (<div
                                    className="flexContainer" style={styles.paddingTop}>
                                    {this.state.products.length > 0 ? (
                                        this.state.products.map((item, index) => {
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
                                                            color="textSecondary"
                                                            className="secondary-heading">
                                                            {item.variation[0].title}  -   $ {item.variation[0].variationFlatPrice}
                                                        </Typography>
                                                        <Typography
                                                            variant="headline"
                                                            component="h2"
                                                            className="itemName">
                                                            {item.title}
                                                        </Typography>

                                                        <br />
                                                        <div style={styles.divCounter}>
                                                            <Button variant="outlined"
                                                                onClick={() => this.updateQuantity(item)}>
                                                                <FontAwesomeIcon icon={faPlusCircle} style={styles.countercolor} /></Button>
                                                            <p>{item.qty}</p>
                                                            <Button variant="outlined"
                                                                onClick={() => this.removeQuantity(item)}>
                                                                <FontAwesomeIcon icon={faMinusCircle} style={styles.countercolor} />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                    <CardActions className="card-action">
                                                        <Button variant="outlined" color="primary"
                                                            className="bgColorYellow"
                                                            style={styles.color}
                                                            onClick={() => this.addToCart(item)}
                                                        > Add To Cart </Button>
                                                        <Button variant="outlined" color="primary"
                                                            style={styles.color}
                                                        > <Link to={`/product-detail/${item._id}`}
                                                        >View Detail</Link> </Button>
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
