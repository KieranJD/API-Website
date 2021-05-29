/**
 * A module to set-up react and routes.
 * @module app
 * @author Kieran Dhir
 */

import React from 'react';
import { Layout } from 'antd';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';

import Navbar from './components/navbar'
import Home from './components/home';
import Register from './components/register';
import Login from './components/login';
import Dog from './components/singledog';
import Favourites from './components/favourites';
import Upload from './components/upload';
import UpdateDog from './components/updatedog';
import SearchDog from './components/searchdog';

import UserContext from './contexts/user'
import createHistory from 'history/createBrowserHistory'

const history = createHistory();

const { Header, Content, Footer } = Layout;

/**
 * Creates the app react component
 * @class
 */
class App extends React.Component {
    
    /**
     * @constructor
     * @param {props} props - react properties to be passed
     */
    constructor(props) {
        super(props);
        this.state = {
            user: {loggedIn: false}
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    /**
     * Function to login user by setting user context to contain the current user
     * @param {object} user - user to be logged in
     */
    login(user) {
        console.log(`${user.username} is now being logged in`);
        user.loggedIn = true;
        this.setState({user:user})
    }

    /**
     * Function to loggout user by clearing user context
     */
    logout() {
        console.log(`user is now being logged out`);
        this.setState({user: {loggedIn:false}});
    }
    
    /**
     * Render Router
     * @returns {React} - app router
     */
    render () {
        /** Define context */
        const context = {
            user: this.state.user,
            login: this.login,
            logout: this.logout
        };

        /** Conditional rendering */
        let StatusLinks;
        if (this.state.user.role === 'admin'){ /** Only allow admin to Upload */
            StatusLinks = (
                <>
                <Route path="/upload" children={<Upload />} />,
                <Route path="/update/dog/:id" children={<UpdateDog />} />
                <Route path="/users/:userid/favourites" children={<Favourites />} />,
                </>
            );
        }else if (this.state.user.loggedIn !== false){ /** Only available when logginIn */
            StatusLinks = (
                <>
                <Route path="/users/:userid/favourites" children={<Favourites />} />,
                </>
            );
        }
        
        /** Return app router */
        return (
            <UserContext.Provider value={context}>
                <Router history={history}>
                    <Header>
                        <Navbar />
                    </Header>

                    <Content>
                        <Switch>
                            <Route path="/" children={<Home />} exact />
                            <Route path="/login" children={<Login />} />
                            <Route path="/register" children={<Register />} />
                            <Route path="/dog/:id" children={<Dog />} />
                            <Route path="/dogs/search" children={<SearchDog />} />
                            {StatusLinks}
                        </Switch>
                    </Content>

                    <Footer style={{ textAlign: 'center' }}>Canine Shelter Footer</Footer>

                </Router>
            </UserContext.Provider>
        );
    }
}

export default App;
