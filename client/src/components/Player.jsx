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
import ReactPlayer from 'react-player'

class Player extends Component{
    constructor(props){
      super(props)
      this.state = {
        selectedIndex : 1,
        playing : true,
        dragging : false,
        slider: 0.0,
        volume : 0.75,
        scPlayerReady : false,
        scPlaying : false
      } // this.slideUpdate = debounce(this.handleSlider, 500)


    }
    componentWillMount(){
      this.interval = setInterval(this.tick, 1000);
      if (this.props.info.currentSource === 'spotify') {
        spotify.play(this.props.info.currentTrack, () => {
        })
      } else if (this.props.info.currentSource === 'youtube') {
        spotify.pause()
      } else if (this.props.info.currentSource === 'soundcloud') {
        spotify.pause()
      }

      this.scPlayer = {
        getCurrentTime: () => 0,
        seekTo: () => 0,
        getDuration: () => 0
      }

    }

    componentDidMount(){
      console.log(this.reactPlayer)
      this.marquee.setAttribute('scrollamount', '5')
    }

    componentWillReceiveProps(nextProps){
      if (this.props.info.currentSource != nextProps.info.currentSource) {
        console.log('[Player] Switched source to ' + nextProps.info.currentSource)
        this.setState({ slider : 0, playing : false, volume: new Number(this.state.volume).valueOf() }, () => {
          this.changeVolume()
        })

        if (nextProps.info.currentSource === 'youtube') {
          this.setState({ slider : 0.0, playing : true })                    
          spotify.pause()
          console.log('[Player] Current source is YouTube, pausing Spotify')
        }
  
        if (nextProps.info.currentSource === 'spotify') {
          spotify.play(nextProps.info.currentTrack, () => {
            this.setState({ slider: 0.0, playing : true })
          })
        }

        if (nextProps.info.currentSource === 'soundcloud'){
          this.setState({ slider : 0.0, playing : true })          
          spotify.pause()
        }
      }

      if (this.props.info.currentSource === 'spotify') {
        if (this.props.info.currentTrack != nextProps.info.currentTrack) {
          console.log('[Player] Player switched songs')
          spotify.play(nextProps.info.currentTrack, () => {
            this.setState({ slider: 0.0, playing : true })
          }) 
        }
      } else if (this.props.info.currentSource === 'soundcloud'){
        if (this.props.info.currentSoundcloudTrack != nextProps.info.currentSoundcloudTrack){
          this.setState({ slider: 0.0, playing : true, scPlaying : false })          
        }
      }
    }

    togglePlayback = () => {
      if (this.props.info.currentSource === 'spotify') {
        if (this.state.playing) {
          spotify.pause()
        } else {
          spotify.resume()
        }
      } else if (this.props.info.currentSource === 'youtube'){
        if (this.state.playing){
          this.youtubePlayer().pauseVideo()
        } else {
          this.youtubePlayer().playVideo()
        }
      }
      this.setState({ playing : !this.state.playing })
    }
    
    tick = () => {
      if (this.props.info.currentSource === 'spotify') {
        if (this.state.playing === true 
            && this.state.dragging === false
            && (this.state.slider <= this.props.info.currentTrack.duration_ms/1000 - 1) ) {
          let current = this.state.slider + 1
          this.setState({ slider: current });
        }
      } else if (this.props.info.currentSource === 'youtube'){
        if (this.state.dragging === false){
          this.setState({ slider : this.youtubePlayer().getCurrentTime() })
        }
      } else if (this.props.info.currentSource === 'soundcloud'){
        if (this.state.dragging === false) {
          this.setState({ slider : parseInt(this.scPlayer.getCurrentTime()) || 0 })
      }
    }
    if (this.state.slider >= this.getSliderMax() && this.props.info.currentSource === 'spotify') {
        this.props.onTrackFinish()        
    }
  }

    onSlide = (event, value) => {
      this.setState({ slider: value });
    };
    
    onSliderStop = () => {
      if (this.props.info.currentSource === 'spotify') {
        spotify.seek(parseInt(this.state.slider * 1000),(status) => {
          if (status === 204) {
            this.setState({ dragging : false })
          }
        })
      } else if (this.props.info.currentSource === 'youtube'){
        this.youtubePlayer().seekTo(this.state.slider)
        this.setState({ dragging : false })
      } else if (this.props.info.currentSource === 'soundcloud'){
        this.scPlayer.seekTo(this.state.slider)
        this.setState({ dragging : false })        
      }
    }

    youtubePlayer = () => {
      return this.props.youtubePlayer
    }

    changeVolume = () => {
      if (this.props.info.currentSource === 'spotify'){
        spotify.setVolume(this.state.volume * 100)
      } else if (this.props.info.currentSource === 'youtube'){
        this.youtubePlayer().setVolume(parseInt(this.state.volume * 100))
      }    
    }

    getSliderMax = () => {
      if (this.props.info.currentSource === 'spotify') {
        return parseInt(this.props.info.currentTrack.duration_ms / 1000)
      } else if (this.props.info.currentSource === 'youtube') {
        return parseInt(this.youtubePlayer().getDuration())
      } else if (this.props.info.currentSource === 'soundcloud') {
        return parseInt(this.props.info.currentSoundcloudTrack.duration_ms / 1000 || this.props.info.currentSoundcloudTrack.duration / 1000)
      }
    }
 
    render() {
      const pauseIcon = <FontIcon className="material-icons">play_arrow</FontIcon>
      const playIcon =  <FontIcon className="material-icons">pause</FontIcon>
      const timeIcon = <FontIcon className="material-icons">schedule</FontIcon>

      const getArtistsNames = () => {
        let names = ''
        let i = 0
        if (this.props.info.currentSource === 'spotify') {
          if (this.props.info.currentTrack.artist) {
            return this.props.info.currentTrack.artist
          }
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
        if (this.props.info.currentSource === 'spotify') {
          return (this.props.info.currentTrack.title || this.props.info.currentTrack.name)
        } else if (this.props.info.currentSource === 'youtube') {
          return this.props.info.currentVideo.title || this.props.info.currentVideo.snippet.title
        } else if (this.props.info.currentSource === 'soundcloud') {
          return this.props.info.currentSoundcloudTrack.title
        }
      }

      const getMaxTime = () => {
        let mt = ""
        if (this.props.info.currentSource === 'spotify'){
          mt = moment.utc(this.props.info.currentTrack.duration_ms).format('mm:ss')          
        } else if ( this.props.info.currentSource === 'youtube'){
          mt = moment.utc(this.youtubePlayer().getDuration() * 1000).format('mm:ss')          
        } else if ( this.props.info.currentSource === 'soundcloud'){
          let dur = this.scPlayer ? this.scPlayer.getDuration() : 0
          mt = moment.utc(dur * 1000).format('mm:ss')          
        }
        return mt
      }

      const getCurrentTime = () => {
        let ct = "" 
        if (this.props.info.currentSource === 'spotify'){
          ct = moment.utc(this.state.slider * 1000).format('mm:ss')          
        } else if ( this.props.info.currentSource === 'youtube'){
          ct = moment.utc(this.youtubePlayer().getCurrentTime() * 1000).format('mm:ss')          
        } else if (this.props.info.currentSource === 'soundcloud'){
          ct = moment.utc(this.state.slider * 1000).format('mm:ss')          
        }
        return ct
      }

      const getThumbnail = () => {
        if (this.props.info.currentSource === 'spotify') {
          return this.props.info.currentTrack.thumbnail_url || this.props.info.currentTrack.album.images[2].url
        } else if (this.props.info.currentSource === 'youtube'){
          return this.props.info.currentVideo.thumbnail_url || this.props.info.currentVideo.snippet.thumbnails.default.url
        } else if (this.props.info.currentSource === 'soundcloud'){
          return this.props.info.currentSoundcloudTrack.thumbnail_url || this.props.info.currentSoundcloudTrack.artwork_url
        }
      }

        return (
          <Paper zDepth={1} className='player-wrapper'>
            <BottomNavigation className='bottom-nav' selectedIndex={this.state.selectedIndex}>              
              <img className='player-thumbnail' src={getThumbnail()}/>              
              <BottomNavigationItem
                label={
                  <marquee 
                    ref={(marquee) => {this.marquee = marquee}}
                    direction='left'
                  > 
                    <span 
                      ref={(el) => {
                        if (el) {
                          let color = this.props.info.currentSource === 'spotify' ? 'lightgreen' : null
                            || this.props.info.currentSource === 'soundcloud' ? 'orange' : null
                            || this.props.info.currentSource === 'youtube' ? 'red' : null
                      el.style.setProperty('color', color, 'important');
                    }
                  }}
                    > ● </span>
                    {getSongName()} - {getArtistsNames()}
                  </marquee>}
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
                max={this.getSliderMax()}
                min={0}
                step={1}
                sliderStyle={{ marginTop : 20, color:'purple'}}

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
                    onChange={(ev, val) => { this.setState({ volume : val })}}
                    onDragStop={this.changeVolume}
                    step={0.05}
                  />
                }
              >
                <FontIcon className="material-icons">
                  { this.state.volume !== 0 ? 'volume_up' : 'volume_off'} 
                </FontIcon>
              </IconButton>
            </BottomNavigation>
            
              <ReactPlayer
                style={{ display: 'none' }}
                url={
                  this.props.info.currentSource === 'soundcloud' 
                    ? (this.props.info.currentSoundcloudTrack.url || this.props.info.currentSoundcloudTrack.permalink_url) 
                    : null 
                  }
                playing={this.props.info.currentSource === 'soundcloud' ? this.state.playing : false}
                volume={this.state.volume}
                preload
                config={{soundcloud: {auto_play: true, autoPlay: true}}}
                ref={(ReactPlayer) => { this.scPlayer = ReactPlayer }}
                onReady={() => {
                  console.log('ready')
                  if (this.scPlayer) {
                    const prevVolume = new Number(this.state.volume)                    
                    this.setState({ volume: 0 }, () => {
                      this.setState({ volume: prevVolume.valueOf() })
                    })
                  }
                }}
                onEnded={() => {
                  console.log('Soundcloud stopped playing - ended')
                  this.props.onTrackFinish()
                }}
                onPause={() => {
                  if(this.state.playing){                    
                    try {
                      document.getElementsByClassName("visualAudible__artworkOverlay g-transition-opacity")[0].click()                      
                    } catch (error) {
                    }
                  }
                }}
              />                        
          </Paper>
        );
      }
    }


export default Player;