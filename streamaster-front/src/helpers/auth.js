// This file handles data manipulation

import store from './store'
import {EventEmitter} from 'events'
import {omit} from 'lodash'
const emitter = new EventEmitter();
emitter.setMaxListeners(20)

const baseUrl = 'http://localhost:8080/'

var user = { 
    email : null,
    userName : null,
    image : null
}

export default window.auth = {
    login : (email,password,callback) => {
        console.log('Logging in with',email,password)
        var fd = new FormData();
        fd.append('email',email)
        fd.append('password',password)

        fetch(baseUrl + 'login', {
            method: 'POST',
            body : fd
        }).then((response) => {
            var data = response.json().then((data) => {
                if (data.status == 200) {
                    user = omit(data,['status'])           
                    console.log( '[Auth] Auth Successful',data)
                    localStorage.setItem('user',JSON.stringify(user))
                } else {
                    console.log('[Auth] Auth failed,error ' + data.status)
                }
            callback(data)
            emitter.emit('auth',user)
            })
        })
    },

    subscribe : (callback) => {
        emitter.addListener('auth',callback)
    },

    getSavedUser : (callback) => {
        let localStorageUser = localStorage.getItem('user')
        if(localStorageUser){
            user = JSON.parse(localStorageUser)
            console.log('[Auth] Retreived user from last session',user)
            callback(user)
            emitter.emit('auth',user)
        }
    },

    getUser : () => {
        return user
    },

    register : (email,username,password,imageBase64,callback) => {
        var fd = new FormData();
        fd.append('email',email)
        fd.append('username',username)
        fd.append('password',password)
        fd.append('file',imageBase64);

        console.log('Registering with',email,password)
        fetch(baseUrl + 'register', {
            method: 'POST',
            body : fd
        }).then((response) => {
            response.json().then((data) => {
                console.log(data)
            })
                callback("eae")
        })
    },

    logout : () => {
        localStorage.removeItem('user')
        window.location.reload()
    }


}