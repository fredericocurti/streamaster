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
  user: 'root',
  password: '1170',
  database: 'streamaster'
})

function clean (result) {
  return JSON.parse(JSON.stringify(result))
}

con.connect((err) => {
  if (err) throw err
  else {
    console.log('MySQL Connected') 
  }
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
    'SELECT user_id, username FROM User INNER JOIN Follow ON User.user_id = Follow.user_id2 WHERE Follow.user_id1 = ?',
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

// Follow playlist
app.post('/api/playlist/follow', async(req,res) => {
  let {user_id, playlist_id} = req.body
  console.log(user_id, playlist_id)
  let query = await querySql("INSERT INTO User_follows_playlist VALUES(?, ?)",
    [playlist_id, user_id]
  )
  res.sendStatus(200)
})

// Unfollow playlist
app.delete('/api/playlist/follow', async (req, res) => {
  let { user_id, playlist_id } = req.body
  console.log(user_id, playlist_id)
  let query = await querySql(
    "DELETE FROM User_follows_playlist WHERE playlist_id=? AND user_id=?",
    [playlist_id, user_id]
  )
  res.sendStatus(200)
})

//Get user Playlists
app.get('/api/user/:id/playlist', async(req, res) => {
  let user = req.params.id
  let query = await querySql(
    `SELECT p.playlist_id, p.name, p.is_public, p.user_id FROM Playlist p
    INNER JOIN User_follows_playlist USING(playlist_id)
    WHERE User_follows_playlist.user_id=?
    UNION 
    SELECT * FROM Playlist
    WHERE user_id=?
    `,
    // SELECT p.playlist_id, p.name, p.is_public, p.user_id FROM Playlist p 
    // INNER JOIN User_follows_playlist USING(playlist_id)
    // WHERE User_follows_playlist.user_id = 1
    // UNION 
    // SELECT * FROM Playlist
    // WHERE user_id=1;
    [user, user]
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
  let query = await querySql("DELETE FROM Playlist_has_track WHERE track_id = ? AND playlist_id = ?",
  [trackId, playlistId]
  )
  console.log(query)
})

//Insert new song to playlist
app.put('/api/playlist/:id', async (req, res) => {
  console.log("INSERTING NEW SONG")
  let playlist_id = req.params.id
  let song = req.body
  console.log('--- requested to add song ---- \n', song)
  let track_id
  let q = con.query(`CALL InsertTrackToPlaylist(?, ?, ?, ?, ?, ?, ?)`,
    [song.source, song.title, song.artist, song.thumbnail_url, song.url, song.duration_ms, playlist_id],
    (err, result) => {
      result = result.map((e) => Object.assign({}, e))
      console.log(result[0]['0'].hash)
      res.json({track_id: result[0]['0'].hash})
    }
  )
})

//Follow user
app.post('/api/user/friend', async (req, res) => {
  console.log("Follow user request")
  console.log(req.body)
  let {user_id1, user_id2} = req.body
  let q = await querySql('INSERT INTO Follow (user_id1, user_id2) VALUES (?, ?)',
    [user_id1, user_id2]
  )
  res.sendStatus(200)
})

//Unfollow user
app.delete('/api/user/friend', async (req, res) => {
  let {user_id1, user_id2} = req.body
  let q = await querySql('DELETE FROM Follow WHERE user_id1 = ? AND user_id2 = ?',
    [user_id1, user_id2]
  )
  res.sendStatus(200)
})

//Send Inbox
app.post('/api/user/inbox', async (req, res) => {
  console.log("SENDING INBOX")
  let {origin_user_id, destination_user_id, song} = req.body
  let q = con.query("CALL checkTrackInbox (?, ?, ?, ?, ?, ?)",
    [song.source, song. title, song.artist, song.thumbnail_url, song.url, song.duration_ms],
    (err, result) => {
      let track_id = result[0]['0'].hash
      con.query("INSERT INTO Inbox (origin_user_id, destination_user_id, playlist_id, track_id) VALUES (?, ?, ?, ?)", [origin_user_id, destination_user_id, null, track_id],
      (err, result) => {
        console.log("Inbox Sent")
      })
    })
})

//Get user's inbox
app.get('/api/:id/inbox', async (req, res) => {
  let user_id = req.params.id
  let q = await querySql(
  `SELECT i.origin_user_id, i.destination_user_id, i.date_sent, i.playlist_id, i.track_id, t.source, t.title, t.artist, t.thumbnail_url, t.url, t.duration_ms, u.user_id, u.email, u.username 
  FROM Inbox i
  INNER JOIN Track t using(track_id) 
  INNER JOIN User u ON(i.origin_user_id = u.user_id)
  WHERE destination_user_id = ?`,

//     SELECT * FROM Inbox i
// INNER JOIN Track t using(track_id)
// INNER JOIN User u ON(i.origin_user_id = u.user_id)
// WHERE destination_user_id = 5;
  [user_id]
  )
  console.log("-------- INBOX --------", q)
  res.json(q)
})

//Clear user's inbox
app.delete('/api/user/inbox', async (req, res)=> {
  let user_id = req.body.user_id
  console.log('Deleting inbox for user ', user_id)
  let q = await querySql("DELETE FROM Inbox WHERE destination_user_id = ?",
    [user_id]
  )
  res.sendStatus(200)
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
