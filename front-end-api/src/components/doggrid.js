/**
 * This module is for generating an ant design dog grid for each dog card.
 * @module doggrid
 * @author Kieran Dhir
 * @see home for the module that requires this module
 */

import React from 'react';
import { Col, Row } from 'antd';
import DogCard from './dogcard';
import { status, json } from '../utilities/requestHandlers';

/**
 * Dog grid for displaying dog cards
 * @class
 */
class DogGrid extends React.Component {

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

    /**
     * Invoked immediately after component is mounted
     * Requests all dog entries from backend.
     */
    componentDidMount() {
        fetch('https://albert-morris-3000.codio-box.uk/dogs', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
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
     * Render react grid for displaying list of dog entries
     * @returns {JSX} - dog grid of dog cards
     */
    render() {
        if (!this.state.dogs.length) {
            return <h3>Loading dogs...</h3>
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
        /** Returns list of dog cards in a grid*/
        return (
            <Row type="flex" justify="space-around">
                {cardList}
            </Row>
        );
      }
}

export default DogGrid;
