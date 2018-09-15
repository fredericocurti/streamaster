//@ts-check
import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton'
import FontIcon from 'material-ui/FontIcon'
import song from '../helpers/song';

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
      songInfo: {}
    }
  }

  componentWillMount() {
    let { info, modalSource } = this.props 

    if (modalSource === 'spotify') {
      this.songInfo = {
        track_id: null,
        source: modalSource,
        url: info.uri,
        title: info.name,
        artist: this.getSpotifyArtistsNames(info),
        thumbnail_url: info.album.images[2].url,
        thumbnail_big_url: info.album.images[1].url,
        duration_ms: info.duration_ms
      }
    } else if (modalSource === 'youtube') {
      
      let names = this.getYoutubeNames(info)
      this.songInfo = {
        track_id: null,
        source: modalSource,
        url: info.id.videoId,
        title: names.song,
        artist: names.artist,
        thumbnail_url: info.snippet.thumbnails.default.url,
        thumbnail_big_url: info.snippet.thumbnails.high.url,
        duration_ms: null
      }
    } else if (modalSource === 'soundcloud') {
      var patt = /large/i;
      let big_thumb = info.artwork_url.replace(patt, 'crop')

      this.songInfo = {
        track_id: null,
        source: modalSource,
        url: info.permalink_url,
        title: info.title,
        artist: info.user.username,
        thumbnail_url: info.artwork_url,
        thumbnail_big_url: big_thumb,
        duration_ms: info.duration
      }
    }
    
    this.setState({
      songInfo: this.songInfo
    })

  }

  getYoutubeNames(info) {
    console.log(info)
    let title = info.snippet.title.toLowerCase()
    let symIndex = title.indexOf('-')
    let artist = title.slice(0, symIndex)
    let song = title.slice(symIndex + 1, title.length)
    if (symIndex === -1) {
      return { artist: '', song: title }
    }
    return { artist: artist, song: song }
  }

  getSpotifyArtistsNames(info) {
  let names = ''
  let i = 0
  for (i; i < info.artists.length; i++) {
    if (i < info.artists.length - 1) {
      names += info.artists[i].name + ', '
    } else {
      names += info.artists[i].name
    }
  }
  return names 
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
                || this.state.step === 'add' ? `Add ${i.title + ' - ' + i.artist} to playlist` : null}
            modal={false}
            open={this.props.open}
            onRequestClose={this.props.onModalClose}
          >

          {this.state.step === 'choice'
            ? <div className='modal-container'>
                <img className='modal-img' src={i.thumbnail_big_url}></img>
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
                  ? this.props.playlists.map((p,i) => (
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
          </Dialog>
        : null
        }
      </div>
    );
  }
}