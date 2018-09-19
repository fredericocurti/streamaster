import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon'
import placeholder from '../assets/thumb-placeholder.png'
import api from '../helpers/api';

class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      thumbnailReady: true,
      showMenu: true,
      isClicked: props.isClicked || false,
      playlists: []
    }
  }

  componentWillMount() {
    // this.setState({ thumbnailReady: false })
    api.getUserPlaylists(this.props.user)
    .then(res => {
      this.setState({
          playlists: res
      })
    }) 
  }


  onClick = () => {
    // this.props.onClick(this.props.user)
    // window.open(this.props.track.external_urls.spotify,'_blank')
    // console.log(this.props.track.uri)
    if (!this.props.isStatic) {
      this.setState({ isClicked: !this.state.isClicked })
    }
    
    if (this.props.onClick) {
      this.props.onClick(this.props.user, this.props.i)
    }
  }

  onFollowClick = (e) => {
    e.stopPropagation()
    this.props.onFollowClick(this.props.auth, this.props.user)
  }

  onPlaylistClick = (playlist) => {
    this.props.onPlaylistClick(playlist)
  }

  onMouseOver = () => {
    // this.setState({ showMenu: true })
  }


  onMouseLeave = () => {
    // this.setState({ showMenu: false })
  }

  render() {
    let {user, isStatic} = this.props
    let {isClicked} = this.state
    let isFollowing = this.props.following.filter((u) => u.user_id === user.user_id ).length > 0 ? true : false 
// col m2 l2 s6
    return (
      <span
        className={`user-container ${isClicked ? 'expanded' : 'default'} ${isStatic ? 'static' : null}`} 
        onClick={() => {
          this.onClick()
        }}
      >
        <div className='user-info-small'>
            <span className='user-badge'>
              <img
                src={placeholder}
                className='user-thumbnail'
                width={64}
                height={64}
                style={{ verticalAlign: 'middle' }}
                alt=""
                onLoad={() => { this.setState({ thumbnailReady: true }) }}
              />
            </span>

            <span className='user-name'>
              {user.username}
            </span>
          {isClicked
            ? <FlatButton
              label={isFollowing ? "Following" : "Follow"}
              secondary={true}
              style={{marginTop: 30}}
              icon={<FontIcon className="material-icons">visibility</FontIcon>}
              onClick={this.onFollowClick}
              style={{color: isFollowing ? 'lightgreen' : 'purple', marginTop: 20}}
            />
            : null
          }


        </div>
        
        {this.state.isClicked 
          ? <div className='user-playlists-container'>
            <div>
              <FlatButton
                label={"Playlists"}
                secondary={true}
                icon={<FontIcon className="material-icons" />}
              />
            </div>
            {this.state.playlists.filter((e) => e.user_id === this.props.user.user_id ? true : false).map((p) => {
              let isFollowed = this.props.playlists.filter((el) => {
                return el.playlist_id === p.playlist_id ? true : false
              })
              isFollowed = isFollowed.length !== 0 ? true : false
          
              return (<div
                onClick={(e) => {
                  e.stopPropagation()
                  isFollowing ? this.onPlaylistClick(p) : void(0)
                }}
                className='playlist-user-item'
              >
                {p.name} {isFollowed ? '✔️' : ''}
              </div>)
            })
              
            }
        </div>
        : null
        }

      </span>
      // <span
      //   className='col s12 track z-depth-1 user'
      //   onClick={this.onClick}
      //   style={{ opacity: this.state.thumbnailReady ? 1 : 0 }}
      //   onMouseOver={this.onMouseOver}
      //   onMouseLeave={this.onMouseLeave}
      // >
      //   {this.state.showMenu
      //     ? <div
      //       className='more-btn'
      //       onClick={() => {
      //         this.props.onExtraClick(this.props.track, "spotify")
      //       }}
      //     >
      //       +
      //               </div>
      //     : null
      //   }
      //   <img
      //     src=''
      //     className='track-thumbnail'
      //     width={50}
      //     style={{ verticalAlign: 'middle' }}
      //     alt=""
      //     onLoad={() => { this.setState({ thumbnailReady: true }) }}
      //   />
      //   <span className='track-title' style={{ color: 'black' }}> {this.props.user.email} </span>
      // </span>
    )
  }
}



export default User;