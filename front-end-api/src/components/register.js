/**
 * The register page - Displays register form to allow the regsiter a new account.
 * @module register
 * @author Kieran Dhir
 * @see app for the module that requires this module
 */

import React from 'react';
import { Form, Input, Button, PageHeader } from 'antd';
import { status, json } from '../utilities/requestHandlers';
import { Redirect } from 'react-router';
import UserContext from '../contexts/user';

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
    {min: 2, message: 'Your username must be between 2 and 16 characters'},
    {max: 16, message: 'Your username must be between 2 and 16 characters'}
]

const emailRules = [
    {required: true, message: 'Please enter your E-mail'},
    {type: 'email', message: 'This is not a valid E-mail'}
]

const passwordRules = [
    {required: true, message: 'Please enter your password'},
    {min: 8, message: 'Your password must be between 8 and 16 characters'},
    {max: 16, message: 'Your password must be between 8 and 16 characters'}
]

const confirmPassword = [
    {required: true, message: 'Please confirm your password'},
    {min: 8, message: 'Your password must be between 8 and 16 characters'},
    {max: 16, message: 'Your password must be between 8 and 16 characters'},
    ({ getFieldValue }) => ({ /** Check is confirmPassword equals password field value */
        validator(rule,value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject('The password does not match');
        }
    })
]

/**
 * User register form
 * @class
 */
class RegistrationForm extends React.Component {

    /**
     * @constructor
     * @param {props} props - react properties to be passed
     */
    constructor(props) {
        super(props);
        this.onFinish = this.onFinish.bind(this);
    }
    
    state = {redirect: null};

    static contextType = UserContext;

    /**
     * Function to register user by passing register form data to backend.
     * @param {array} values - array of field values taken from register form
     */
    onFinish = (values) => {
        console.log('Received form values ', values);
        const { confirm, ...data} = values; /** ignore 'confirm' value */
        fetch('https://albert-morris-3000.codio-box.uk/users/register', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(status)
        .then(json)
        .then(user => {
            if(user.message){ /** If 403 status has been returned */
                alert(user.message);
            }else {
                console.log(user);
                alert("User added");
                this.context.login(user); /** Insert user data into user context */
                this.setState({redirect:'/'}); /** Redirect to home page */
            }
        })
        .catch(errorResponse => {
            console.error(`Error: ${JSON.stringify(errorResponse)}`);
            
        })
    }

    /**
     * Render react form for registering users
     * @returns {JSX} - register form
     */
    render() {
        /** Redirects router to given link */
        if (this.state.redirect){
            return <Redirect to={this.state.redirect} />
        }
        /**
         * Returns register form
         * If submit is clicked onFinish is called
         */
        return (
            <>
            <PageHeader className="site-page-header"
                title="Regsiter Account"/>,
            <Form { ...formItemLayout } name="register" onFinish={this.onFinish} scrollToFirstError>
                <Form.Item name="username" label="Username" rules={usernameRules}>
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="E-mail" rules={emailRules}>
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={passwordRules} hasFeedback>
                    <Input.Password />
                </Form.Item>

                <Form.Item name="confirm" label="Confirm Password" dependencies={['password']} rules={confirmPassword} hasFeedback>
                    <Input.Password />
                </Form.Item>

                <Form.Item name="role" label="Staff Code" >
                    <Input.Password />
                </Form.Item>

                <Form.Item { ...tailFormItemLayout }>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
            </>
        );
    };
};

export default RegistrationForm; 