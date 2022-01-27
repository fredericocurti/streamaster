import SC from 'node-soundcloud'
import keys from './config'

export default window.soundcloud = {
    searchTracks : function(query, callback) {
      fetch(`api/soundcloud?q=${query}`, { method: "GET" })
      .then((res) => {
          res.json().then((res) => {
              console.log(res)
              callback(res)
          })
      })   
    }
}