import React, { Component } from 'react'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class VolumeSlider extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      volume: 0
    }
  }

  handleOnChange = (value) => {
    this.setState({
      volume: value
    })
  }

  render() {
      
    let { volume } = this.state
    return (
        
      <Slider
        value={volume}
        orientation="horizontal"
        onChange={this.handleOnChange}
        
    />
    )
  }
}
export default VolumeSlider