import React, { Component } from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import spotify from '../helpers/spotify';
import Slider from 'material-ui/Slider';
import {debounce} from 'lodash'
import moment from 'moment'
require("moment-duration-format");


class Player extends Component{
    constructor(props){
      super(props)
      this.state = {
        selectedIndex : 1,
        playing : true,
        dragging : false,
        slider: 0.0
      } // this.slideUpdate = debounce(this.handleSlider, 500)
    }


    componentWillMount(){
      this.interval = setInterval(this.tick, 1000);
      if (this.props.info.currentSource == 'spotify') {
        spotify.play(this.props.info.currentTrack)
        this.setState({slider: 0.0})
      } else if (this.props.info.currentSource == 'youtube') {
        // faz algo com a api do youtube p/ tocar 
      }
    }

    componentWillReceiveProps(nextProps){
      if (this.props.info.currentTrack != nextProps.info.currentTrack) {
        spotify.play(nextProps.info.currentTrack)
        this.setState({slider: 0.0 })
      }
    }

    togglePlayback = () => {
      if (this.state.playing && this.props.info.currentSource == 'spotify'){
        spotify.pause()        
      } else if (this.props.info.currentSource == 'spotify') {
        spotify.resume()
      }
      this.setState({ playing : !this.state.playing })
    }

    
    tick = () => {
      if (this.props.info.currentSource == 'spotify') {
        if (this.state.playing == true 
            && this.state.dragging == false
            && this.state.slider <= this.props.info.currentTrack.duration_ms/1000 - 1) {
          let current = this.state.slider + 1
          this.setState({ slider: current });
        }
      }
    }

    
    
    onSlide = (event, value) => {
      this.setState({ slider: value });
    };
    
    onSliderStop = () => {
      spotify.seek(parseInt(this.state.slider * 1000),(status) => {
        if (status == 204){
          this.setState({ dragging : false })
        }
      })
    }

    render() {
      const pauseIcon = <FontIcon className="material-icons">play_arrow</FontIcon>
      const playIcon =  <FontIcon className="material-icons">pause</FontIcon>
      const timeIcon = <FontIcon className="material-icons">schedule</FontIcon>

      const getArtistsNames = () => {
        let names = ''
        let i = 0
        if (this.props.info.currentSource == 'spotify'){
          for (i ; i < this.props.info.currentTrack.artists.length ; i ++){
            if ( i < this.props.info.currentTrack.artists.length - 1 ){
                names += this.props.info.currentTrack.artists[i].name + ', '
            } else {
                names += this.props.info.currentTrack.artists[i].name
            }
        }
        return names
        }
      }  
      const getSongName = () => {
        if (this.props.info.currentSource == 'spotify') {
          return this.props.info.currentTrack.name
        } else if (this.props.info.currentSource == 'youtube') {
          return this.props.info.currentVideo.snippet.title
        }
      }

      const getMaxTime = () => {
        if (this.props.info.currentSource == 'spotify'){
          let mt = moment.utc(this.props.info.currentTrack.duration_ms).format('mm:ss')
          return mt
        }
      }

      const getCurrentTime = () => {
        if (this.props.info.currentSource == 'spotify'){
          let ct = moment.utc(this.state.slider * 1000).format('mm:ss')
          return ct
        }
      }

      const getSliderMax = () => {
        if (this.props.info.currentSource == 'spotify') {
          return parseInt(this.props.info.currentTrack.duration_ms / 1000)
        }
      }


      const styles = {
        root: {
          width: 1200
        },
      };

        return (
          <Paper zDepth={1} className='player-wrapper'>
            <BottomNavigation selectedIndex={this.state.selectedIndex} style={styles.root}>
              
              <img className='player-thumbnail' src={this.props.info.currentTrack.album.images[2].url} width={50}/>
              
              <BottomNavigationItem
                label={getSongName()}
                icon={this.state.playing ? playIcon : pauseIcon}
                onClick={this.togglePlayback}
              />
              
              <Slider 
                style={{width: '50%'}} 
                value={this.state.slider} 
                onChange={this.onSlide}
                onDragStart={()=> {this.setState({dragging : true})}}
                onDragStop={this.onSliderStop}
                max={getSliderMax()}
                min={0}
                step={1}

              />

              

              <BottomNavigationItem
              label={getCurrentTime() + ' | ' + getMaxTime()}
              icon={this.state.playing ? timeIcon : timeIcon}
              />
            </BottomNavigation>
            
          </Paper>
        );
      }
    }


export default Player;