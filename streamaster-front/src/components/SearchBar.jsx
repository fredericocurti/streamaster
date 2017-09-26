import React, { Component } from 'react';
import {TextField, Card} from 'material-ui'

class SearchBar extends Component {
    render() {
        return (
            <div className='row'>
                <div className='search-wrapper center'>
                    <Card style={{marginTop: 100, maxWidth : 400, padding: '5px 10px'}}>
                            <TextField
                                hintText='Search...'
                                className='search-bar'
                                underlineFocusStyle={{ borderColor: 'purple' }}
                            />
                    </Card>
                </div>
            </div>
            
        );
    }
}


export default SearchBar;