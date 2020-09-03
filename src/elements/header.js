import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import TitleComponent from "../pages/title";
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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

export default class Header extends Component {

    state = {
        toDashboard: false,
        isMenuOpen: false,
        cartItem: [],
        totalQuantity: 0,
        totalPrice: 0
    };


    constructor(props) {
        super(props);
        let myCart = localStorage.getItem('MyCart') ? JSON.parse(localStorage.getItem('MyCart')) : [];
        if(!myCart) myCart = [];
        this.updateQuantity(myCart)
        this.handleClickLogout = this.handleClickLogout.bind(this)
    }



    updateQuantity = async (myCart) => {
        let quant = 0;
        let price = 0;
        if (myCart && myCart.length) {
            await myCart.forEach(element => {
                if (typeof element['price'] == 'string') element['price'] = parseInt(element['price'])
                if (typeof element['quantity'] == 'string') element['quantity'] = parseInt(element['quantity'])
                quant = quant + element['quantity'];
                price = price + element['price'];
            });
        } else {
            myCart = [];
        }

        this.setState({ cartItem: myCart, totalQuantity: quant, totalPrice: price })
    }

    handleClickLogout() {
        localStorage.removeItem('token');
        localStorage.setItem('isLoggedIn', false);
        this.setState({ toDashboard: true });
    }

    openMenu = () => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen })
    }

    handleClose = () => {
        console.log('On Close');
    }

    removeFromCart = async (index) => {
        let myCart = await localStorage.getItem('MyCart') ? JSON.parse(localStorage.getItem('MyCart')) : [];
        if(!myCart) myCart = [];
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
        const { anchorEl } = this.props;
        if (this.state.toDashboard === true) {
            return <Redirect to='/' />
        }
        return (
            <nav className="navbar navbar-expand navbar-dark bg-dark static-top">
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
                <TitleComponent title="React CRUD Login "></TitleComponent>

                <Link to={'/dashboard'} className="navbar-brand mr-1">Home</Link>

                <button className="btn btn-link btn-sm text-white order-1 order-sm-0" id="sidebarToggle">
                    <i className="fas fa-bars"></i>
                </button>

                <span className="main-heading">Food Ordering Application</span>


                <form className="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search for..." aria-label="Search"
                            aria-describedby="basic-addon2" />
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="button">
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </form>

                <Button className="cart-icon"
                    color="inherit"
                    onClick={this.openMenu}>
                    <FontAwesomeIcon
                        icon={faShoppingCart} />
                    <span
                        className="cartCount">
                        {this.state.totalQuantity}
                    </span>
                </Button>

                <Menu
                    id="fade-menu"
                    anchorEl={anchorEl}
                    open={this.state.isMenuOpen}
                    onClose={this.handleClose}
                    TransitionComponent={Fade}
                    className={`menu ${this.state.totalQuantity > 0 ? "cart-items-menu" : ""}`} >
                    {this.state.totalQuantity > 0 ?
                        <div>
                            <MenuItem
                                className="menusItem total-qty">
                                <Table className="table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell className="bigDevices">Item</TableCell>
                                            <TableCell numeric>Quantity</TableCell>
                                            <TableCell numeric>Price</TableCell>
                                            <TableCell >Remove</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.cartItem.map((row, index) => {
                                            return (
                                                <TableRow key={row._id}>
                                                    <TableCell className="img-td"><img className="header-img"
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
                                    </TableBody>
                                </Table>
                            </MenuItem>

                            <MenuItem
                                className="menusItem total-qty justify-content-center">
                                Total Items : {this.state.totalQuantity}
                            </MenuItem>
                            <MenuItem
                                className="menusItem total-qty justify-content-center">
                                Total Price : {this.state.totalPrice} /-
            </MenuItem>
                            <br />
                            <MenuItem className="justify-content-center"
                            >
                                <Button
                                    color="primary"
                                    className="btn-order">
                                    <Link to={`/order`}>
                                        <span className="white-color">Checkout</span>
                                    </Link>
                                </Button>
                            </MenuItem>
                        </div> :
                        <MenuItem
                            onClick={this.handleClose}
                            onMouseLeave={this.handleClose}
                            className="menuItem">
                            <img
                                src="https://cdn.dribbble.com/users/844846/screenshots/2981974/empty_cart_800x600_dribbble.png"
                                width="250px"
                                height="250px"
                                alt="desc" />
                        </MenuItem>}
                </Menu>

                <ul className="navbar-nav ml-auto ml-md-0">
                    <li className="nav-item dropdown no-arrow">
                        <Link to={'#'} className="nav-link dropdown-toggle" id="userDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-user-circle fa-fw"></i>
                        </Link>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                            <Link to={'#'} className="dropdown-item">Settings</Link>
                            <Link to={'#'} className="dropdown-item">Activity Log</Link>
                            <div className="dropdown-divider"></div>
                            <Link to={'#'} onClick={this.handleClickLogout} className="dropdown-item" data-toggle="modal" data-target="#logoutModal">Logout</Link>
                        </div>
                    </li>
                </ul>
            </nav>
        );
    }
}
