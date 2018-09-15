import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon'
import placeholder from '../assets/thumb-placeholder.png'

class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      thumbnailReady: true,
      showMenu: true
    }
  }

  componentWillMount() {
    // this.setState({ thumbnailReady: false })
  }


  onClick = () => {
    // this.props.onClick(this.props.user)
    // window.open(this.props.track.external_urls.spotify,'_blank')
    // console.log(this.props.track.uri)
  }

  onMouseOver = () => {
    // this.setState({ showMenu: true })
  }


  onMouseLeave = () => {
    // this.setState({ showMenu: false })
  }

  render() {
    let {user} = this.props

    return (
      <span className='user-container col m2 l2 s6'>
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