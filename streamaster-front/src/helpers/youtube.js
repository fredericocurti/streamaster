var credentials = {
  apiKey : '301542026521-3bvujkuau6s3piv1fs5bgfh5ttgn7qic.apps.googleusercontent.com',
  clientId : '1S3SyhIo3228qjpsTl14tElf',
  callbackUri : 'http://localhost:3000/youtubecallback'
}
// generate a url that asks permissions for Google+ and Google Calendar scopes


    

export default window.youtube = {

//     authenticate : function(){
//         // const gapiScript = document.createElement('script')
//         // gapiScript.src = 'https://apis.google.com/js/api.js?onload=onGapiLoad'
//         // window.onGapiLoad = function onGapiLoad() {
//         //     gapi.load('auth', {'callback': onAuthApiLoad})
//         //     function onAuthApiLoad() {
//         //         console.log(gapi.auth)
//         //         gapi.auth.init()
//         //     }
//         // }
//         // gapi.client.init({
//         //     'apiKey': credentials.apiKey,
//         //     'clientId': credentials.clientId,
//         //     'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
//         //     'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
//         // }).then(() => {
//         //     // Listen for sign-in state changes.
//         //     GoogleAuth.isSignedIn.listen(this.updateSigninStatus)
//         //     GoogleAuth.signIn()
//         // })

        
//         let header = new Headers()
//         header.append('Authorization',`Bearer ${token}`)
//         let params = new URLSearchParams(Object.entries({
//             client_id : credentials.clientId,
         
//    redirect_uri : credentials.callbackUri,
//             response_type : 'token',
//             scope : ''
//         }))
//         let request = { 
//             method: 'GET',
//             headers: header,
//             mode: 'cors',
//         }

//         fetch('https://accounts.google.com/o/oauth2/v2/auth?' + params , request )
//     },

    // sendAuthorizedApiRequest : function(requestDetails) {
    //     let currentApiRequest = requestDetails;
    //     if (isAuthorized) {
    //         // Make API request
    //         // gapi.client.request(requestDetails)

    //         // Reset currentApiRequest variable.
    //         currentApiRequest = {};
    //     } else {
    //         GoogleAuth.signIn()
    //     }
    // },

    // updateSigninStatus : function(isSignedIn){
    //     if (isSignedIn) {
    //         let isAuthorized = true;
    //         if (currentApiRequest) {
    //             this.sendAuthorizedApiRequest(currentApiRequest);
    //         }
    //     } else {
    //         let isAuthorized = false;
    //     }
    // },

    searchVideos : function(query,callback){
        let params = new URLSearchParams(Object.entries({
            part : 'snippet',
            q : query,
            maxResults : 10,
            type: 'video',
            videoDuration : 'medium',
            key : 'AIzaSyBOP-sEHEIeeHhWrb_uWpmZUMQD3fc6Jrc'
        }))

        let request = { 
            method: 'GET',
        }

        fetch('https://www.googleapis.com/youtube/v3/search?' + params , request )
        .then((res) => {
            res.json().then((videos) => {
                callback(videos)
            })
        })
    }


}
