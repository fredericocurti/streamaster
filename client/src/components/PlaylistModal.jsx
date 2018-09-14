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
export default class PlaylistModal extends React.Component {
  constructor(props) {
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



  render() {
    const shareIcon = <FontIcon className="material-icons">share</FontIcon>
    const addIcon = <FontIcon className="material-icons">add</FontIcon>


    return (
      <div>
          <Dialog
            title={"Criar playlist"}
            modal={false}
            open={this.props.open}
            onRequestClose={this.props.onModalClose}
          >
            {this.state.step === 'choice'
              ? <div className='modal-container'>
                <img className='modal-img'></img>
                <div className='modal-buttons'>
                  
                  <a className='modal-button'
                    onClick={() => {
                      this.setState({ step: 'share' })
                    }}
                  >
                    {shareIcon}
                    Criar Playlist
                  </a>
                </div>
              </div>
              : null
            }
            The actions in this window were passed in as an array of React objects.
          </Dialog>
      </div>
    );
  }
}