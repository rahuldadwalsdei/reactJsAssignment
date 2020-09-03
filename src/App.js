import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Merchants from "./pages/merchants";
import Subcategories from "./pages/subcategories";
import Products from "./pages/products";
import Register from "./pages/register";
import NotFound from "./pages/notfound";
import Order from "./pages/order";
import ProductDetail from "./pages/product-detail";

class App extends Component {

    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact path='/' component={Login} />
                        <Route path='/dashboard' component={Dashboard} />
                        <Route path='/merchants/:id' component={Merchants} />
                        <Route path='/subcategories/:merchant' component={Subcategories} />
                        <Route path='/products/:subcategory' component={Products} />
                        <Route path='/order' component={Order} />
                        <Route path='/register' component={Register} />
                        <Route path='/product-detail/:id' component={ProductDetail} />

                        <Route path='*' component={NotFound} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
