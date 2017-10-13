import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import YouTube from 'react-youtube'

import { Avatar,Card } from 'material-ui'
import '../css/main.css'
import SearchBar from './SearchBar'
import Slider from './Slider'
import Track from './Track'
import Video from './Video'
import Player from './Player'

import spotify from '../helpers/spotify.js'
import youtube from '../helpers/youtube.js'

import spotifyLogo from '../assets/spotify-logo.png'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search : '',
            lastSearch : '',
            spotifyResults : [],
            youtubeResults : [],
            currentSource : '',
            currentVideo : null, 
            currentTrack : null,
            youtubePlayer : null
        }
    }

    componentWillMount() {
        spotify.authenticate((status) => {
            console.log('Auth status : ' + status)
        })
    }

    componentDidMount(){
        console.log(this.youtubePlayer)
        this.setState({ youtubePlayer : this.youtubePlayer })
    }

    onSearchSubmit = () => {
        if (this.state.search != this.state.lastSearch && this.state.search != '') {

            spotify.searchTracks(this.state.search,(songs) => {
                console.log(songs.tracks.items)
                this.setState({ spotifyResults : songs.tracks.items })
            })
            
            youtube.searchVideos(this.state.search,(videos) => {
                console.log(videos)
                this.setState({ youtubeResults : videos.items })
            })
            this.setState({lastSearch : this.state.search})
        }
    }

    onYoutubeClick = (video) => {
        this.setState({currentVideo : video , currentSource : 'youtube'})
    }

    onSpotifyClick = (track) => {
        this.setState({currentTrack : track , currentSource : 'spotify'})
    }
 
    onYouTubeStateChange = (event) => {
        console.log(event.target)
    }

    onYouTubeReady = (event) => {
        // O objeto this.state.youtubePlayer só irá existir
        console.log('youtube ready')
        this.setState({youtubePlayer : event.target})
    }

    render() {
        const opts = {
            height: '210',
            width: '210',
            playerVars: { // https://developers.google.com/youtube/player_parameters
              autoplay: 1
            }
        }

        const getVideoId = () => {
            if (this.state.currentVideo){
                return this.state.currentVideo.id.videoId
            } else {
                return ''
            }
        }


        return (
            <div>
                { this.state.currentSource === 'youtube'
                ?   <Draggable
                        axis="both"
                        handle=".handle"
                        defaultPosition={{x: window.innerWidth - 250, y: window.innerHeight - 300}}
                        position={null}
                        grid={[25, 25]}
                        bounds='parent'
                    >
                        <Card>
                            <div className='handle'> Drag me pls </div>
                            <YouTube 
                                videoId={getVideoId()}
                                opts={opts}
                                onStateChange={this.onYouTubeStateChange}
                                ref={(YouTube) => { this.youtubePlayer = YouTube }}
                                onReady={this.onYouTubeReady}
                            />                            
                        </Card>
                    </Draggable>
                :  null
                }

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
                
                
                {/* <Slider/> */}
                { this.state.lastSearch !== '' 
                ?   <div className='row container tracks-container'>
                        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1000} transitionLeaveTimeout={700}>
                            <img src={spotifyLogo} width={200}/>
                            { this.state.spotifyResults.map((track) => <Track key={track.id} track={track} onClick={this.onSpotifyClick} /> )}

                            <div className='divider'/>
                            <img src='https://www.youtube.com/yt/about/media/images/brand-resources/logos/YouTube-logo-full_color_light.svg'
                                width={200}
                                style={{margin:15}}
                            />
                            { this.state.youtubeResults.map((video) => <Video key={video.id.videoId} info={video} onClick={this.onYoutubeClick}/> )}
                        </ReactCSSTransitionGroup>          
                    </div>
                :   null    
                }

                { this.state.currentSource !== ''
                ? <Player info={this.state} />
                : null
                }
                
            </div>
        );
    }
}



export default Main;