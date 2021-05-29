/**
 * The upload page - Displays dog update form to allow admins to update dog entires.
 * @module upload
 * @author Kieran Dhir
 * @see app for the module that requires this module
 */

import React from 'react';
import { PageHeader } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { Redirect } from 'react-router';
import UserContext from '../contexts/user';
import DogForm from './dogform'

/**
 * Upload dog form
 * @class
 */
class UploadForm extends React.Component {

    static contextType = UserContext;
    state = {redirect: null};

    /**
     * Function to add a new dog entry by passing upload form data to backend.
     * @param {array} values - array of field values taken from upload form
     */
    onFinish = (values) => {
        console.log('Received form values ', values);
        fetch('https://albert-morris-3000.codio-box.uk/dogs/upload', {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.context.user.token
            }
        })
        .then(status)
        .then(json)
        .then(dog => {
            console.log(dog);
            alert("Dog added");
            this.setState({redirect:'/'});
        })
        .catch(errorResponse => {
            console.error(`Error: ${JSON.stringify(errorResponse)}`);
        })
    }

    /**
     * Render react form for allowing admins to create new dog entries.
     * @returns {JSX} - upload page
     */
    render() {
        /** Redirects router to given link */
        if (this.state.redirect){
            return <Redirect to={this.state.redirect} />
        }
        /** Returns the upload page jsx */
        return (
            <>
            <PageHeader className="site-page-header"
                title="Upload Dog"/>,
            <DogForm onFinish={this.onFinish}/>
            </>
        );
    };
};

export default UploadForm; 