import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class Video extends Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
    }

    getInfo = () => {
        let info = {}
        let title = this.props.info.snippet.title
        let artist = title.slice(0,title.indexOf('-'))
        let song = title.slice(title.indexOf('-') + 1 ,title.length)
        return { artist : artist , song : song }
    }

    onClick = () => {
        this.props.onClick(this.props.info)
        // console.log(this.props.info.id.videoId)
    }

    render() {
        const info = this.getInfo()
        return (
            <span onClick={this.onClick} className='col s12 track z-depth-1'>
                <img src={this.props.info.snippet.thumbnails.default.url} 
                    style={{
                        verticalAlign : 'middle', width : 'auto',
                         height : 50, maxWidth: 50
                    }} 
                    alt="" 
                />
                <span> <b>{info.artist}</b> - {info.song} </span>
            </span>
        )
    }
}



export default Video;