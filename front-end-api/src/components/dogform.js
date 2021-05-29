/**
 * This module for generating dog update/create form.
 * @module dogform
 * @author Kieran Dhir
 * @see upload for the module that requires this module
 * @see updatedog for the module that requires this module
 */

import React from 'react';
import { Form, Input, Button, Upload, InputNumber, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

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
const nameRules = [
    { required: true, message: "Please enter the dog's name", whitespace: true},
    {min: 1, message: 'Name must be between 1 and 20 characters'},
    {max: 20, message: 'Name must be between 1 and 20 characters'},
    {type: 'string', message: 'This is not a valid name'}
]

const breedRules = [
    {required: true, message: "Please enter the dog's breed"},
    {min: 2, message: 'Breed must be between 2 and 20 characters'},
    {max: 20, message: 'Breed must be between 2 and 20 characters'},
    {type: 'string', message: 'This is not a valid breed'}
]

const sexRules = [
    {required: true, message: "Please enter the dog's sex"},
]

const ageRules = [
    {required: true, message: "Please enter the dog's age"},
]

/**
 * Dog input form
 * @class
 */
class DogForm extends React.Component {
    
    /**
     * @constructor
     * @param {props} props - react properties to be passed
     */
    constructor(props) {
        super(props);
        this.onFinish = this.props.onFinish.bind(this)
    }
    
    /**
     * Render react form for adding dog entries
     * @returns {JSX} - dog form
     */
    render(){
        /** 
         * Returns ant design dog form 
         * If submit is clicked onFinish is called
        */
        return (
            <Form { ...formItemLayout } name="upload" onFinish={this.onFinish} scrollToFirstError>
            <Form.Item name="name" label="Dog Name" rules={nameRules}>
                <Input />
            </Form.Item>

            <Form.Item name="breed" label="Breed" rules={breedRules}>
                <Input />
            </Form.Item>

            <Form.Item name="sex" label="Sex" rules={sexRules}>
                <Select
                    placeholder="Select"
                    >
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                </Select>
            </Form.Item>
            
            <Form.Item name="age" label="Age" rules={ageRules} >
                <InputNumber min={0} max={25} />
            </Form.Item>

            <Form.Item name="imageURL" label="Photo" >
                <Upload name="dogImg" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
            </Form.Item>

            <Form.Item { ...tailFormItemLayout }>
                <Button type="primary" htmlType="submit">
                    Upload
                </Button>
            </Form.Item>
        </Form>
        );
    };

}
export default DogForm;