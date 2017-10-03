var spotifyConfig = {
  token : '',
  redirect_uri : 'http://localhost:3000/callback',
  client_id : 'c9f088d430254819b8e3411810c03320',
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
        res.json().then((songs) => callback(songs))
      })
  },

  requestToken : function(callback){
    const params = { 
            client_id     : spotifyConfig.client_id,
            response_type : 'token',
            redirect_uri  : spotifyConfig.redirect_uri
    }

    const urlParams = new URLSearchParams(Object.entries(params))
    let url = 'https://accounts.spotify.com/authorize/?' + urlParams
    // waits for callback popup to set its new obtained token
    window.addEventListener('storage', (e) => {  
      spotifyConfig.token = localStorage.getItem('spotify_access_token')
      console.log('New access_token obtained from Spotify endpoint : ' + spotifyConfig.token)
    })

    let spotifyLoginWindow = window.open(url,'',"height=600,width=500")
    
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
  }
}
