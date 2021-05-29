/**
 * The favourites page - Displays a grid of a user's favourite dogs.
 * @module favourites
 * @author Kieran Dhir
 * @see app for the module that requires this module
 */

import React from 'react';
import { PageHeader } from 'antd';
import FaveGrid from './favegrid';

/**
 * Function to return the favourites page to app router
 * @param {props} props 
 * @returns {JSX} - favourite page content
 */
function Favourite(props) {
    return (
        <div className="site-layout-content">
            <div style={{ padding: '2% 20%' }}>
                <PageHeader className="site-page-header"
                    title="Favourites"/>
            </div>  
            <FaveGrid />
        </div>
    );
}

export default Favourite;
