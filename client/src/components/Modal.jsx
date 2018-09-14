import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton'
import FontIcon from 'material-ui/FontIcon'

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
      step: 'choice' // can be choice, share or add
    }
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

  onPlaylistSelected = (p) => {
    console.log(p)
    this.props.onModalClose()
  }
 
  
  render() {
    let { info, modalSource } = this.props 

    const getSpotifyArtistsNames = () => {
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
    
    const pi = () => {
      if (modalSource == 'spotify') {
        return {
          title: info.name,
          artist: getSpotifyArtistsNames(),
          source: modalSource,
          thumbnailUrl: info.album.images[1].url,
          duration: info.duration_ms
        }
      } else if (modalSource == 'youtube') {
        return 
      } else if (modalSource == 'soundcloud') {
        return 
      }
    }

    const shareIcon = <FontIcon className="material-icons">share</FontIcon>
    const addIcon = <FontIcon className="material-icons">add</FontIcon>


    let i = pi() // parsed info

    return (
      <div>
        {modalSource 
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
                <img className='modal-img' src={i.thumbnailUrl}></img>
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
                        this.onPlaylistSelected(p)
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