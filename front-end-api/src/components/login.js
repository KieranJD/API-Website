/**
 * The login page - Displays login form to allow the user to login.
 * @module login
 * @author Kieran Dhir
 * @see app for the module that requires this module
 */

import React from 'react';
import { Form, Input, Button, PageHeader } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import UserContext from '../contexts/user';
import { Redirect } from 'react-router';

/*
    Layout
*/
const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 6 } }, 
    wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }    
};
    
const tailFormItemLayout = {
    wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
}; 

/*
    Rules
*/

const usernameRules = [
    { required: true, message: 'Please enter your username', whitespace: true},
]

const passwordRules = [
    {required: true, message: 'Please enter your password'},
]

/**
 * User login form
 * @class
 */
class LoginForm extends React.Component {

    /**
     * @constructor
     * @param {props} props - react properties to be passed
     */
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
    }

    static contextType = UserContext;

    state = {redirect: null};

    /**
     * Function to login user by authenticating login form username and password
     * Requests username and password is checked against DB user records.
     * @param {array} values - array taken from login form field values username and password
     */
    login = (values) => {
        const {username, password} = values;
        console.log(`Logging in user: ${username}`)
        fetch('https://albert-morris-3000.codio-box.uk/users/login', {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(username + ":" + password)
            }
        })
        .then(status)
        .then(json)
        .then(user => {
            console.log(user);
            this.context.login(user); /** Insert user data into user context */
            this.setState({redirect:'/'}); /** Redirect to home page */
        })
        .catch(errorResponse => {
            if (errorResponse.status === 401){
                alert('Incorrect username and/or password');
            }else{
                console.error(`Error: ${JSON.stringify(errorResponse)}`);
            }
        })
    }

    /**
     * Render react form for logging in users
     * @returns {JSX} - login form
     */
    render() {
        /** Redirects router to given link */
        if (this.state.redirect){
            return <Redirect to={this.state.redirect} />
        }
        /**
         * Returns login form
         * If submit is clicked onFinish is called
         */
        return (
            <>
            <PageHeader className="site-page-header"
                title="Login"/>,
            <Form { ...formItemLayout } name="login" onFinish={this.login} scrollToFirstError>
                <Form.Item name="username" label="Username" rules={usernameRules}>
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={passwordRules} hasFeedback>
                    <Input.Password />
                </Form.Item>

                <Form.Item { ...tailFormItemLayout }>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
            </>
        );
    };
};

export default LoginForm; 