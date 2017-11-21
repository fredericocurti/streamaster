import React, { Component } from 'react';
import queryString from 'query-string';

class SpotifyAuth extends Component {
    constructor(props){
        super(props)
        this.state = {
            token : ''
        }
    }

    componentDidMount(){
        let query = queryString.parse(this.props.location.hash);
        let access_token = query.access_token
        window.localStorage.setItem('spotify_access_token',access_token)
        this.setState({ token : access_token })
        console.log('got token')
        this.props.history.push('/')
    }

    render() {

        
        return (
            <div>  
                Obtained spotify token : {this.state.token}
            </div>
        );
    }
}

export default SpotifyAuth;