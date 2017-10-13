import spotify from './spotify'

export default window.player = {
    play : function(track){
        console.log(track.uri)
        let request = {
            method : 'PUT',
            headers : {
                'Authorization' : 'Bearer ' + spotify.getToken(),
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({ 
                "uris" : [track.uri]
            })
        }
        fetch('https://api.spotify.com/v1/me/player/play',request).then((res) => {
            if (res.status == 204){
                console.log('Successfully playing track ' + track.name)
            }
        })

    },

    pause : function(){
        let request = { 
            method : 'PUT',
            headers : {
                'Authorization' : 'Bearer ' + spotify.getToken(),
                'Content-Type' : 'application/json',
            }
        }
        fetch('https://api.spotify.com/v1/me/player/pause',request).then((res) => {
            console.log(res)
        })
    }
}
