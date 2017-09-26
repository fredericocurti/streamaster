import React, { Component } from 'react'
import { Avatar } from 'material-ui'
import '../css/main.css'

import SearchBar from './SearchBar'
import Slider from './Slider'

class Main extends Component {
    constructor(props) {
        super(props);

    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                <span className='user-info valign-wrapper'>
                    <span className='user-email'> nome.da.ferinha@gmail.com </span>
                    <Avatar
                        src=""
                        size={30}
                        className='user-avatar'
                    />
                </span>

                <SearchBar/>
                {/* <Player/> */}
                <Slider/>
            </div>
        );
    }
}



export default Main;