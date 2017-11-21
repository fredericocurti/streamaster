import SC from 'node-soundcloud'
import keys from './config'

export default window.soundcloud = {
    searchTracks : function(query,callback) {
        let params = new URLSearchParams(Object.entries({
          q : query,
          limit : 20,
          client_id : keys.soundcloudClientId
        }))
  
        var request = {
          method: 'GET'
        }
  
        fetch('https://api.soundcloud.com/tracks?'+params,request)
        .then((res) => {
          if (res.status == 200) {
            res.json().then((songs) => {
                console.log(songs)
                callback(songs)
            })
          } else {
            console.log('[SC] An error has ocurred when fetching',res)
          }
        })
    },


}