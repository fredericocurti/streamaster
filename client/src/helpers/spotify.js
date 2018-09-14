import keys from './config'

var spotifyConfig = {
  token : '',
  redirect_uri : `${window.location.origin}/callback`,
  client_id : keys.spotifyClientId,
}

export default window.spotify = {

  searchTracks : function(query,callback){
      let token = spotifyConfig.token
      let header = new Headers()
      header.append('Authorization',`Bearer ${token}`)
      let params = new URLSearchParams(Object.entries({
        q : query,
        type : 'track'
      }))

      var request = {
        method: 'GET',
        headers: header,
        mode: 'cors',
      }

      fetch('https://api.spotify.com/v1/search?'+params,request)
      .then((res) => {
        if (res.status == 200) {
          res.json().then((songs) => callback(songs))
        } else if (res.status == 401) {
          let componentCallback = callback
          this.requestToken(() => {
            this.searchTracks(query,(songs) => {
              componentCallback(songs)
            })
          })
        }
      })
  },

  requestToken : function(callback){
    const params = {
            scope         : 'user-modify-playback-state user-read-currently-playing' ,
            client_id     : spotifyConfig.client_id,
            response_type : 'token',
            redirect_uri  : spotifyConfig.redirect_uri,
            show_dialog   : false
    }

    const urlParams = new URLSearchParams(Object.entries(params))
    let url = 'https://accounts.spotify.com/authorize/?' + urlParams
    
    // waits for callback popup to set its new obtained token
    window.addEventListener('storage', (e) => {  
      spotifyConfig.token = localStorage.getItem('spotify_access_token')
      console.log('New access_token obtained from Spotify endpoint : ' + spotifyConfig.token)
      if (callback){
        callback('OK')
      }
    })

    window.location.replace(url)
    
  },

  resetToken : function(){
    spotifyConfig.token = 'BQCruOzQBOMtyUk1CadQ6seVXXC4THBJDw1uB6lSfQVv9pfNeooPG43DdrrmWjMDtbOIWG2z7DYVPwfw40oiUSEzPNICImLheyvvPfgKzKm5RKbyA-hkr_pIY9E51ufpU4gIjDtWmV7msBA_oMuJvYd4Lv9kvYCbogmraGfn_8cnlCo'
  },

  authenticate : function(callback){
    // Checks localStorage for a valid token
    let token = localStorage.getItem('spotify_access_token')
    if (token != null) {
      let header = new Headers()
      header.append('Authorization',`Bearer ${token}`)
      let params = new URLSearchParams(Object.entries({
        q : 'test',
        type : 'track'
      }))

      var request = { 
        method: 'GET',
        headers: header,
        mode: 'cors',
      }

      fetch('https://api.spotify.com/v1/search?'+params,request)
      .then( (res) => {
        if (res.status == 200){
          // Token is valid, application is ready
          spotifyConfig.token = token
          console.log('[spotifyAuth] Spotify token ' + spotifyConfig.token + ' is still valid')
          callback('OK')
        } else {
          // Requests another token since local's expired
          this.requestToken(callback)
        }
      })
    } else {
      // Request another token if there's none on localStorage
      this.requestToken(callback)
    }
  },

  getToken : function(){
    return spotifyConfig.token
  },

  play : function(track,callback){
    console.log(track.uri)
    let request = {
        method : 'PUT',
        headers : {
            'Authorization' : 'Bearer ' + this.getToken(),
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify({ 
            "uris" : [track.uri]
        })
    }
    fetch('https://api.spotify.com/v1/me/player/play',request).then((res) => {
        if (res.status == 204){
            console.log('Successfully playing track ' + track.name)
            callback()
        } else if (res.status == 401){
          this.requestToken(() => {
            this.play(track,() => {})
          })
        }
        return res.json();
    }).then(data => console.log(data)).catch(e => console.log(e))
    

},

pause : function(){
    let request = { 
        method : 'PUT',
        headers : {
            'Authorization' : 'Bearer ' + this.getToken(),
            'Content-Type' : 'application/json',
        }
    }
    fetch('https://api.spotify.com/v1/me/player/pause',request).then((res) => {
        if (res.status == 204){
          console.log('Successfully paused track')
        }
    })
},

seek : function(time,callback){
    let params = new URLSearchParams(Object.entries({
      position_ms : time
    }))
    let request = { 
        method : 'PUT',
        headers : {
            'Authorization' : 'Bearer ' + this.getToken(),
            'Content-Type' : 'application/json',
        }
    }

    fetch('https://api.spotify.com/v1/me/player/seek?'+params,request).then((res) => {
        if (res.status == 204){
          console.log('Successfully seeked track')
          callback(204)
        }
    })
},

setVolume : function(volume){
  let params = new URLSearchParams(Object.entries({
      volume_percent : volume
  }))

  let request = { 
        method : 'PUT',
        headers : {
            'Authorization' : 'Bearer ' + this.getToken(),
            'Content-Type' : 'application/json',
        }
    }

    fetch('https://api.spotify.com/v1/me/player/volume?'+params,request).then((res) => {
        if (res.status == 204){
          console.log('Successfully changed volume')
        }
    })
},

resume : function(){
    let request = {
        method : 'PUT',
        headers : {
            'Authorization' : 'Bearer ' + this.getToken(),
            'Content-Type' : 'application/json',
        }
      }
      fetch('https://api.spotify.com/v1/me/player/play',request).then((res) => {
      if (res.status == 204){
        console.log('Succesfully resumed track')
      }
    })
  }
}
