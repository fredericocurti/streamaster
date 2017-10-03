import React, { Component } from 'react';
import queryString from 'query-string';

class SpotifyAuth extends Component {
    constructor(props){
        super(props)
    }

    componentDidMount(){
        let query = queryString.parse(this.props.location.hash);
        let access_token = query.access_token
        localStorage.setItem('spotify_access_token',access_token)
        window.close()
    }

    render() {

        
        return (
            <div>  
                OHSHIT {this.code}
            </div>
        );
    }
}

export default SpotifyAuth;