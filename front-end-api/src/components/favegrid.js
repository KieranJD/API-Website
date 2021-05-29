/**
 * This module for generating a ant design favourite grid for each dog card.
 * @module favgrid
 * @author Kieran Dhir
 * @see favourites for the module that requires this module
 */

import React from 'react';
import { Col, Row } from 'antd';
import DogCard from './dogcard';
import { status, json } from '../utilities/requestHandlers';
import UserContext from '../contexts/user';

/**
 * Favourite dog grid for displaying dog cards
 * @class
 */
class FaveGrid extends React.Component {

    /**
     * @constructor
     * @param {props} props - react properties to be passed
     */
    constructor(props) {
        super(props);
        this.state = {
            dogs: []
        }
    }

    static contextType = UserContext;

    /**
     * Invoked immediately after component is mounted
     * Requests all favoruite dog entries for a user from backend.
     */
    componentDidMount() {
        const userid = this.context.user.ID;
        fetch(`https://albert-morris-3000.codio-box.uk/users/${userid}/favourites`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.context.user.token
            }
        })
        .then(status)
        .then(json)
        .then(data => {
            this.setState({ dogs: data })
        })
        .catch(err => {
            if (err.status === 404){
                return <h3>No Match</h3>
            }else{
                console.log("Error fetching dogs", err);
            }
        }); 
    }

    /**
     * Render react grid for displaying a user's favourite dog cards
     * @returns {JSX} - a user's favourite dog grid
     */
    render() {
        if (!this.state.dogs.length) {
            return <h3>Loading favourites...</h3>
        }
        /**
         * Generates list of dog card entries
         */
        const cardList = this.state.dogs.map(dog => {
            return (
                <div style={{padding:"10px"}} key={dog.id}>
                    <Col span={6}>
                        <DogCard {...dog} />
                    </Col>
                </div>
          )
        });
        /** Returns list of dog cards in a grid */
        return (
            <Row type="flex" justify="space-around">
                {cardList}
            </Row>
        );
      }
}

export default FaveGrid;
