import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class Video extends Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        console.log(this.props)
    }

    getInfo = () => {
        let info = {}
        let title = this.props.info.snippet.title
        let artist = title.slice(0,title.indexOf('-'))
        let song = title.slice(title.indexOf('-') + 1 ,title.length)
        return { artist : artist , song : song }
    }

    render() {
        const info = this.getInfo()
        return (
            <span className='col s12 track z-depth-1'>
                <img src={this.props.info.snippet.thumbnails.default.url} 
                    width={50} 
                    style={{verticalAlign : 'middle'}} 
                    alt="" 
                />
                <span> <b>{info.artist}</b> - {info.song} </span>
            </span>
        )
    }
}



export default Video;