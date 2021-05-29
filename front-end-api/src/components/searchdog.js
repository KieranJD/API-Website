/**
 * The search page - Displays a grid of all the dog entries that match the search query.
 * @module searchdog
 * @author Kieran Dhir
 * @see app for the module that requires this module
 */

import React from 'react';
import { PageHeader, Input } from 'antd';
import SearchGrid from './searchgrid';
import { useHistory } from "react-router-dom";

const { Search } = Input;

/**
 * Function to return the search page to app router
 * @param {props} props - react properties to be passed
 * @returns {JSX} - search page
 */
function SearchDog(props) {  
    let history = useHistory();

    /**
     * Function to handle searchbar being clicked
     * @param {string} value - search query 
     */
    function handleClick(value) {
        if (value.length >= 3){ /** Must be 3 or more characters */
            history.push(`/dogs/search?q=${value}`);
        }else if (value.length === 0){ /** Empty query does back to home page */
            history.push('/')
        }
    }
    
    /** Return search page jsx */
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
            <SearchGrid />
        </div>
    );
}

export default SearchDog;
