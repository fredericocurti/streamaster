// @ts-check

const express = require('express')
const path = require('path')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const fs = require('fs')

const port = process.env.PORT || 5000
const print = console.log

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const con = mysql.createConnection({
  host: 'localhost',
  user: 'fredcurti',
  password: '1170',
  database: 'streamaster'
})

function clean (result) {
  return JSON.parse(JSON.stringify(result))
}

con.connect((err) => {
  if (err) throw err
  console.log('MySQL Connected') 
})

app.get('/oi', (req, res) => {
  res.send('sup')
})

const querySql = (queryString, params = null) => {
  return new Promise((resolve, reject) => {
    con.query(queryString, params, (err, result) => {
      if (err) reject(err)
      // console.log('--- result ---')
      // console.log(result)
      // console.log(' --------- ')
      if (result) {
        result = clean(result)
      }
      resolve(result)
    })
  })
}


// LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  con.query('SELECT * FROM User WHERE email=? AND password=?', [email, password], (err, result) => {
    if (err) throw err
    if (result < 1) {
      res.json({ status: 404 })
    } else {
      // Get followings and followers
      let user = result[0]
      res.json({ ...user, follow: clean(result), status: 200 })
    }
  })
})

// REGISTER
app.post('/api/user', (req, res) => {
  console.log(req.body)
  const { email, username, password, file } = req.body
  print(email, username, password, null)
  con.query('SELECT * FROM User WHERE email=? OR username=?', [email, username], (err, result) => {
    if (err) throw err
    if (result == 1) {
      res.json({ status: 404 })
    } else {
      con.query('INSERT INTO User (email, username, password, thumbnail_url) VALUES (?,?,?,?)', [email, username, password, null], (err, result) => {
        res.json({ user_id: result.insertId, email: email, username: username, status: 200 })
      })
    }
  })
})

// Search User
app.get('/api/user/:info', (req, res) => {
  console.log(req.params.info)
  let info = req.params.info
  
  //SELECT * FROM User WHERE username LIKE '%rapha%' OR email LIKE '%rapha%';
  //let sql = "SELECT user_id, email, username, thumbnail_url FROM User WHERE email LIKE '%"+info+"%'" + "OR username LIKE '%"+info+"%'" 
  let query = con.query('SELECT user_id, email, username, thumbnail_url FROM User WHERE email LIKE ?', ["'%" + info + "%'"], (err, result) => {
    console.log(query.sql)
    console.log('Result: ')
    console.log(result)
  })
})

// Search user by get params
app.get('/api/user', async(req, res) => {
  console.log('REQUEST:' + req.originalUrl)
  let query = req.query.q
  let users = []
  // console.log(query)
  let result = await querySql(
    'SELECT user_id, email, username, thumbnail_url FROM User WHERE username LIKE ? OR email LIKE ?',
    [`%${query}%`, `%${query}%`]
  )
  console.log(result)
  res.json(result)
  // con.query('SELECT user_id, email, username, thumbnail_url FROM User WHERE username LIKE ? OR email LIKE ?', [`%${query}%`, `%${query}%`], (err, result) => {
    // result = result.map((e) => Object.assign({}, e))
    // res.json(result) 
  // })
  //con.query('SELECT playlist_id, name FROM Playlist WHERE user_id = ')
})

// Create New Playlist
app.post('/api/playlist', (req, res) => {
  console.log('Saving new playlist')
  let user_id = req.body.user_id
  console.log('user_id: ' + user_id)
  con.query("INSERT INTO Playlist (name, is_public, user_id) VALUES ('New Playlist', 1, ?)", [user_id], (err, result) => {
    console.log('INSERT INTO Playlist')
  })
  con.query('SELECT LAST_INSERT_ID()', (err, result) => {
    result = result.map((e) => Object.assign({}, e))
    let id = result[0]['LAST_INSERT_ID()']
    res.json({ playlist_id: id })
  })
})

// Change playlist name
app.patch('/api/playlist', (req, res) => {
  console.log('Changing Playlist name')
  // const {playlist_id, new_name} = req.body
  let playlist_id = req.body.playlist_id
  let new_name = req.body.new_name
  con.query('UPDATE Playlist SET name=? WHERE playlist_id=?', [new_name, playlist_id], (err, result) => {
  })
})

// Get followers and following users
app.get('/api/:id/friend', async(req, res) => {
  console.log('Getting current user followers and following')
  let following = []
  let followers = []
  let user_id = req.params.id
  let query1 = await querySql(
    'SELECT user_id, username FROM User INNER JOIN Follow ON User.user_id = Follow.user_id1 WHERE Follow.user_id1 = ?',
    [user_id]
  )

  if (query1.length === 0) {
    console.log('No following users')
  } else {
    following = query1
  }

  let query2 = await querySql(
    'SELECT user_id, username FROM User INNER JOIN Follow ON User.user_id = Follow.user_id1 WHERE Follow.user_id2 = ?',
    [user_id]
  )

  if (query2.length === 0) {
    console.log('No followers')
  } else {
    followers = query2
  }

  console.log(query1, query2)
  res.json({ following: following, followers: followers })
})

//Get user Playlists
app.get('/api/user/:id/playlist', async(req, res) => {
  let user = req.params.id
  let query = await querySql(
    "SELECT * FROM Playlist WHERE user_id = ?",
    [user]
  )
  console.log('QUERY', query)
  let result

  // let response = []
  
  let response = query.map(async(playlist) => {
    result = await querySql( 
      `SELECT * FROM Track t 
      INNER JOIN Playlist_has_track pt USING (track_id) 
      INNER JOIN Playlist p USING (playlist_id) 
      WHERE p.playlist_id = ?`,
      [playlist.playlist_id]
    )
    return {...playlist, songs: result}
  })

  let lastReponse = await Promise.all(response)
  // console.log(show)
  // console.log('-- RESP -- \n', lastReponse)
  res.json(lastReponse)
})

//Delete Playlist
app.delete('/api/playlist/:id', async (req, res) => {
  let id = req.params.id
  let query = await querySql(
    "DELETE FROM Playlist WHERE playlist_id = ?",
    [id]
  )
})

//Delete song from playlist
app.delete('/api/playlist/:playlist_id/:track_id', async (req, res) => {
  let playlistId = req.params.playlist_id
  let trackId = req.params.track_id
  console.log('---- deleting song ------ \n', playlistId, trackId)
  // console.log(playlistId, trackId)
  let query = await querySql("DELETE FROM ")
})


//Insert new song to playlist
app.put('/api/playlist/:id', async (req, res) => {
  let playlist_id = req.params.id
  let song = req.body
  let track_id
  let query = querySql(
    "INSERT INTO Track (source, title, artist, thumbnail_url, url, duration) VALUES (?, ? ,?, ?, ?, ?)",
    [song.source, song.title, song.artist, song.thumbnail_url, song.url, song.duration_ms]
  )

  console.log('--> inserting ', song, 'on playlist with id', playlist_id)

  con.query("SELECT LAST_INSERT_ID()", (err, result) => {
    result = result.map((e) => Object.assign({}, e))
    track_id = result[0]['LAST_INSERT_ID()']

    let query3 = querySql(
      "INSERT INTO Playlist_has_track (track_id, playlist_id) VALUES (?, ?)",
      [track_id, playlist_id]
    )
    res.json({ track_id: track_id })
  })
  // let query2 = querySql(
  //   "SELECT LAST_INSERT_ID()"
  // )
})


if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')))
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}

app.listen(port, () => console.log(`Listening on port ${port}`))
