/**
 * This module is for generating an ant design dog grid for each dog card matching the search query.
 * @module searchgrid
 * @author Kieran Dhir
 * @see searchdog for the module that requires this module
 */

import React from 'react';
import { Col, Row } from 'antd';
import DogCard from './dogcard';
import { status, json } from '../utilities/requestHandlers';
import { withRouter } from 'react-router';
import queryString from 'query-string';

/**
 * Search grid for displaying dog cards that match search query
 * @class
 */
class SearchGrid extends React.Component {
    /**
     * @constructor
     * @param {props} props - react properties to be passed
     */
    constructor(props) {
        super(props);
        this.state = {
            dogs: [],
            location: this.props.location.search
        }
    }
    /**
     * Invoked immediately after component is mounted
     * Requests all dog entries that match the search query from backend.
     */
    componentDidMount() {
        const value = queryString.parse(this.props.location.search);
        console.log(value);
        fetch(`https://albert-morris-3000.codio-box.uk/dogs/search?q=${value.q}`, {
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
        .catch(err => console.log("Error fetching dogs", err));  
    }

    /**
     * Invoked immediately after updating occurs
     * Send another requests for all dog entries that match the new search query from backend.
     */
    componentDidUpdate(){      
        if (this.state.location !== this.props.location.search){
            const value = queryString.parse(this.props.location.search);
            console.log(value);
            fetch(`https://albert-morris-3000.codio-box.uk/dogs/search?q=${value.q}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(status)
            .then(json)
            .then(data => {
                this.setState({ dogs: data })
                this.setState({location: this.props.location.search})
            })
            .catch(err => {
                if (err.status === 404){
                    return <h3>No Match</h3>
                }else{
                    console.log("Error fetching dogs", err);
                }
            }); 
        }
        
    }

    /**
     * Render react grid for displaying list of matching dog entires
     * @returns {JSX} - dog grid of matching dog entries
     */
    render() {
        if (!this.state.dogs.length) {
            return <h3>No Match</h3>
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

export default withRouter(SearchGrid);
