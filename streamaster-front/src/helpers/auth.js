// This file handles data manipulation

import store from './store'
import {EventEmitter} from 'events'

const emitter = new EventEmitter();
emitter.setMaxListeners(20)

const baseUrl = 'http://localhost:8080/'

var user = { 
    id : null ,
    email : null,
    username : null,
    password : null
}

export default window.auth = {
    login : (email,password,callback) => {
        console.log('Logging in with',email,password)
        fetch(baseUrl + 'login', {
            method: 'POST',
            body : JSON.stringify({
                action : 'AUTH',
                payload : {
                    email : email,
                    password : password
                }
            })
        }).then((response) => {
            var data = response.json().then((data) => {
                if (data.status == 200) {
                    console.log( '[Auth] Auth Successful',data)
                    localStorage.setItem('user',JSON.stringify(data.payload))
                    user = data.payload
                } else {
                    console.log('[Auth] Auth failed,error ' + data.status)
                }
            callback(data)
            })
        })
    },

    getSavedUser : (callback) => {
        let localStorageUser = localStorage.getItem('user')
        if(localStorageUser){
            user = JSON.parse(localStorageUser)
            console.log('[Auth] Retreived user from last session',user)
            callback(user)
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
        fetch('http://10.92.44.177:8080/PrimeiroSpringMVC/storeImage', {
            method: 'POST',
            body : fd
        }).then((response) => {
            console.log(response)
            // var data = response.json().then((data) => {
            //     if (data.status == "SUCCESS") {
            //         console.log( '[Auth] Register Successful ',data)
            //         localStorage.setItem('user',JSON.stringify(data.payload))
            //         user = data.payload
            //     } else if (data.status == "FAILURE") {
            //         console.log('[Auth] Auth failed,error ' + data.status)
            //     }
                callback("eae")
        })
    },

    logout : () => {
        localStorage.removeItem('user')
        window.location.reload()
    }


}