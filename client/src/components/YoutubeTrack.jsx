import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class YoutubeTrack extends Component {
    constructor(props){
        super(props)
        this.state = {
            thumbnailReady : false,
            showMenu: false
        }
    }

    componentWillMount(){
        this.setState({ thumbnailReady : false })
    }

    getInfo = () => {
        let info = {}
        let title = this.props.info.snippet.title.toLowerCase()
        let artist = title.slice(0,title.indexOf('-'))
        let song = title.slice(title.indexOf('-') + 1 ,title.length)
        return { artist : artist , song : song }
    }

    onClick = () => {
        this.props.onClick(this.props.info, 'search')
        // console.log(this.props.info.id.videoId)
    }

    onMouseOver = () => {
        this.setState({ showMenu: true })
    }

    onMouseLeave = () => {
        this.setState({ showMenu: false })
    }

    render() {
        const info = this.getInfo()
        return (
            <span 
                onClick={this.onClick} 
                className='col s12 track z-depth-1' 
                style={{opacity : this.state.thumbnailReady ? 1 : 0}}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}
                draggable
                onDragStart={(ev) => {
                    ev.dataTransfer.setData("track", JSON.stringify(this.props.info));
                    ev.dataTransfer.setData("source", "youtube");

                    ev.dataTransfer.effectAllowed = "move";
                }}
            >
                {this.state.showMenu
                    ? <div
                        className='more-btn'
                        onClick={() => {
                            this.props.onExtraClick({...this.props.info}, "youtube")
                        }}
                    >
                        +
                    </div>
                    : null
                }

                <img src={this.props.info.snippet.thumbnails.default.url} 
                    style={{
                        verticalAlign : 'middle', width : 'auto',
                         height : 50, maxWidth: 50
                    }}
                    onLoad={() => { this.setState({thumbnailReady : true})} }
                    alt="" 
                />
                <span style={{ color: this.props.isCurrent ? 'purple' : 'black', paddingLeft: 5 }}> <b>{info.song}</b> - {info.artist}</span>
            </span>
        )
    }
}



export default YoutubeTrack;