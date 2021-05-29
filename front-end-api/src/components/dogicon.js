/**
 * This module handling dog card icons.
 * @module dogicon
 * @author Kieran Dhir
 * @see dogcard for the module that requires this module
 */

import React from 'react';

import StarOutlined from '@ant-design/icons/StarOutlined';
import StarFilled from '@ant-design/icons/StarFilled';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EditFilled from '@ant-design/icons/EditFilled';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import DeleteFilled from '@ant-design/icons/DeleteFilled';

/**
 * @typedef {"filled" | "outlined"} theme
 * @typedef {"favourite" | "edit" | "delete"} iconType
 */
         
/**
 * Determine the icon to be displayed
 * 
 * @param {theme} theme - design of icon
 * @param {iconType} iconType - icon to show
 * @returns {Object} - the correct Ant Design icon component
 */
function getIcon (theme, iconType) {
    let Icon;
    if (theme === 'filled') {
        if (iconType === 'favourite'){
            Icon = StarFilled;
        }else if (iconType === 'edit'){
            Icon = EditFilled;
        }else if (iconType === 'delete'){
            Icon = DeleteFilled;
        }
    } else if (theme === 'outlined') {
        if (iconType === 'favourite'){
            Icon = StarOutlined;
        }else if (iconType === 'edit'){
            Icon = EditOutlined;
        }else if (iconType === 'delete'){
            Icon = DeleteOutlined;
        }  
    }
    return Icon;
}

/**
 * Defines each dog icon for dog card
 * @class
 */
class DogIcon extends React.Component {
    /**
     * @constructor
     * @param {props} props - react properties to be passed
     */
    constructor(props){  
        super(props);  
        this.state = {
            selected: props.selected
        };
        this.onClick = this.onClick.bind(this);
    }

    /**
     * Function to revert the selected state with every click
     * @returns {null}
     */
    onClick(){
        if (this.props.viewOnly) {
            console.log('This icon is view only: preventing update');
            return;
        }
    this.setState({selected: !this.state.selected});
    }

    /**
     * Invoked immediateky after updating occurs
     * Calls handleToggle if the state has changed
     * @param {props} prevProps - previous props
     * @param {props} prevState  - previous state of props
     */
    componentDidUpdate(prevProps, prevState){
        if (prevState.selected !== this.state.selected) {
            /** run the handler passed in by the parent component */
            this.props.handleToggle(this.state.selected);
        }
    }

    /**
     * Render ant design icons
     * @returns {JSX} - ant design icons
     */
    render(){
        const theme = this.state.selected ? 'filled' : 'outlined';
        const iconType = this.props.type;
        const Icon = getIcon(theme, iconType);

        /** 
         * return a span that contains the desired icon
         * and a space then the counter
         * if the icon is clicked we will run onClick handler
         * */ 
        return (
            <span>
            <Icon
                onClick={this.onClick}
                style={{color:'steelblue'}} />
            </span>
        );
    }
}

export default DogIcon;
