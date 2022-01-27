import { EventEmitter } from 'events'
import { omit } from 'lodash'
const emitter = new EventEmitter();
emitter.setMaxListeners(20)

var user = {
  email: null,
  userName: null,
  thumbnail_url: null,
  user_id: null
}

export default window.authentication = {
  login: async (email, password) => {
    let res = await fetch('/api/login', {
      headers: { "Content-Type": "application/json" },
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    let data = await res.json()

    if (data.status == 200) {
      delete data['password']
      console.log('[Auth] Auth Successful', data)
      window.localStorage.setItem('user', JSON.stringify(data))
      return data
    } else {
      console.log('[Auth] Auth failed,error ' + data.status)
      return data
    }
  },

  subscribe: (callback) => {
    emitter.addListener('auth', callback)
  },

  unsubscribe: () => {
    emitter.removeAllListeners('auth')
  },

  getSavedUser: () => {
    let localStorageUser = localStorage.getItem('user')
    if (localStorageUser) {
      user = JSON.parse(localStorageUser)
      console.log('[Auth] Retreived user from last session', user)
      return user
    } else {
      return false
    }
  },

  getUser: () => {
    return user
  },

  getUsers: async () => {
    let res = await fetch('/api/users', {
      headers: { "Content-Type": "application/json" },
      method: 'GET',
    })

    let data = await res.json()
    return data
  },

  register: async (email, username, password, imageUrl) => {
    // let fd = new FormData();
    // fd.append('email',email)
    // fd.append('username',username)
    // fd.append('password',password)
    // fd.append('file',imageBase64);
    console.log('Registering with', email)
    try {
      let res = await fetch('/api/user', {
        headers: { "Content-Type": "application/json" },
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password,
          username: username,
          image: imageUrl
        })
      })
      let data = await res.json()
      if (data.status == 200) {
        user = omit(data, ['status'])
        localStorage.setItem('user', JSON.stringify(data))
        return user
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
    }

  },

  logout: () => {
    localStorage.removeItem('user')
    window.location.reload()
  }


}