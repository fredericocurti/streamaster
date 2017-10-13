import React, { Component } from 'react'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon'
import player from '../helpers/player'

class Player extends Component{
    constructor(props){
      super(props)
      this.state = {
        selectedIndex : 1,
        playing : true
      }
      
    }

    togglePlayback = () => {
      if (this.state.playing && this.props.info.currentSource == 'spotify'){
        player.play(this.props.info.currentTrack)
      } else if (this.props.info.currentSource == 'spotify') {
        player.pause()
      }
      this.setState({ playing : !this.state.playing })
    }

    componentWillReceiveProps(nextProps){
      console.log(nextProps)
    }

    render() {
      const pauseIcon = <FontIcon className="material-icons">play_arrow</FontIcon>
      const playIcon =  <FontIcon className="material-icons">pause</FontIcon>

      const getSongName = () => {
        if (this.props.info.currentSource == 'spotify'){
          return this.props.info.currentTrack.name
        } else if (this.props.info.currentSource == 'youtube'){
          return this.props.info.currentVideo.snippet.title
        }
      }

        return (
          <Paper zDepth={1} className='player-wrapper'>
            <BottomNavigation selectedIndex={this.state.selectedIndex}>
              <BottomNavigationItem
                label={this.state.playing ? 'Tocando' : 'Pausado'}
                icon={this.state.playing ? playIcon : pauseIcon}
                onClick={this.togglePlayback}
              />
              <BottomNavigationItem
                label={getSongName()}
                icon={this.state.playing ? playIcon : pauseIcon}
              />
            </BottomNavigation>
          </Paper>
        );
      }
    }


export default Player;