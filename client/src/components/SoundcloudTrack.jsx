import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import placeholder from '../assets/thumb-placeholder.png'

class SoundcloudTrack extends Component {
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

    componentDidMount(){
        if (this.props.track.artwork_url == null){
            setTimeout(() => {
                this.setState({ thumbnailReady : true })                
            },500)
        }
    }
    
    onClick = () => {
        this.props.onClick(this.props.track, 'search')
        // window.open(this.props.track.external_urls.spotify,'_blank')
        // console.log(this.props.track.uri)
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
                className='col s12 track z-depth-1'
                onClick={this.onClick}
                style={{opacity : this.state.thumbnailReady ? 1 : 0}}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}
            >
                {this.state.showMenu
                    ? <div
                        className='more-btn'
                        onClick={() => {
                            this.props.onExtraClick(this.props.track, "soundcloud")
                        }}
                    >
                        +
                    </div>
                    : null
                }
                <img src={this.props.track.artwork_url || placeholder} 
                    width={50} 
                    style={{verticalAlign : 'middle'}} 
                    alt=""
                    onLoad={() => { this.setState({thumbnailReady : true})} }
                />
                <span style={{ color: this.props.isCurrent ? 'purple' : 'black', paddingLeft: 5 }}> <b>{this.props.track.title}</b> - {this.props.track.user.username} </span>
            </span>
        )
    }
}



export default SoundcloudTrack;