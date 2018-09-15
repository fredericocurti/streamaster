import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './css/App.css';
import './css/materialize.css'
import './css/style.css'
import auth from './helpers/auth'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import _ from 'lodash'

import Main from './components/Main.jsx'
import Login from './components/Login.jsx'
import SpotifyAuth from './components/SpotifyAuth.jsx'
import { getMuiTheme } from 'material-ui/styles';

class App extends Component {
  constructor(props){
    super(props);
  }

  componentWillMount() {
  }
  
  componentDidMount(){    
  }


  render() {
    const actions = []

    const muiTheme = getMuiTheme({
      slider: {
        selectionColor: 'darksalmon',
        handleFillColor: 'darksalmon',
        rippleColor: 'salmon'
      }
    })

    return (
      <Router>
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
            <Route exact path='/' component={Main}/>
            <Route path='/callback' component={SpotifyAuth}/>
        </div>
      </MuiThemeProvider>
    </Router>
    )
  }

}

export default App;
