import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import '../css/main.css'

import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import YouTube from 'react-youtube'
import { debounce } from 'lodash'

import { Avatar,Card,FlatButton,Popover,Menu,MenuItem,Divider,CircularProgress } from 'material-ui'
import SearchBar from './SearchBar'
import Slider from './Slider'
import Track from './Track'
import SoundcloudTrack from './SoundcloudTrack'
import Video from './Video'
import Player from './Player'

import spotify from '../helpers/spotify.js'
import youtube from '../helpers/youtube.js'
import soundcloud from '../helpers/soundcloud'
import auth from '../helpers/auth.js'

import spotifyLogo from '../assets/spotify-logo.png'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search : '',
            lastSearch : '',
            spotifyResults : [],
            youtubeResults : [],
            soundcloudResults : [],
            currentSource : '',
            currentVideo : null, 
            currentTrack : null,
            youtubePlayer : null,
            youtubePicked : false,
            open: false,
            anchorEl: null,
            spotifyReady: false
        }
    }

    componentWillMount() {
        spotify.authenticate((status) => {
            console.log('Auth status : ' + status)
            if (status == 'OK'){
                this.setState({ spotifyReady : true })
            }
        })
        auth.unsubscribe()
    }

    componentDidMount(){
        this.delayedSearch = debounce(this.onSearchSubmit,750)        
        this.setState({ youtubePlayer : this.youtubePlayer })
    }

    onSearchSubmit = () => {
        if (this.state.search != this.state.lastSearch && this.state.search != '') {

            spotify.searchTracks(this.state.search,(songs) => {
                this.setState({ spotifyResults : songs.tracks.items })
            })
            
            youtube.searchVideos(this.state.search,(videos) => {
                this.setState({ youtubeResults : videos.items })
            })

            soundcloud.searchTracks(this.state.search,(songs) => {
                this.setState({ soundcloudResults : songs })
            })

            this.setState({lastSearch : this.state.search})
        }
    }

    onSearchChange = (text) => {
        this.setState({search : text})
        this.delayedSearch()        
    }

    onYoutubeClick = (video) => {
        this.setState({ currentVideo : video , youtubePicked : true })
    }

    onSpotifyClick = (track) => {
        this.setState({
            currentTrack : track ,
            currentSource : 'spotify',
            youtubePicked : false
        })
    }
 
    onSoundcloudClick = (track) => {
        this.setState({
            currentSoundcloudTrack : track, 
            currentSource : 'soundcloud', 
            youtubePicked : false 
        })
    }

    onYouTubeStateChange = (event) => {
    }

    onYouTubeReady = (event) => {
        // O objeto this.state.youtubePlayer só irá existir        
        event.target.a.style.pointerEvents = 'none'
        this.setState({ currentSource : 'youtube' , youtubePlayer : event.target })
    }
    
    handleTouchTap = (event) => {
        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        })
    }

    handleRequestClose = () => {
        this.setState({
            open : false
        })
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

        const isCurrent = (media) => {
            if (this.state.currentSource == 'spotify') {
                if (media == this.state.currentTrack) {
                    return true
                } else {
                    return false
                }
            } else if ( this.state.currentSource == 'youtube') {
                if (media == this.state.currentVideo){
                    return true
                } else {
                    return false
                }
            } else if ( this.state.currentSource == 'soundcloud') {
                if (media == this.state.currentSoundcloudTrack){
                    return true
                } else {
                    return false
                }
            }
        }

        return (
            <div>
                { this.state.youtubePicked === true
                ?   <Draggable
                        axis="both"
                        handle=".handle"
                        defaultPosition={{x: window.innerWidth - 250, y: window.innerHeight - 300}}
                        position={null}
                        grid={[25, 50]}
                        bounds='parent'
                    >
                        
                        <Card>
                            <div
                                className='youtube-overlay handle'
                            >
                            <YouTube
                                videoId={getVideoId()}
                                opts={opts}
                                onStateChange={this.onYouTubeStateChange}
                                ref={(YouTube) => { this.youtubePlayer = YouTube }}
                                onReady={this.onYouTubeReady}
                            />
                            </div>         
                        </Card>
                    </Draggable>
                :  null
                }

                {/* <span className='user-info valign-wrapper'>
                    <span className='user-email'> { auth.getUser().userName } </span>
                    <Avatar
                        src={ auth.getUser().image }
                        size={50}
                        className='user-avatar'
                        onClick={this.handleTouchTap}
                    />
                    <Popover
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'middle', vertical: 'top'}}
                        onRequestClose={this.handleRequestClose}
                    >
                        <Menu>
                            <MenuItem 
                                disabled 
                                primaryText={ <div style={{fontSize: 14}}>{auth.getUser().email}</div> }/>
                            <Divider/>
                            <MenuItem primaryText="Sair" onClick={auth.logout}/>
                        </Menu>
                    </Popover>                            
                </span> */}

               

                { this.state.spotifyReady 
                ? <SearchBar
                    onChange={this.onSearchChange}
                    onSubmit={this.onSearchSubmit}
                />
                : <div                    
                    style={{
                        position: 'fixed',
                        top : window.innerHeight/2 - 60,
                        left : window.innerWidth/2 - 60
                    }}
                >
                    <CircularProgress 
                        size={60}
                        color='purple'
                    />
                </div>
                
                }

                
                
                {/* <Slider/> */}
                { this.state.lastSearch !== '' 
                ?   <div className='row container tracks-container'>
                        <div className='col s12 m4 tracks-col'>
                        
                            <img src={spotifyLogo} width={150} style={{margin:5}}/>
                            {/* <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1000} transitionLeaveTimeout={700}> */}
                            { this.state.spotifyResults.map((track) => <Track isCurrent={isCurrent(track)} key={track.id} track={track} onClick={this.onSpotifyClick} /> )}
                            {/* </ReactCSSTransitionGroup> */}
                        </div>
                        {/* <div className='divider'/> */}
                        <div className='col s12 m4 tracks-col'>
                            <img src='https://www.youtube.com/yt/about/media/images/brand-resources/logos/YouTube-logo-full_color_light.svg'
                                width={150}
                                style={{margin:15}}
                            />
                        {/* <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1000} transitionLeaveTimeout={700}> */}
                            { this.state.youtubeResults.map((video) => <Video key={video.id.videoId} isCurrent={isCurrent(video)}  info={video} onClick={this.onYoutubeClick}/> )}
                        {/* </ReactCSSTransitionGroup>  */}
                        </div>

                        <div className='col s12 m4 tracks-col'>
                            <img src='https://vignette.wikia.nocookie.net/edm/images/6/6c/SoundCloud_logo_small.png/revision/latest?cb=20160709121011'
                                width={200}
                                style={{margin:'7.5px 0 0 0'}}
                            />
                            { this.state.soundcloudResults.map((track) => <SoundcloudTrack key={track.id} isCurrent={isCurrent(track)}  track={track} onClick={this.onSoundcloudClick}/> )}
                        </div>
                        
                    </div>
                :   null    
                }

                { this.state.currentSource !== ''
                ? <Player info={this.state} youtubePlayer={this.state.youtubePlayer}/>
                : null
                }
                
            </div>
        );
    }
}



export default Main;