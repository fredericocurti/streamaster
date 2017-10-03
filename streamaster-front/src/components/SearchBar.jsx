import React, { Component } from 'react';
import {TextField, Card} from 'material-ui'

class SearchBar extends Component {
    constructor(props){
        super(props)
    }

    onSearchChange = (e) => {
        this.props.onChange(e.target.value)
    } 

    render() {
        return (
            <div className='row'>
                <div className='search-wrapper center'>
                    <Card 
                        style={{marginTop: 50, maxWidth : 400, padding: '5px 10px', position: 'fixed'}}
                        className='z-depth-5'
                    >
                        <TextField
                            hintText='Search...'
                            className='search-bar'
                            underlineFocusStyle={{ borderColor: 'purple' }}
                            onChange={this.onSearchChange}
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
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