import React, { Component } from 'react';
import Header from "../elements/header";
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Loader from '../elements/Loader/Loader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const styles = {
    btnColor: {
        color: 'brown'
    },
    imgStyle: {
        width: '75px',
        borderRadius: '13%'
    }
}
export default class Order extends Component {
    state = {
        itemValue: localStorage.getItem('itemValue') ? JSON.parse(localStorage.getItem('itemValue')) : null,
        isLoading: false,
        totalQuantity: 0,
        totalPrice: 0,
        cartItem: []
    }
    constructor(props) {
        super(props);
        this.child = React.createRef();
        let myCart = localStorage.getItem('MyCart') ? JSON.parse(localStorage.getItem('MyCart')) : [];
        this.calculateFinalCartValue(myCart);
    }

    orderNow = () => {
        this.setState({ isLoading: true });
        const url = `https://mean.stagingsdei.com:6047/order/create`;
        let token = JSON.parse(localStorage.getItem('token'));
        const config = {
            headers: { Authorization: `${token.token}` }
        };
        let body = {
            "merchantId": this.state.itemValue.merchantId,
            "bookedItems": [
                {
                    "_id": "5f2a415dae18151e77f8716e",
                    "userID": "5f2a410dd2210d4e376505c4",
                    "cartItems": {
                        "_id": "5f2a415eae18151e77f8716f",
                        "price": 10,
                        "status": true,
                        "isDeleted": false,
                        "cartID": "5f2a415dae18151e77f8716e",
                        "productID": "5f244396ea3a3a67aefba7df",
                        "quantity": 1,
                        "createdAt": "2020-08-05T05:19:26.595Z",
                        "__v": 0
                    },
                    "product": {
                        "_id": "5f244396ea3a3a67aefba7df",
                        "description": "sweetza testing",
                        "icon": "https://mean.stagingsdei.com:6047/uploads/attachment/random/2020-07-31T16-15-09.905Z-SweetzaPieCrop-1024x554.jpg",
                        "status": true,
                        "isDeleted": false,
                        "addOnRequired": false,
                        "title": "sweetza",
                        "merchantID": "5f22f69eea3a3a67aefba7d2",
                        "subcategoryID": "5f243929ea3a3a67aefba7dd",
                        "categoryID": "5f22f61aea3a3a67aefba7d0",
                        "variation": [
                            {
                                "_id": "5f244396ea3a3a67aefba7e0",
                                "title": "small size",
                                "variationSize": "regular",
                                "variationFlatPrice": "22",
                                "types": []
                            },
                            {
                                "_id": "5f244396ea3a3a67aefba7e1",
                                "title": "larger",
                                "variationSize": "popular",
                                "variationFlatPrice": "33",
                                "types": []
                            }
                        ],
                        "createdAt": "2020-07-31T16:15:18.837Z",
                        "addons": [],
                        "__v": 0
                    }
                }
            ],
            "totalAmount": this.state.totalPrice,
            "deleiveryFee": 5,
            "riderTip": 5,
            "taxFee": 10,
            "signatureImage": "https://mean.stagingsdei.com:6047/uploads/attachment/user/2020-07-30T07-45-09.270Z-images.jpeg",
            "dropPoints": [
                {
                    "location": [
                        -99.133208,
                        19.4326077
                    ],
                    "address": "Mohali",
                    "description": "tjbjkbkj",
                    "type": "merchant"
                },
                {
                    "location": [
                        -99.133208,
                        19.4326077
                    ],
                    "address": "Mohali",
                    "description": "tjbjkbkj",
                    "type": "user"
                }
            ],
            "paymentType": "stripe",
            "cardId": "card_1HDOqgCasznOJpEMwQ3nKHgt"
        }
        axios.post(url, body, config)
            .then(result => {
                this.setState({ isLoading: false });
                toast.success('Ordered Placed Successfully', {
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                this.child.current.updateQuantity([]);
                localStorage.setItem('MyCart', JSON.stringify([]));
                localStorage.setItem('itemValue', JSON.stringify({}));

                return <Redirect to='/dashboard' />

            })
            .catch(error => {
                console.log(error);
                this.setState({ isLoading: false });
            });
    }

    calculateFinalCartValue = async (cart) => {
        let quant = 0;
        let price = 0;
        if(cart && cart.length) {
            await cart.forEach(element => {
                if (typeof element['price'] == 'string') element['price'] = parseInt(element['price'])
                if (typeof element['quantity'] == 'string') element['quantity'] = parseInt(element['quantity'])
                quant = quant + parseInt(element['quantity']);
                price = price + parseInt(element['price']);
            });
        } else {
            cart = [];
        }
        this.setState({ totalQuantity: quant, totalPrice: price, cartItem: cart });
    }

    removeFromCart = async (index) => {
        let myCart = await localStorage.getItem('MyCart') ? JSON.parse(localStorage.getItem('MyCart')) : [];
        await myCart.splice(index, 1);
        let quant = 0;
        let price = 0;
        await myCart.forEach(element => {
            if (typeof element['price'] == 'string') element['price'] = parseInt(element['price'])
            if (typeof element['quantity'] == 'string') element['quantity'] = parseInt(element['quantity'])
            quant = quant + element['quantity'];
            price = price + element['price'];
        });
        this.setState({ cartItem: myCart, totalQuantity: quant, totalPrice: price })
        localStorage.setItem('MyCart', JSON.stringify(myCart));
        this.child.current.updateQuantity(myCart);
        toast.success('Product Removed From Cart SuccessFully', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    render() {
        if(!localStorage.getItem('token')) {
            return <Redirect to='/' />
        } else {
            if(!this.state.itemValue || (this.state.itemValue && !this.state.itemValue.categoryName)) {
                return <Redirect to='/dashboard' />
            }
        }
        return (
            <div>
                <Header ref={this.child}
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
                            <span className="header-title">Your Product Cart
                            </span>

                            {this.state.isLoading ? <Loader /> :
                                (
                                    <div className="parentModal">
                                        <Table className="table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell></TableCell>
                                                    <TableCell className="bigDevices">Item</TableCell>
                                                    <TableCell numeric>Quantity</TableCell>
                                                    <TableCell numeric>Price</TableCell>
                                                    <TableCell>Remove</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.cartItem.map((row, index) => {
                                                    return (
                                                        <TableRow key={row._id}>
                                                            <TableCell className="img-td"><img className="final-order-img"
                                                                src={row.image} style={styles.imgStyle} alt={row.name} /></TableCell>
                                                            <TableCell component="th" scope="row" className="bigDevices">
                                                                {row.name}
                                                            </TableCell>
                                                            <TableCell numeric>{row.quantity}</TableCell>
                                                            <TableCell numeric>{row.price}/-</TableCell>
                                                            <TableCell className="text-center">
                                                                <FontAwesomeIcon className="remove-cart" onClick={() => this.removeFromCart(index)} icon={faMinusCircle} style={styles.countercolor} />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                <TableRow>
                                                    <TableCell></TableCell>
                                                    <TableCell component="th" scope="row" className="bigDevices"><b>Total</b></TableCell>
                                                    <TableCell numeric><b>{this.state.totalQuantity}</b></TableCell>
                                                    <TableCell numeric><b>{this.state.totalPrice}  /-</b></TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                        <br /><br />

                                    </div>

                                )
                            }
                            <Button variant="outlined" color="primary"
                                style={styles.btnColor}
                            >
                                <Link to={`/products/${this.state.itemValue.subCatId}`}>
                                    Go To Products
                                                            </Link></Button>
                            <Button variant="outlined" color="primary"
                                className="order-now"
                                style={styles.color}
                                onClick={this.orderNow}
                            > Order Now </Button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
