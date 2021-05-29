/**
 * Wrap an image tag as a React component to allow router linking.
 * @module navimage
 * @author Kieran Dhir
 * @see dogcard for the module that requires this module
 */

import React from 'react';
import { useHistory } from 'react-router-dom';

/**
 * Attach history function to image link
 * @param {*} props 
 * @returns {image} image 
 */
const NavImage = (props) => {
    const history = useHistory();
    return <img alt={props.alt} src={props.src} onClick={() => history.push(props.to)} />;
}
 export default NavImage;
 