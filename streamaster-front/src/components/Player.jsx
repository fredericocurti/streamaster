import React, { Component } from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import spotify from '../helpers/spotify';
import Slider from 'material-ui/Slider';
import {debounce} from 'lodash'
import moment from 'moment'
import ReactTooltip from 'react-tooltip'
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class Player extends Component{
    constructor(props){
      super(props)
      this.state = {
        selectedIndex : 1,
        playing : true,
        dragging : false,
        slider: 0.0,
        volume : 0.75
      } // this.slideUpdate = debounce(this.handleSlider, 500)
    }


    componentWillMount(){
      this.interval = setInterval(this.tick, 1000);
      if (this.props.info.currentSource == 'spotify') {
        spotify.play(this.props.info.currentTrack,() => {
        })
      } else if (this.props.info.currentSource == 'youtube') {
        // faz algo com a api do youtube p/ tocar

      }
    }

    componentWillReceiveProps(nextProps){
      if (this.props.info.currentSource != nextProps.info.currentSource) {
        console.log('[Player] Switched source to ' + nextProps.info.currentSource)
        this.setState({ slider : 0, playing : false })

        if (nextProps.info.currentSource == 'youtube') {
          spotify.pause()
          console.log('[Player] Current source is YouTube, pausing Spotify')
        }
  
        if (nextProps.info.currentSource == 'spotify') {
          spotify.play(nextProps.info.currentTrack, () => {
            this.setState({ slider: 0.0, playing : true })
          })
        }
      }

      if (this.props.info.currentSource == 'spotify') {
        if (this.props.info.currentTrack != nextProps.info.currentTrack) {
          console.log('[Player] Player switched songs')
          spotify.play(nextProps.info.currentTrack, () => {
            this.setState({ slider: 0.0, playing : true })
          }) 
        }
      }
     
    }

    togglePlayback = () => {
      if (this.props.info.currentSource == 'spotify') {
        if (this.state.playing) {
          spotify.pause()
        } else {
          spotify.resume()
        }
      } else if (this.props.info.currentSource == 'youtube'){
        if (this.state.playing){
          this.youtubePlayer().pauseVideo()
        } else {
          this.youtubePlayer().playVideo()
        }
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
      } else if (this.props.info.currentSource == 'youtube'){
        if (this.state.dragging == false){
          this.setState({ slider : this.youtubePlayer().getCurrentTime() })          
        }
      }
    }

    onSlide = (event, value) => {
      this.setState({ slider: value });
    };
    
    onSliderStop = () => {
      if (this.props.info.currentSource == 'spotify') {
        spotify.seek(parseInt(this.state.slider * 1000),(status) => {
          if (status == 204) {
            this.setState({ dragging : false })
          }
        })
      } else if (this.props.info.currentSource == 'youtube'){
        this.youtubePlayer().seekTo(this.state.slider)
        this.setState({ dragging : false })
      }
    }

    youtubePlayer = () => {
      return this.props.youtubePlayer
    }

    changeVolume = () => {
      if (this.props.info.currentSource == 'spotify'){
        spotify.setVolume(this.state.volume * 100)
      } else if (this.props.info.currentSource == 'youtube'){
        this.youtubePlayer().setVolume(parseInt(this.state.volume * 100))
      }
    
    }
 
    render() {
      const pauseIcon = <FontIcon className="material-icons">play_arrow</FontIcon>
      const playIcon =  <FontIcon className="material-icons">pause</FontIcon>
      const timeIcon = <FontIcon className="material-icons">schedule</FontIcon>


      const getArtistsNames = () => {
        let names = ''
        let i = 0
        if (this.props.info.currentSource == 'spotify') {
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
        } else if ( this.props.info.currentSource == 'youtube'){
          let mt = moment.utc(this.youtubePlayer().getDuration() * 1000).format('mm:ss')
          return mt
        }
      }

      const getCurrentTime = () => {
        if (this.props.info.currentSource == 'spotify'){
          let ct = moment.utc(this.state.slider * 1000).format('mm:ss')
          return ct
        } else if ( this.props.info.currentSource == 'youtube'){
          let ct = moment.utc(this.youtubePlayer().getCurrentTime() * 1000).format('mm:ss')
          return ct
        }
      }

      const getSliderMax = () => {
        if (this.props.info.currentSource == 'spotify') {
          return parseInt(this.props.info.currentTrack.duration_ms / 1000)
        } else if (this.props.info.currentSource == 'youtube') {
          return parseInt(this.youtubePlayer().getDuration())
        }
      }

      const getThumbnail = () => {
        if (this.props.info.currentSource == 'spotify') {
          return this.props.info.currentTrack.album.images[2].url
        } else if (this.props.info.currentSource == 'youtube'){
          return this.props.info.currentVideo.snippet.thumbnails.default.url
        }
      }

        return (
          <Paper zDepth={1} className='player-wrapper'>
            <BottomNavigation selectedIndex={this.state.selectedIndex}>
              
              <img className='player-thumbnail' src={getThumbnail()}/>
              
              <BottomNavigationItem
                label={getSongName()}
                icon={this.state.playing ? playIcon : pauseIcon}
                onClick={this.togglePlayback}
                style={{width: 300}}
              />
 
              <span className='player-counter'> { getCurrentTime() } </span>
              
              <Slider 
                className='player-slider'
                value={this.state.slider} 
                onChange={this.onSlide}
                onDragStart={()=> {this.setState({dragging : true})}}
                onDragStop={this.onSliderStop}
                max={getSliderMax()}
                min={0}
                step={1}
                sliderStyle={{ marginTop : 20 }}

              />

              <span className='player-counter'> { getMaxTime() } </span>

              <IconButton
                className='player-volume-icon'
                tooltipPosition='top-center'                
                tooltipStyles={{ top : -100 }}                
                tooltip={
                  <Slider 
                    style={{height: 100, paddingBottom : 20}} 
                    axis="y" 
                    value={this.state.volume}
                    onChange={(ev,val) => { this.setState({ volume : val })}}
                    onDragStop={this.changeVolume}
                    step={0.05}
                  />
                }
              >
                <FontIcon className="material-icons">
                  { this.state.volume !== 0 ? 'volume_up' : 'volume_off'} 
                </FontIcon>
              </IconButton>
              {/* 
              <BottomNavigationItem
                label={getCurrentTime() + ' | ' + getMaxTime()}
                icon={this.state.playing ? timeIcon : timeIcon}
              /> */
              }

            </BottomNavigation>
            
          </Paper>
        );
      }
    }


export default Player;