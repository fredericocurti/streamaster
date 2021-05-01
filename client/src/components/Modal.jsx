//@ts-check
import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton'
import FontIcon from 'material-ui/FontIcon'
import song, { getSongInfo } from '../helpers/song';
import PlaylistModal from './PlaylistModal';
import api from '../helpers/api.js'
import {capitalize} from 'lodash'

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
export default class Modal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      step: 'choice', // can be choice, share or add,
      songInfo: null,
      showImg: false
    }
  }

  componentWillMount() {
    let { info, modalSource } = this.props 
    
    this.setState({
      songInfo: getSongInfo(info, modalSource)
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ step: 'choice' })
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onPlaylistSelected = (playlist, playlistIndex) => {
    this.props.onSongAddedToPlaylist(this.state.songInfo, playlist, playlistIndex)
    this.props.onModalClose()
  }

  onFriendSelected = (following) => {
    console.log("following chose: ", following)
    api.sendInbox(this.props.user, following, this.state.songInfo)
    this.props.onModalClose()
  }
 
  
  render() {

  
    const shareIcon = <FontIcon className="material-icons">share</FontIcon>
    const addIcon = <FontIcon className="material-icons">add</FontIcon>


    let i = this.state.songInfo // parsed info

    return (
      <div>
        {i.source
        ?
          <Dialog
            title={
              this.state.step === 'choice' ? i.title + ' - ' + i.artist : null 
                || this.state.step === 'add' ? `Add ${i.title + ' - ' + i.artist} to playlist` : null
                || this.state.step === 'share' ? `Share ${i.title + ' - ' + i.artist} with` : null}
            modal={false}
            open={this.props.open}
            onRequestClose={this.props.onModalClose}
          >

          {this.state.step === 'choice'
            ? <div className='modal-container'>
                <img className='modal-img' style={{opacity: this.state.showImg ? 1 : 0}} src={i.thumbnail_big_url} onLoad={() => {
                  this.setState({showImg: true})
                }}></img>
                <div className='modal-buttons'>
                  <a className='modal-button'
                    onClick={() => {
                      this.setState({step: 'add'})
                    }}>
                    {addIcon}
                    Add to Playlist
                  </a>
                  <a className='modal-button'
                    onClick={() => {
                      this.setState({ step: 'share' })
                    }}
                  >                 
                    {shareIcon}
                    Share with Friend
                  </a>
                </div>
            </div>
            : null
          }

          {this.state.step === 'add'
            ? <div className='modal-container-2' style={{flexDirection: 'column'}}>
                {this.props.playlists 
                  ? this.props.playlists
                    .filter((el) => el.user_id === this.props.user.user_id ? true : false)
                    .map((p,i) => (
                    <div>    
                    <RaisedButton
                      className='add-playlist-btn'
                      style={{margin: 5}}
                      onClick={() => {
                        this.onPlaylistSelected(p, i)
                      }}
                      key={'p' + i}
                    > {p.name} </RaisedButton>
                    </div>
                    ))
                  : null
              }
              {/* <img src={i.thumbnailUrl}> </img> */}
            </div>
            : null
          }
          {this.state.step === 'share'
            ? <div className='modal-container-3' style={{flexDirection: 'column'}}>
                {this.props.playlists 
                  ? this.props.following.map((f,i) => (
                    <div>    
                    <RaisedButton
                      className='share-friend-btn'
                      style={{margin: 5}}
                      onClick={() => {
                        this.onFriendSelected(f)
                      }}
                      key={'f' + i}> {f.username} </RaisedButton>
                    </div>
                    ))
                  : null
              }
              {/* <img src={i.thumbnailUrl}> </img> */}
            </div>
            : null
          }
          </Dialog>
        : null
        }
      </div>
    );
  }
}