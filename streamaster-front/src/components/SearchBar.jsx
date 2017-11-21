import React, { Component } from 'react';
import {TextField, Card} from 'material-ui'

class SearchBar extends Component {
    constructor(props){
        super(props)
        this.state = {
            used : false
        }
    }

    onSearchChange = (e) => {
        this.props.onChange(e.target.value)
        if (!this.state.user) {
            setTimeout(() => this.setState({  used : true }),750)
        }
    } 

    render() {
        return (
            <div className='row'>
                <div className='search-wrapper center' 
                 style={{
                    transition : 'transform 1s ease',
                    maxWidth : '100%',                    
                    transform : this.state.used ? null : `translate(0,${this.state.used ? 0 : 325}px) scale(${this.state.used ? 1 : 1.5})`
                 }}
                >
                    <Card 
                        style={{
                            marginTop: 50,
                            maxWidth : 400,
                            padding: '5px 10px',
                            position: 'fixed',
                        }}
                        className='z-depth-5'
                    >
                        <TextField
                            hintText='Search any song or artist...'
                            className='search-bar'
                            underlineFocusStyle={{ borderColor: 'purple' }}
                            onChange={this.onSearchChange}
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    this.setState({ used : true })
                                    this.props.onSubmit()
                                    ev.preventDefault()
                                }
                            }}
                        />
                    </Card>
                </div>
            </div>
            
        );
    }
}


export default SearchBar;