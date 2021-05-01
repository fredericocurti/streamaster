export default window.youtube = {
    searchVideos: function (query, callback) {
        fetch(`api/youtube?q=${query}`, { method: "GET" })
            .then((res) => {
                res.json().then((videos) => {
                    console.log(videos)
                    callback(videos)
                })
            })
    }
}
