/**
 * The indivual dog page - Displays all the data for a single dog entry.
 * @module singledog
 * @author Kieran Dhir
 * @see app for the module that requires this module
 */

import React from 'react';
import { withRouter, Redirect } from 'react-router';
import { Image, Row, Col, Typography } from 'antd'
import DogIcon from './dogicon';
import { status, json } from '../utilities/requestHandlers';
import UserContext from '../contexts/user';

const { Title, Paragraph } = Typography;

/**
 * Page for displaying a single dog entry
 * @class
 * @param {props} props - react properties to be passed
 */
class Dog extends React.Component {

    /**
     * @constructor
     * @param {props} props - react properties to be passed
     */
    constructor(props) {
        super(props);
        this.state = {
            dog: undefined
        }
        this.toggleFavourite = this.toggleFavourite.bind(this);
        this.selectEdit = this.selectEdit.bind(this);
        this.selectDelete = this.selectDelete.bind(this);
    }

    static contextType = UserContext;

    state = {redirect: null};
    
    /**
     * Invoked immediately after the component is mounted
     * Requests a single dog entry from the backend.
     */
    componentDidMount() {
        const id = this.props.match.params.id; // available using withRouter()

        fetch(`https://albert-morris-3000.codio-box.uk/dogs/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(status)
        .then(json)
        .then(data => {
            this.setState({ dog: data })
        })
        .catch(err => console.log(`Error fetching dog ${id}`, err));  
    }
    
    /**
     * Function to toggle favourite icon
     * @param {bool} isSelected - state of favourite icon
     */
    toggleFavourite(isSelected) {
        const dogID = this.props.match.params.id;
        console.log('fave was toggled');
        if (isSelected === true){ /** Request dog entry is added to user's favourites */
            fetch(`https://albert-morris-3000.codio-box.uk/users/${this.context.user.ID}/favourites/${dogID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.context.user.token
                }
            })
            .then(status)
            .then(json)
            .then(data => {
                console.log(`Added dog ${dogID} to favourites successfully`)
            })
            .catch(errorResponse => {
                console.error(`Error: ${JSON.stringify(errorResponse)}`);
            })
        }else{ /** Requests dog entry is deleted from user's favourites */
            fetch(`https://albert-morris-3000.codio-box.uk/users/${this.context.user.ID}/favourites/${dogID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.context.user.token
                }
            })
            .then(status)
            .then(json)
            .then(data => {
                console.log(`Deleted dog ${dogID} from favourites successfully`)
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
        this.setState({redirect:`/update/dog/${this.props.match.params.id}`});
    }

    /**
     * Function to delete dog entries
     * Requests delete for the given dog entry to backend.
     */
    selectDelete(){
        const dogID = this.props.match.params.id;
        console.log(`Deleting dog ${dogID}`)
        fetch(`https://albert-morris-3000.codio-box.uk/dogs/${dogID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.context.user.token
            }
        })
        .then(status)
        .then(json)
        .then(data => {
            console.log(`Deleted dog ${dogID} successfully`)
            this.setState({redirect:'/'});
        })
        .catch(errorResponse => {
            console.error(`Error: ${JSON.stringify(errorResponse)}`);
        })
    }

    /**
     * Render page displaying a single dog entry
     * @returns {JSX} - single dog entry page
     */
    render() {
        /** Redirects router to given link */
        if (this.state.redirect){
            return <Redirect to={this.state.redirect} />
        }
        
        if (!this.state.dog) {
            return <h3>Loading Dog...</h3>
        }
        
        const dog = this.state.dog;

        /*
            Displays icons depending on login and staff status
        */
        let StatusIcons;
        if (this.context.user.role === 'admin'){ /** Admin can update and delete */
            StatusIcons = (
                <>
                <div>
                Favourite : <DogIcon type="favourite" selected={dog.favourite}
                    handleToggle={this.toggleFavourite}/>
                </div>
                <div>
                Edit : <DogIcon type="edit" selected={dog.edit}
                    handleToggle={this.selectEdit}/>
                </div>
                <div>
                Delete : <DogIcon type="delete" selected={dog.delete}
                    handleToggle={this.selectDelete}/>
                </div>
                </>
            );
        }else if (this.context.user.loggedIn === true){ /** logged in user can favourite */
            StatusIcons = (
                <>
                Favourite : <DogIcon type="favourite" selected={dog.favourite}
                    handleToggle={this.toggleFavourite}/>
                </>
            );
        }
        /** Returns the dog entry jsx */
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={6} align="center">
                        <Image width={200} alt="Dog" src={dog.imageURL} />
                    </Col>
                    <Col span={12}>
                        <Title>{dog.name}</Title>
                        <Paragraph>Breed: {dog.breed}</Paragraph>
                        <Paragraph>Sex: {dog.sex}</Paragraph>
                        <Paragraph>Age: {dog.age}</Paragraph>
                    </Col>
                    <Col span={6} align="center">
                        {StatusIcons}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(Dog);
