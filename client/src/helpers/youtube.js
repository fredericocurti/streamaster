import keys from './config'

export default window.youtube = {
    searchVideos : function(query,callback){
        let params = new URLSearchParams(Object.entries({
            part : 'snippet',
            q : query,
            maxResults : 20,
            type: 'video',
            videoDuration : 'medium',
            key : keys.youtubeKey
        }))

        let request = { 
            method: 'GET',
        }

        fetch('https://www.googleapis.com/youtube/v3/search?' + params , request )
        .then((res) => {
            res.json().then((videos) => {
                console.log(videos)
                callback(videos)
            })
        })
    }
}
