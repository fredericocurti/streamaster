import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon'

class SpotifyTrack extends Component {
    constructor(props){
        super(props)
        this.state = {
            thumbnailReady : false,
            showMenu: false
        }
    }
    
    componentWillMount() {
        this.setState({ thumbnailReady : false })
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
        this.props.onClick(this.props.track, 'search')
    }

    onMouseOver = () => {
        this.setState({ showMenu: true })
    }


    onMouseLeave = () => {
        this.setState({ showMenu: false })
    }

    render() {
        return (
            <span
                draggable
                className='col s12 track z-depth-1'
                onClick={this.onClick}
                style={{opacity : this.state.thumbnailReady ? 1 : 0}}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}
                onDragStart={(ev) => {
                    ev.target.style.opacity ='1'
                    ev.dataTransfer.setData("track", JSON.stringify(this.props.track));
                    ev.dataTransfer.setData("source", "spotify");
                    ev.dataTransfer.effectAllowed = "move";
                }}
            >
                {this.state.showMenu
                    ? <div
                        className='more-btn'
                        onClick={(ev) => {
                            ev.stopPropagation()
                            this.props.onExtraClick(this.props.track, "spotify")
                        }}
                    >
                        +
                    </div>
                    : null
                }
                <img src={this.props.track.album.images[2].url} 
                    className='track-thumbnail'
                    width={50} 
                    style={{verticalAlign : 'middle'}} 
                    alt=""
                    onLoad={() => { this.setState({thumbnailReady : true})} }
                />
                <span className='track-title' style={{ color : this.props.isCurrent ? 'purple' : 'black' }}> <b>{this.props.track.name}</b> - {this.getArtistsNames()} </span>
                   
            </span>
        )
    }
}



export default SpotifyTrack;