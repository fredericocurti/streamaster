import React, { Component } from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import spotify from '../helpers/spotify';
import Slider from 'material-ui/Slider';
class Player extends Component{
    constructor(props){
      super(props)
      this.state = {
        selectedIndex : 1,
        playing : true,
        slider: 0.0
      }

      setInterval(this.timeTest, 1000);
    }

    timeTest = () => {
      if (this.state.playing == true){
        let total= this.props.info.currentTrack.duration_ms
        let current = this.state.slider + 1000/total

        this.setState({slider: current });
      }
    }

    componentWillMount(){
      if (this.props.info.currentSource == 'spotify') {
        spotify.play(this.props.info.currentTrack)
        this.setState({slider: 0.0})
      } else if (this.props.info.currentSource == 'youtube') {
        // faz algo com a api do youtube p/ tocar 
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

    componentWillReceiveProps(nextProps){
      if (this.props.info.currentTrack != nextProps.info.currentTrack){
        spotify.play(nextProps.info.currentTrack)
        this.setState({slider: 0.0 })
      }
    }

    handleFirstSlider = (event, value) => {
      this.setState({slider: value});
      spotify.seek(parseInt(value*this.props.info.currentTrack.duration_ms))
    };

    

    render() {
      const pauseIcon = <FontIcon className="material-icons">play_arrow</FontIcon>
      const playIcon =  <FontIcon className="material-icons">pause</FontIcon>
      const timeIcon = <FontIcon className="material-icons">schedule</FontIcon>

      
      const getSongName = () => {
        if (this.props.info.currentSource == 'spotify') {
          return this.props.info.currentTrack.name
        } else if (this.props.info.currentSource == 'youtube') {
          return this.props.info.currentVideo.snippet.title
        }
      }
      const getMaxTime = () => {
        if (this.props.info.currentSource == 'spotify'){
          return (parseInt(this.props.info.currentTrack.duration_ms/60000).toString()+":"+parseInt((this.props.info.currentTrack.duration_ms%60000)/1000).toString())
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
              <BottomNavigationItem
                label={this.state.playing ? 'Tocando' : 'Pausado'}
                icon={this.state.playing ? playIcon : pauseIcon}
                onClick={this.togglePlayback}
              />
              <BottomNavigationItem
              label={getSongName()}
              icon={this.state.playing ? playIcon : pauseIcon}
              />
              
              <Slider style={{width: 1200}} value={this.state.slider} onChange={this.handleFirstSlider} />
              <BottomNavigationItem
              label={getMaxTime()}
              icon={this.state.playing ? timeIcon : timeIcon}
              />
            </BottomNavigation>
            
          </Paper>
        );
      }
    }


export default Player;