import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { Avatar } from 'material-ui'
import '../css/main.css'
import SearchBar from './SearchBar'
import Slider from './Slider'
import Track from './Track'

import spotify from '../helpers/spotify.js'

class Main extends Component {
    constructor(props) {
        super(props);
        this.lastSearch = ''
        this.state = {
            search : '',
            spotifyTracks : []
        }
    }

    componentWillMount() {
        spotify.authenticate((status) => {
            console.log('Auth status : ' + status)
        })
    }

    onSearchSubmit = () => {
        if (this.state.search != this.lastSearch && this.state.search != '') {
            spotify.searchTracks(this.state.search,(songs) => {
                console.log(songs.tracks.items)
                this.setState({ spotifyTracks : songs.tracks.items })    
            })
        }
        this.lastSearch = this.state.search
    }
 
    render() {
        return (
            <div>
                <span className='user-info valign-wrapper'>
                    <span className='user-email'> nome.da.ferinha@gmail.com </span>
                    <Avatar
                        src=""
                        size={30}
                        className='user-avatar'
                    />
                </span>

                <SearchBar
                    onChange={(text) => {
                        this.setState({search : text})
                    }}
                    onSubmit={this.onSearchSubmit}
                />


                {/* <Player/> */}
                {/* <Slider/> */}
                <div className='row container tracks-container'>
                <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1000} transitionLeaveTimeout={700}>
                    { this.state.spotifyTracks.map((track) => <Track key={track.id} track={track} /> )}
                </ReactCSSTransitionGroup>
               
                </div>
            </div>
        );
    }
}



export default Main;