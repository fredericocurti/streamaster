import {EventEmitter} from 'events'
import {omit} from 'lodash'
const emitter = new EventEmitter();
emitter.setMaxListeners(20)

const baseUrl = '/api/'
// const baseUrl = 'http://10.92.44.177:8080/'

export default window.auth = {
    getUserFollow: async(user) => {
        console.log("API helper called for getting follow")
        let res = await fetch('api/' + user.user_id + '/friend', {
            headers: { "Content-Type": "application/json" },
            method: 'GET',
        })
        try {
            res = await res.json()
        } catch (error) {
            throw error
        }
        return res
    },

    getUser: async(user) => {
        console.log('user')
        let res = await fetch('api/' + user.user_id + '/friend', {
            headers: { "Content-Type": "application/json" },
            method: 'GET',
        })
        try {
            res = await res.json()
        } catch (error) {
            throw error
        }
        return res
    },

    searchUser: async(info) => {
        console.log("Searching for: " + info)

        let params = new URLSearchParams(Object.entries({
            q: info,
        }))

        let res = await fetch('api/user?' + params, {
            headers: { "Content-Type": "application/json" },
            method: 'GET',
        })
        let data = await res.json()
        console.log(data)
        return data
    },

//PLAYLISTS
    getUserPlaylists: async(user) => {
        console.log("Getting users Playlists")
        let res = await fetch('api/user/' + user.user_id + '/playlist', {
            headers: { "Content-Type": "application/json" },
            method: 'GET',
        })

        let data = await res.json()
        return data
    },
    
    createNewPlaylist: async (user) => {
        console.log("api helper called for creating new playlist")
        console.log(user.user_id)
        let res = await fetch('api/playlist', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify({
                user_id: user.user_id
            })
        })

        let data = await res.json()
        console.log("data of createNewPlaylist: ")
        console.log(data)
        return data
    },
    
    playlistNameChange: (playlist, newName) => {
        console.log("api helper called for changing playlist name")
        let res = fetch('api/playlist', {
            headers: { "Content-Type": "application/json" },
            method: 'PATCH',
            body: JSON.stringify({
                playlist_id: playlist.playlist_id,
                new_name: newName
            })
        })
    },

    deletePlaylist: (playlist) => {
        console.log("api helper called for deleting playlist")
        let res = fetch('/api/playlist/' + playlist.playlist_id, {
            headers: { "Content-Type": "application/json" },
            method: 'DELETE',
        })
    },

    deleteSong: async(song, playlist) => {
        try {
            let res = await fetch(`/api/playlist/${playlist.playlist_id}/${song.track_id}`,{
                headers: { "Content-Type": "application/json" },
                method: 'DELETE',
            })
        } catch(err) {
            console.log(err)
        }
    },

//SONGS
    insertSongOnPlaylist: async(song, playlist) => {
        console.log("api helper called for inserting song to playlist")
        console.log(playlist)
        let res = await fetch('api/playlist/' + playlist.playlist_id, {
            headers: { "Content-Type": "application/json" },
            method: 'PUT',
            body: JSON.stringify(song)
        })

        let data = await res.json()
        return data
    }
}
