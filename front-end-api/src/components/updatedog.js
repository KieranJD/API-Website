/**
 * The indivual dog update page - Displays update form to allow the admins to update dog entries.
 * @module updatedog
 * @author Kieran Dhir
 * @see app for the module that requires this module
 */

import React from 'react';
import { PageHeader } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import UserContext from '../contexts/user';
import { withRouter, Redirect } from 'react-router';
import DogForm from './dogform'

/**
 * Update dog form
 * @class
 */
class UpdateForm extends React.Component {

    static contextType = UserContext;
    state = {redirect: null};

    /**
     * Function to update a dog entry by passing update form data to backend.
     * @param {array} values - array of field values taken from update form
     */
    onFinish = (values) => {
        const id = this.props.match.params.id; /** available using withRouter() */
        console.log(id);
        console.log('Received form values ', values);
        fetch(`https://albert-morris-3000.codio-box.uk/dogs/${id}`, {
            method: "PUT",
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
            alert("Dog updated");
            this.setState({redirect:'/'});
        })
        .catch(errorResponse => {
            console.error(`Error: ${JSON.stringify(errorResponse)}`);
        })
    }

    /**
     * Render react form for allowing admins to update a dog's data
     * @returns {JSX} - update dog page
     */
    render() {
        const id = this.props.match.params.id; /** available using withRouter() */
        /** Redirects router to given link */
        if (this.state.redirect){
            return <Redirect to={this.state.redirect} />
        }
        /** Returns the update form jsx */
        return (
            <>
            <PageHeader className="site-page-header"
                title={`Update Dog ${id}`}/>,
            <DogForm onFinish={this.onFinish}/>
            </>
        );
    };
};

export default withRouter(UpdateForm); 