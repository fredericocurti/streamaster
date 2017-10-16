import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class Track extends Component {
    constructor(props){
        super(props)
    }

    getArtistsNames = () => {
        let names = ''
        let i = 0
        for (i ; i < this.props.track.artists.length ; i ++){
            if ( i < this.props.track.artists.length - 1 ){
                names += this.props.track.artists[i].name + ', '
            } else {
                names += this.props.track.artists[i].name
            }
        }
        return names
    }

    onClick = () => {
        this.props.onClick(this.props.track)
        // window.open(this.props.track.external_urls.spotify,'_blank')
        // console.log(this.props.track.uri)
    }

    render() {
        return (
            <span className='col s12 track z-depth-1' onClick={this.onClick}>
                <img src={this.props.track.album.images[2].url} 
                    width={50} 
                    style={{verticalAlign : 'middle'}} 
                    alt="" 
                />
                <span> <b>{this.props.track.name}</b> - {this.getArtistsNames()} </span>
            </span>
        )
    }
}



export default Track;