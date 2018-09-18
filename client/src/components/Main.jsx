import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import '../css/main.css'
import favicon from '../assets/favicon.png'

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
import User from './User'

import Dialog from 'material-ui/Dialog'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import TreeView from 'react-treeview'
import ReactTooltip from 'react-tooltip'
import spotify from '../helpers/spotify.js'
import youtube from '../helpers/youtube.js'
import soundcloud from '../helpers/soundcloud'
import auth from '../helpers/auth.js'
import api from '../helpers/api.js'

import spotifyLogo from '../assets/spotify-logo.png'
import PlaylistModal from './PlaylistModal';


// const playlists = JSON.parse(window.localStorage.getItem('playlists')) || [{
//         name: 'sup',
//         songs: []
//     },{
//         name: 'fucku',
//         songs: [{
//             title: 'aaemusica',
//             artist: 'joji'
//     },
//     {
//         title: 'aaemusica2',
//         artist: 'joji'
//     },
//     ]
// }]

// const users = [{
//         user_id: 2,
//         email: 'teste@teste.com',
//         username: 'jose',
//         thumbnail_url: null
//     },{
//         user_id: 2,
//         email: 'teste@teste.com',
//         username: 'batatacosta',
//         thumbnail_url: null
//     },{
//         user_id: 2,
//         email: 'teste@teste.com',
//         username: 'fred',
//         thumbnail_url: null
//     }
// ]

// for (let i = 0; i < 10; i++) {
//     playlists[0].songs.push({
//         title: 'aaemusica' + i,
//         artist: 'joji'
//     })
// }


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
            userResults :[], //variable for user results in search bar
            following: [],
            followers: [],
            selectedFriend: null,
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
            modalInfo: null,
            drawerOpen: false,
            creatingPlaylist: false,
            playlists: [],
            followingPlaylists: [],
            inbox: [],
            isEmpty: true,
            playlistIndex: -1,
            users: null,
            songIndex: -1
        }
    }

    componentWillMount() {
        let user = auth.getSavedUser()
        if (user) {
            this.onLogin(user)
            this.setState({auth: user})
            // Se ta logado pega os follows
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
        console.log("state mudou")
    }

    onLogin = (user) => {
        console.log("USER LOGGED IN", user)
        if (user) {
            this.setState({ auth: user, open: false })
            api.getUserFollow(user)
                .then(res => {
                    console.log('GET FOLLOW:', res)
                    this.setState({ following: res.following, followers: res.followers })
                })

            api.getUserPlaylists(user)
                .then((res) => {
                    this.setState({ playlists: res })
                    console.log('PLAYLISTS', res)
                })
            api.getUserInbox(user)
                .then((res) => {
                    this.setState({ inbox: res })
                    console.log('INBOX', res)                    
                })                                
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

            this.onSearchUsers(this.state.search)

            this.setState({lastSearch : this.state.search})
        }
    }

    // get all users
    getUsers = async () => {
        let result = await auth.getUsers()
        this.setState({users: result})
    }

    onSearchUsers = async(info) => {
        let result = await api.searchUser(info)
        this.setState({ userResults: result })
    }

    onSearchChange = (text) => {
        this.setState({search : text})
        this.delayedSearch()        
    }

    onYoutubeClick = (video, origin) => {
        this.setState({ currentVideo : video , youtubePicked : true })
        if (origin && origin === 'search'){
            this.setState({ playlistIndex: -1, songIndex: -1 })
        }
    }

    onSpotifyClick = (track, origin) => {
        this.setState({
            currentTrack : track ,
            currentSource : 'spotify',
            youtubePicked : false
        })
        if (origin && origin === 'search') {
            this.setState({ playlistIndex: -1, songIndex: -1 })
        }
    }
 
    onSoundcloudClick = (track, origin) => {
        this.setState({
            currentSoundcloudTrack : track, 
            currentSource : 'soundcloud', 
            youtubePicked : false 
        })
        if (origin && origin === 'search') {
            this.setState({ playlistIndex: -1, songIndex: -1 })
        }
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
        this.setState({modalOpen: false, modalSource: null})
    }

    handleDrawer = () => this.setState({ drawerOpen: !this.state.drawerOpen });

    onCreatePlaylist = async () => {
        let result = await api.createNewPlaylist(this.state.auth)
        console.log("onCreatePlaylist results: ")
        console.log(result.playlist_id)
        this.setState({
            playlists: [{
                playlist_id: result.playlist_id,
                user_id: this.state.auth.user_id,
                name: 'New Playlist',
                songs: [],
                isPublic: 1,
            },
            ...this.state.playlists]
        })
    }

    onPlaylistNameChanged = (playlist, newName) => {
        // FILL WITH API
        console.log('renaming playlist', playlist, 'to', newName)
        api.playlistNameChange(playlist, newName)
        let p = [...this.state.playlists]
        p[p.indexOf(playlist)].name = newName
        this.setState({ playlists: p })
        // window.localStorage.setItem('playlists', JSON.stringify(this.state.playlists))
    }

    onPlaylistModalClose = () => {
        this.setState({
            creatingPlaylist: false
        })
    }

    onPlaylistDelete = (playlist, index) => {
        console.log('SALVE')
        console.log(playlist, index)
        // FILL WITH API
        console.log('deleting playlist', playlist[index])
        api.deletePlaylist(playlist[index])
        // window.localStorage.setItem('playlists', JSON.stringify(this.state.playlist))
    }

    onTrackFinish = () => {
        let { playlists, playlistIndex, songIndex } = this.state
        console.log("Track has finished playing!")
        if (playlistIndex === -1 || songIndex === -1) {
            return
        }

        let nextTrack = playlists[playlistIndex].songs[songIndex + 1]
        if (nextTrack) {
            this.onPlaylistPlay(playlists[playlistIndex], songIndex + 1, playlistIndex)
        } else {
            this.onPlaylistPlay(playlists[playlistIndex], 0, playlistIndex)
        }
    }

    // Ao tocar track da playlist
    onPlaylistPlay = (playlist, songIndex, playlistIndex) => {
        console.log('playling', playlist, 'track', songIndex)
        let media = {...playlist.songs[songIndex]}
        console.log(media)

        if (media.source === 'spotify') {
            this.setState({
                currentSource: media.source,
                currentTrack: media,
                youtubePicked: false
            })
        } else if (media.source === 'youtube') {
            this.onYoutubeClick(media)
        } else if (media.source === 'soundcloud') {
            this.onSoundcloudClick(media)
        }

        this.setState({
            playlistIndex: playlistIndex,
            songIndex: songIndex
        })
    }

    onSongDelete = (playlist, song) => {
       console.log("deleting song" , song, 'on playlist', playlist)
       api.deleteSong(song, playlist)
        // API CALL 
    }

    onSongAddedToPlaylist = async (song, playlist, playlistIndex) => {
        console.log('added song',song, 'to playlist', playlist, 'index', playlistIndex)
        // API CALL TO STORE
        let res = await api.insertSongOnPlaylist(song, playlist)
        console.log(res.track_id)
        let p = [...this.state.playlists]
        p[playlistIndex].songs.push({
            ...song,
            track_id: res.track_id
        })
        this.setState({playlists: p})
        // })
    }

    onFriendClick = (friend, index) => {
        this.setState({
            selectedFriend: friend    
        })
    }

    onUserClick = (user, userIndex) => {
        // setTimeout(() => {
        //     let r = [...this.state.userResults]
        //     let si = userIndex
        //     if (si !== 0) {
        //         let temp = r[0]
        //         r[0] = user
        //         r[r.length] = temp
        //     }

        //     this.setState({
        //         userResults: r
        //     })    
        // }, 50);
    }

    getUsernameForUserId(user_id) {
        if (this.state.following.length > 0 || this.state.followers.length > 0) {
            let f = this.state.followers.find((u) => {
                return u.user_id === user_id ? true : false
            })
            let f2 = this.state.followers.find((u) => {
                return u.user_id === user_id ? true : false
            })
            // console.log(f ? f.username : null || f2 ? f2.username : null)
            return (f ? f.username : null || f2 ? f2.username : null)
        } else {
            return null
        }   
    }

    onPlaylistClick = (playlist) => {
        let i = this.state.playlists.findIndex((e) => e.playlist_id === playlist.playlist_id)
        console.log(i)
        if (i === -1) {
            this.setState({playlists: [...this.state.playlists, playlist], drawerOpen: true })
            api.followPlaylist(playlist, this.state.auth)
        } else {
            console.log('ja tem essa fera, tirando')
            api.unfollowPlaylist(playlist, this.state.auth)
            let p = this.state.playlists.filter((el,ind) => i !== ind ? true : false)
            this.setState({playlists: p})
        }
            // this.setState({playlists: this.state.playlists.filter((e) => e.playlist_id !== playlist.playlist_id)})
        // }
    }

    onFollowClick = (me, user) => {
        let follows = this.state.following.find((el) => { if (el.user_id === user.user_id) return true })
        if (!follows) { // Nao segue ainda
            this.setState({ following: [...this.state.following, user] })
            api.followUser(me, user)
        } else {
            this.setState({ following: [...this.state.following].filter((u) => u.user_id !== user.user_id )})
            api.unfollowUser(me, user)
        }
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
                return this.state.currentVideo.url || this.state.currentVideo.id.videoId
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

        let { soundcloudResults, youtubeResults, spotifyResults } = this.state
        let isempty = true
        if (soundcloudResults.length === 0 && youtubeResults.length === 0 && spotifyResults.length === 0) {
            isempty = true
        } else {
            isempty = false
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
                        onSongAddedToPlaylist={this.onSongAddedToPlaylist}
                        user={this.state.auth}
                        following={this.state.following}
                    />
                    : null
                }

                { this.state.creatingPlaylist 
                ? <PlaylistModal open={this.state.creatingPlaylist} onModalClose={this.onPlaylistModalClose}></PlaylistModal>
                : null
                }

                <div>

                    <Drawer width={350} open={this.state.drawerOpen} >
                        <div className='playlist-title-bar'> 
                            <span style={{cursor: 'pointer'}} onClick={() => {
                                this.handleDrawer()
                            }}> X </span>
                            Playlists 
                        </div>
                        <FlatButton className='add-playlist-btn' onClick={this.onCreatePlaylist}> Create playlist + </FlatButton>
                        { this.state.playlists.length > 0
                            ?   this.state.playlists.map((p, playlistIndex) => {
                                    const type = p.title;
                                    const isMine = p.user_id === this.state.auth.user_id
                                    const label = (
                                        <span>
                                            <span
                                                onKeyPress={(e) => {
                                                    if (e.key == 'Enter') {
                                                        e.preventDefault()
                                                        let nt = e.nativeEvent.target
                                                        nt.blur()
                                                        this.onPlaylistNameChanged(p, nt.innerText)
                                                    }
                                                }}
                                                className="node"
                                                onClick={() => {
                                                    this.onPlaylistPlay(p, 0, playlistIndex)
                                                }}
                                                contentEditable={p.name == 'New Playlist' ? true : false}
                                            >
                                                {p.name} 
                                                <span style={{color: 'lightgray'}}>
                                                    {p.user_id !== this.state.auth.user_id ? ' by ' + this.getUsernameForUserId(p.user_id) : null}
                                                </span>
                                            </span>

                                            {isMine 
                                                ?   <span className='playlist-delete-btn' onClick={() => {
                                                        this.onPlaylistDelete(this.state.playlists, playlistIndex)
                                                        let p = [...this.state.playlists]
                                                        p.splice(playlistIndex, 1)
                                                        this.setState({ playlists: p })
                                                    }}>
                                                        ✖️
                                                    </span>
                                                :   null
                                            }
                                        </span>

                                    )
                                    if (this.state.playlists.length > 0) {
                                        return (
                                            <TreeView key={type + '|' + playlistIndex} nodeLabel={label} defaultCollapsed={true}>
                                                {p.songs.map((song, si) => {
                                                    const label2 = <span className="node">{song.title}</span>;
                                                    return (
                                                        <div className="info" onClick={() => {
                                                            this.onPlaylistPlay(p, si, playlistIndex)
                                                        }}>
                                                            <span className='playlist-song-name' style={{ fontWeight: this.state.playlistIndex === playlistIndex && this.state.songIndex === si ? 'bold' : null }}>
                                                                {this.state.playlistIndex === playlistIndex && this.state.songIndex === si
                                                                    ? <span className='pointer' style={{
                                                                        color:
                                                                            song.source === 'spotify' ? 'lightgreen' : null
                                                                                || song.source === 'soundcloud' ? 'orange' : null
                                                                                    || song.source === 'youtube' ? 'red' : null
                                                                    }}>▶</span>
                                                                    : <span className='rotating-ball' style={{
                                                                        color:
                                                                            song.source === 'spotify' ? 'lightgreen' : null
                                                                                || song.source === 'soundcloud' ? 'orange' : null
                                                                                    || song.source === 'youtube' ? 'red' : null
                                                                    }}> ● </span>
                                                                }
                                                                {' '} {song.title} - {song.artist}
                                                            </span>
                                                            {isMine
                                                            ?<span className='song-delete-btn' onClick={() => {
                                                                let p = [...this.state.playlists]
                                                                this.onSongDelete(p[playlistIndex], song)
                                                                p[playlistIndex].songs.splice(si, 1)
                                                                this.setState({ playlists: p })
                                                            }}> ✖️
                                                            </span>
                                                            : null
                                                            }
                                                        </div>

                                                    );
                                                })}
                                            </TreeView>
                                        );
                                    } else {
                                        return null
                                    }
                                    
                                })
                        : null
                        }
                        <div className='drawer-content'> 
                        </div>                 
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
                                onEnd={() => {
                                    this.onTrackFinish()
                                }}
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
                        <IconButton data-tip data-for='inbox' style={{ background: 'white', borderRadius: 50, marginRight: 15 }} onClick={this.handleDrawer}>
                            <FontIcon className="material-icons"> inbox </FontIcon>
                        </IconButton>
                        <IconButton style={{background: 'white', borderRadius: 50}} onClick={this.handleDrawer} tooltip={'Playlists'}>
                            <FontIcon className="material-icons"> list </FontIcon>
                        </IconButton>

                        {/* <a data-tip data-for='sadFace'> இдஇ </a> */}
 
                        <ReactTooltip delayHide={100} className='tooltip-class' place='bottom' id='sadFace' type='light' effect='solid'>
                            <div className='hoverable-container'>
                                <div className='friend-cat'>
                                    Following
                                    {this.state.following.map((el,i) => <div key={'friend'+el.user_id} className='friend-item' onClick={() => {
                                        this.onFriendClick(el, i)
                                    }}> {el.username} </div>)}
                                </div>
                                
                                <div className='friend-cat'>
                                    Followers
                                    {this.state.followers.map((el, i) => <div key={'friend2' + el.user_id} className='friend-item' 
                                        onClick={() => {
                                            this.onFriendClick(el, i)
                                        }}
                                    > {el.username} </div>)}
                                </div>

                            </div>
                        </ReactTooltip>

                        <ReactTooltip delayHide={100} className='tooltip-class' place='bottom' id='inbox' type='light' effect='solid'>
                            <div className='hoverable-container'>
                                <div className='friend-cat'>
                                    Received
                                    {/* {this.state.inbox.map((message,i) => 
                                        <div 
                                            key={'message'+message.user_id} 
                                            className='friend-item' 
                                            onClick={() => {
                                                // this.onFriendClick(el, i)
                                            }}
                                        >
                                                {message.username}
                                        </div>
                                    )} */}
                                </div>
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
                    isEmpty={isempty}
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

                {/*  USER SEARCH RESULTS  */}
                {/* {this.state.userResults.length > 0 */}
                    <div
                        className={`row container top-container ${this.state.userResults.length > 0 ? 'show' : 'hidden'}`} 
                        style={{
                            transform: `translate(${this.state.drawerOpen ? 150 : 0}px, ${0}px)`,
                            display: 'flex',
                            opacity: this.state.userResults.length > 0 ? 1 : 0
                        }}
                    >
                        <div className='streamaster-badge'>
                            <img src={favicon} width={60} height={60}></img>
                            Streamaster
                        </div>
                        <div className='row users-container'>
                            {this.state.userResults.length > 0 // Alterei nesta linha para map com this.state.users
                                ? this.state.userResults.map((user, index) => {
                                    return <User key={user.user_id} onPlaylistClick={this.onPlaylistClick} onFollowClick={this.onFollowClick} i={index} onClick={this.onUserClick} user={user} {...this.state} ></User>
                                })
                                : null
                            }
                        </div>

                    </div>
                
                
                
                <Dialog 
                    open={this.state.selectedFriend}
                    onRequestClose={() => {
                        this.setState({ selectedFriend: null })
                    }}
                >
                    <User isClicked isStatic onPlaylistClick={this.onPlaylistClick} onFollowClick={this.onFollowClick} onClick={this.onUserClick} user={this.state.selectedFriend ? this.state.selectedFriend : null} {...this.state} ></User>
                </Dialog>
                
                

    
                {/* <Slider/> */}
                { this.state.lastSearch !== '' 
                    ? <div className='row container tracks-container' style={{ 
                        transform: `translate(${this.state.drawerOpen ? 150 : 0}px, ${0}px)`,
                        // marginLeft: this.state.drawerOpen ? 30 : null
                    }}
                    >
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
                            { this.state.youtubeResults.map((video) => <Video key={video.id.videoId} isCurrent={isCurrent(video)}  info={video} onClick={this.onYoutubeClick} onExtraClick={this.onExtraClick}/> )}
                        {/* </ReactCSSTransitionGroup>  */}
                        </div>

                        <div className='col s12 m4 tracks-col'>
                            <img src='https://vignette.wikia.nocookie.net/edm/images/6/6c/SoundCloud_logo_small.png/revision/latest?cb=20160709121011'
                                width={200}
                                style={{margin:'7.5px 0 0 0', transition: 'opacity 0.5s ease', opacity: this.state.soundcloudResults.length == 0 ? 0 : 1}}
                            />
                            { this.state.soundcloudResults.map((track) => <SoundcloudTrack key={track.id} isCurrent={isCurrent(track)}  track={track} onClick={this.onSoundcloudClick} onExtraClick={this.onExtraClick}/> )}
                        </div>
                        
                    </div>
                :   null    
                }
                    
                            

                { this.state.currentSource !== ''
                ? <Player onTrackFinish={this.onTrackFinish} info={this.state} youtubePlayer={this.state.youtubePlayer}/>
                : null
                }
                
            </div>
        );
    }
}



export default Main;