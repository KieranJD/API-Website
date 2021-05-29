/**
 * This module will generate the navbar.
 * @module navbar
 * @author Kieran Dhir
 * @see app for the module that requires this module
 */

import React from 'react';
import { useContext } from 'react'
import { Menu } from 'antd';
import { Link } from "react-router-dom";
import UserContext from '../contexts/user'

/**
 * Function to generate navbar menu and menu items
 * @returns {JSX} - navbar
 */
function Nav() {
    const context = useContext(UserContext);
    const loggedIn = context.user.loggedIn;
    let StatusNavbar;
    
    /**
     * Conditional rendering dependant on whether user is logged in and role of said user
     */
    if(!loggedIn){ /** users must login to access additonal navbar links */
        StatusNavbar = (
            <>
            <Menu.Item key="2">
                <Link to="/register">Register</Link>
            </Menu.Item>
            <Menu.Item key="3">
                <Link to="/login">Login</Link>
            </Menu.Item>
            </>
        );
    }else{
        if(context.user.role === 'admin'){ /** Only staff can view upload navbar */
            StatusNavbar = (
                <>
                <Menu.Item key="2">
                    <Link to={`/users/${context.user.ID}/favourites`}>Favourites</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to="/upload">Upload</Link>
                </Menu.Item>
                <Menu.Item key="4" onClick={context.logout}>
                    <Link to="/">Logout</Link>
                </Menu.Item>
                </>
            );
        }else{ /** Standard user navbar links */
            StatusNavbar = (
                <>
                <Menu.Item key="2">
                    <Link to={`/users/${context.user.ID}/favourites`}>Favourites</Link>
                </Menu.Item>
                <Menu.Item key="3" onClick={context.logout}>
                    <Link to="/">Logout</Link>
                </Menu.Item>
                </>
            );
        }
    }
    /** Returns navbar with given conditional rendered menu items */
    return (
        <>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
            {StatusNavbar}
        </Menu>
        </>

    );  
}
    
export default Nav;