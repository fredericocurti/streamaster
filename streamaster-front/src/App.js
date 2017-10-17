import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './css/App.css';
import './css/materialize.css'
import './css/style.css'
import store from './helpers/store'
import auth from './helpers/auth'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import _ from 'lodash'

import Main from './components/Main.jsx'
import Login from './components/Login.jsx'
import SpotifyAuth from './components/SpotifyAuth.jsx'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      auth : true
    }
  }

  componentWillMount() {
    auth.getSavedUser((user) => {
      this.setState({ auth : user })
    })

    auth.subscribe((user) => {
      this.setState({ auth : user })
    })

  }
  
  componentDidMount(){    
  }


  render() {
    const actions = []

    return (
      <Router>
      <MuiThemeProvider>
        <div>
          <Route exact path='/' component={ this.state.auth ? Main : Login }/>
          <Route path='/callback' component={SpotifyAuth}/>
        </div>
      </MuiThemeProvider>
    </Router>
    )
  }

}

export default App;
