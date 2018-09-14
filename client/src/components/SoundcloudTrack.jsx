import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class SoundcloudTrack extends Component {
    constructor(props){
        super(props)
        this.state = {
            thumbnailReady : false
        }
    }
    
    componentWillMount() {
        this.setState({ thumbnailReady : false })
    }

    componentDidMount(){
        if (this.props.track.artwork_url == null){
            setTimeout(() => {
                this.setState({ thumbnailReady : true })                
            },500)
        }
    }
    
    onClick = () => {
        this.props.onClick(this.props.track)
        // window.open(this.props.track.external_urls.spotify,'_blank')
        // console.log(this.props.track.uri)
    }

    render() {
        return (
            <span 
                className='col s12 track z-depth-1'
                onClick={this.onClick}
                style={{opacity : this.state.thumbnailReady ? 1 : 0}}
            >
                <img src={this.props.track.artwork_url || 'https://png.icons8.com/?id=21619&size=280'} 
                    width={50} 
                    style={{verticalAlign : 'middle'}} 
                    alt=""
                    onLoad={() => { this.setState({thumbnailReady : true})} }
                />
                <span style={{ color : this.props.isCurrent ? 'purple' : 'black' }}> <b>{this.props.track.title}</b>  </span>
            </span>
        )
    }
}



export default SoundcloudTrack;