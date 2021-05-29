/**
 * The home page - Displays a grid of all the dog entries.
 * @module home
 * @author Kieran Dhir
 * @see app for the module that requires this module
 */

import React from 'react';
import { PageHeader, Input } from 'antd';
import DogGrid from './doggrid';
import { useHistory } from "react-router-dom";

const { Search } = Input;

/**
 * Function to return the home page to app router
 * @param {props} props - react properties to be passed
 * @returns {JSX} - home page
 */
function Home(props) {
    let history = useHistory();

    /**
     * Function to handle searchbar being clicked
     * @param {string} value - search query 
     */
    function handleClick(value) {
        if (value.length >= 3){ /** Must be 3 or more characters to generate query*/
            history.push(`/dogs/search?q=${value}`);
        }else if (value.length === 0){ /** If searchbar is empty return to home page */
            history.push('/')
        }
    }

    /** Return home page jsx */
    return (
        <div className="site-layout-content">
            <div style={{ padding: '2% 20%' }}>
                <Search placeholder="Search for dogs"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={handleClick}/>
                <PageHeader className="site-page-header"
                    title="Canine Shelter"
                    subTitle="Welcome to the Canine Shelter!"/>
            </div>  
            <DogGrid />
        </div>
    );
}

export default Home;
