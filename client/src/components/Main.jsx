import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import '../css/main.css'

import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import YouTube from 'react-youtube'
import { debounce } from 'lodash'

import { Avatar,Card,FlatButton,Popover,Menu,MenuItem,Divider,CircularProgress,AppBar, FloatingActionButton } from 'material-ui'
import SearchBar from './SearchBar'
import Slider from './Slider'
import Track from './Track'
import SoundcloudTrack from './SoundcloudTrack'
import Video from './Video'
import Player from './Player'
import Login from './Login'
import Modal from './Modal'

import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import TreeView from 'react-treeview'
import ReactTooltip from 'react-tooltip'
import spotify from '../helpers/spotify.js'
import youtube from '../helpers/youtube.js'
import soundcloud from '../helpers/soundcloud'
import auth from '../helpers/auth.js'

import spotifyLogo from '../assets/spotify-logo.png'
import PlaylistModal from './PlaylistModal';


const playlists = [{
        name: 'sup',
        songs: []
    },{
        name: 'fucku',
        songs: [{
            title: 'aaemusica',
            artist: 'joji'
    },
    {
        title: 'aaemusica2',
        artist: 'joji'
    },
    ]
}]

for (let i = 0; i < 10; i++) {
    playlists[0].songs.push({
        title: 'aaemusica' + i,
        artist: 'joji'
    })
}


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
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
            spotifyReady: false,
            modalOpen: false,
            modalMedia: {},
            modalSource: null,
            modalInfo: {},
            drawerOpen: false,
            creatingPlaylist: false,
            playlists: playlists
        }
    }

    componentWillMount() {
        let user = auth.getSavedUser()
        if (user) {
            this.setState({auth: user})
        } else {
            console.log("There is no user saved")
        }

        spotify.authenticate((status) => {
            console.log('Auth status : ' + status)
            if (status == 'OK'){
                this.setState({ spotifyReady : true })
            }
        })
        auth.unsubscribe()
        
        console.log("AE", this.props)
    }

    componentDidMount(){
        this.delayedSearch = debounce(this.onSearchSubmit, 750)        
        this.setState({ youtubePlayer : this.youtubePlayer })
    }

    componentWillReceiveProps(nextProps) {
    }

    onLogin = (user) => {
        console.log("USER LOGGED IN", user)
        if (user) {
            this.setState({ auth: user, open: false })
        }
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
            anchorEl: event.currentTarget,
        }, () => {
            this.setState({open: true})
        })
    }

    handleRequestClose = () => {
        this.setState({
            open : false
        })
    }

    onExtraClick = (info, source) => {
        console.log(info)
        this.setState({modalOpen: true, modalSource: source, modalInfo: info})
    } 

    onModalClose = () => {
        this.setState({modalOpen: false})
    }

    handleDrawer = () => this.setState({ drawerOpen: !this.state.drawerOpen });

    onCreatePlaylist = () => {
        this.setState({
            playlists: [{
                name: 'New Playlist',
                songs: []
            },
            ...this.state.playlists]
        })
        
    }

    onPlaylistNameChanged = (playlist, newName) => {
        // FILL WITH API
        console.log('renaming playlist', playlist, 'to', newName)
    }

    onPlaylistModalClose = () => {
        this.setState({
            creatingPlaylist: false
        })
    }

    onPlaylistDelete = (playlists, index) => {
        // FILL WITH API
        console.log('deleting playlist', playlists)
    }

    onSongDelete = (playlist, song) => {
       console.log("deleting song" , song, 'on playlist', playlist)
        // API CALL
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
                { this.state.modalSource !== null 
                    ? <Modal 
                        info={this.state.modalInfo} 
                        open={this.state.modalOpen} 
                        onModalClose={this.onModalClose} 
                        modalSource={this.state.modalSource}
                        playlists={this.state.playlists}
                    />
                    : null
                }

                { this.state.creatingPlaylist 
                ? <PlaylistModal open={this.state.creatingPlaylist} onModalClose={this.onPlaylistModalClose}></PlaylistModal>
                : null
                }

                <div>

                    <Drawer width={250} open={this.state.drawerOpen} >
                        <div className='playlist-title-bar'> 
                            <span style={{cursor: 'pointer'}} onClick={() => {
                                this.handleDrawer()
                            }}> X </span>
                            Playlists 
                        </div>
                        <FlatButton className='add-playlist-btn' onClick={this.onCreatePlaylist}> Create playlist + </FlatButton>                    

                        {this.state.playlists.map((playlist, i) => {
                            const type = playlist.title;
                            const label = (
                                <span>
                                    <span
                                        onKeyPress={(e) => {
                                            if (e.key == 'Enter') {
                                                e.preventDefault()
                                                let p = [...this.state.playlists]
                                                let nt = e.nativeEvent.target
                                                p[i].name = nt.innerText
                                                this.setState({ playlists: p })
                                                nt.blur()
                                                this.onPlaylistNameChanged(playlist, nt.innerText)
                                            }
                                        }}
                                        className="node"
                                        contentEditable={playlist.name == 'New Playlist' ? true : false}
                                    >
                                        {playlist.name}
                                    </span>
                                    
                                    <span className='playlist-delete-btn' onClick={() => {
                                        let p = [...this.state.playlists]
                                        p.splice(i, 1)
                                        this.onPlaylistDelete(playlist, i)
                                        this.setState({ playlists: p })
                                    }}> 
                                        ✖️ 
                                    </span>
                                </span>
                    
                            )
                            return (
                                <TreeView key={type + '|' + i} nodeLabel={label} defaultCollapsed={true}>
                                    {playlist.songs.map((song,si) => {
                                        const label2 = <span className="node">{song.title}</span>;
                                        return (
                                            <div className="info">
                                                {song.title} - {song.artist}
                                                <span className='song-delete-btn' onClick={() => {
                                                    let p = [...this.state.playlists]
                                                    this.onSongDelete(playlist, song)
                                                    p[i].songs.splice(si, 1)
                                                    this.setState({ playlists: p })
                                                }}> ✖️
                                                </span>
                                            </div>

                                        );
                                    })}
                                </TreeView>
                            );
                        })}
                    </Drawer>
                </div>


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

                { this.state.auth
                    ? <span className='user-info'>
                        <IconButton data-tip data-for='sadFace' style={{ background: 'white', borderRadius: 50, marginRight: 15 }} onClick={this.handleDrawer}>
                            <FontIcon className="material-icons"> tag_faces </FontIcon>
                        </IconButton>
                        <IconButton data-tip data-for='sadFace' style={{ background: 'white', borderRadius: 50, marginRight: 15 }} onClick={this.handleDrawer}>
                            <FontIcon className="material-icons"> inbox </FontIcon>
                        </IconButton>
                        <IconButton style={{background: 'white', borderRadius: 50}} onClick={this.handleDrawer} tooltip={'Playlists'}>
                            <FontIcon className="material-icons"> list </FontIcon>
                        </IconButton>

                        {/* <a data-tip data-for='sadFace'> இдஇ </a> */}

                        <ReactTooltip html={true} place='bottom' id='sadFace' type='dark' effect='solid'>
                            <div className='hoverable-container'>
                                Oiii
                            </div>
                        </ReactTooltip>

                        <span className='user-email'> {auth.getUser().userName} </span>
                        <Avatar
                            src={auth.getUser().image}
                            size={50}
                            className='user-avatar'
                            onClick={this.handleTouchTap}
                        />
                        <Popover
                            open={this.state.open}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
                            onRequestClose={this.handleRequestClose}
                        >
                            <Menu>
                                <MenuItem
                                    disabled
                                    primaryText={<div style={{ fontSize: 14 }}>{this.state.auth.email}</div>} />
                                <Divider />
                                <MenuItem primaryText="Sair" onClick={auth.logout} />
                            </Menu>
                        </Popover>
                    </span>
                    : <span className='user-info valign-wrapper' style={{position: this.state.auth ? 'fixed' : 'absolute'}}>
                        <a className='user-email login-btn' onClick={this.handleTouchTap}> LOGIN </a>
                        <Popover
                            open={this.state.open}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                            onRequestClose={this.handleRequestClose}
                        >
                            <Login onLogin={this.onLogin}/>
                        </Popover>
                    </span>
                }
               

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
                        
                            <img src={spotifyLogo} width={150} style={{margin:5, transition: 'opacity 0.5s ease', opacity: this.state.spotifyResults.length == 0 ? 0 : 1}}/>
                            {/* <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1000} transitionLeaveTimeout={700}> */}
                            { this.state.spotifyResults.map((track) => <Track isCurrent={isCurrent(track)} key={track.id} track={track} onClick={this.onSpotifyClick} onExtraClick={this.onExtraClick}/> )}
                            {/* </ReactCSSTransitionGroup> */}
                        </div>
                        {/* <div className='divider'/> */}
                        <div className='col s12 m4 tracks-col'>
                            <img src='https://www.youtube.com/yt/about/media/images/brand-resources/logos/YouTube-logo-full_color_light.svg'
                                width={150}
                                style={{margin:15, transition: 'opacity 0.5s ease', opacity: this.state.youtubeResults.length == 0 ? 0 : 1}}
                            />
                        {/* <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1000} transitionLeaveTimeout={700}> */}
                            { this.state.youtubeResults.map((video) => <Video key={video.id.videoId} isCurrent={isCurrent(video)}  info={video} onClick={this.onYoutubeClick}/> )}
                        {/* </ReactCSSTransitionGroup>  */}
                        </div>

                        <div className='col s12 m4 tracks-col'>
                            <img src='https://vignette.wikia.nocookie.net/edm/images/6/6c/SoundCloud_logo_small.png/revision/latest?cb=20160709121011'
                                width={200}
                                style={{margin:'7.5px 0 0 0', transition: 'opacity 0.5s ease', opacity: this.state.soundcloudResults.length == 0 ? 0 : 1}}
                            />
                            { this.state.soundcloudResults.map((track) => <SoundcloudTrack key={track.id} isCurrent={isCurrent(track)}  track={track} onClick={this.onSoundcloudClick}/> )}
                        </div>
                        
                    </div>
                :   null    
                }
                    
                
                <div className='row container tracks-container'>
                    <div className='col s6 m4 tracks-col'>
                        <img src='https://www.youtube.com/yt/about/media/images/brand-resources/logos/YouTube-logo-full_color_light.svg'
                            width={150}
                            style={{ margin: 15, transition: 'opacity 0.5s ease', opacity: this.state.youtubeResults.length == 0 ? 0 : 1 }}
                        />
                        {/* <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1000} transitionLeaveTimeout={700}> */}
                        {this.state.youtubeResults.map((video) => <Video key={video.id.videoId} isCurrent={isCurrent(video)} info={video} onClick={this.onYoutubeClick} />)}
                        {/* </ReactCSSTransitionGroup>  */}
                    </div>
                </div>
                

                { this.state.currentSource !== ''
                ? <Player info={this.state} youtubePlayer={this.state.youtubePlayer}/>
                : null
                }
                
            </div>
        );
    }
}



export default Main;