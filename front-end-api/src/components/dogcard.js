/**
 * This module will generate dog entry ant design cards.
 * @module dogcard
 * @author Kieran Dhir
 * @see doggrid for the module that requires this module
 */

import React from 'react';
import { Card } from 'antd';
import DogIcon from './dogicon';
import NavImage from './navimage';
import UserContext from '../contexts/user';
import { status, json } from '../utilities/requestHandlers';
import { Redirect } from 'react-router';

const { Meta } = Card;

/**
 * Generates ant design cards for each dog entry 
 * @class
 */
class DogCard extends React.Component {

    /**
     * @constructor
     * @param {props} props - react properties to be passed
     */
    constructor(props) {
        super(props);
        this.toggleFavourite = this.toggleFavourite.bind(this);
        this.selectEdit = this.selectEdit.bind(this);
        this.selectDelete = this.selectDelete.bind(this);
    }

    static contextType = UserContext;

    state = {redirect: null};

    /**
     * Function to toggle favourite icon
     * @param {bool} isSelected - state of favourite icon
     */
    toggleFavourite(isSelected) {
        console.log(`toggle FAVOURITE on dog post ${this.props.ID}`);
        console.log(`new value ${isSelected}`);
        if (isSelected === true){ /** Request dog entry is added to user's favourites */
            fetch(`https://albert-morris-3000.codio-box.uk/users/${this.context.user.ID}/favourites/${this.props.ID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.context.user.token
                }
            })
            .then(status)
            .then(json)
            .then(data => {
                console.log(`Added dog ${this.props.ID} to favourites successfully`)
            })
            .catch(errorResponse => {
                console.error(`Error: ${JSON.stringify(errorResponse)}`);
            })
        }else{ /** Requests dog entry is deleted from user's favourites */
            fetch(`https://albert-morris-3000.codio-box.uk/users/${this.context.user.ID}/favourites/${this.props.ID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.context.user.token
                }
            })
            .then(status)
            .then(json)
            .then(data => {
                console.log(`Deleted dog ${this.props.ID} from favourites successfully`)
            })
            .catch(errorResponse => {
                console.error(`Error: ${JSON.stringify(errorResponse)}`);
            })
        } 
    }

    /**
     * Function to redirect to given update link if edit icon is clicked
     */
    selectEdit(){
        this.setState({redirect:`/update/dog/${this.props.ID}`});
    }

    /**
     * Function to delete dog entries
     * Requests delete for given dog entry to backend.
     */
    selectDelete(){
        console.log(`Deleting dog ${this.props.ID}`)
        fetch(`https://albert-morris-3000.codio-box.uk/dogs/${this.props.ID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.context.user.token
            }
        })
        .then(status)
        .then(json)
        .then(data => {
            console.log(`Deleted dog ${this.props.ID} successfully`)
            this.setState({redirect:'/'});
        })
        .catch(errorResponse => {
            console.error(`Error: ${JSON.stringify(errorResponse)}`);
        })
    }
    
    /**
     * Render react card containing dog entry data
     * @returns {JSX} - dog cards
     */
    render() {
        const dogID = this.props.ID;
        if (this.state.redirect){
            return <Redirect to={this.state.redirect} />
        }
        /*
            Displays icons depending on login and staff status
        */
        let StatusIcons;
        if (this.context.user.role === 'admin'){ /** Admin can update and delete */
            StatusIcons = [
                <DogIcon type="favourite" selected={this.props.favourite}
                    handleToggle={this.toggleFavourite}/>,
                <DogIcon type ="edit" seleted={this.props.edit}
                    handleToggle={this.selectEdit}/>,
                <DogIcon type="delete" selected={this.props.delete}
                    handleToggle={this.selectDelete}/>
            ];
        }else if (this.context.user.loggedIn === true){ /** logged in user can favourite */
            StatusIcons = [
                <DogIcon type="favourite" selected={this.props.favourite}
                    handleToggle={this.toggleFavourite}/>
            ];
        }
        /** Returns the dog ant design card */
        return (
            <Card
                style={{ width: 320 }}
                cover={<NavImage alt={`Dog ${dogID}`} src={this.props.imageURL} to={`/dog/${dogID}`} />}
                hoverable={true}
                actions={
                    StatusIcons
                }>
                <Meta title={this.props.name} description={this.props.breed}/>
            </Card>
        );
    }
}

export default DogCard; 
