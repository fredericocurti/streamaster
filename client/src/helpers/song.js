const song = (source, title, artist, thumbnail_url = null, thumbnail_big_url = null, duration_ms) => {
  return ({
      track_id: null,
      source: source,
      title: title,
      artist: artist,
      thumbnail_url: thumbnail_url,
      thumbnail_big_url: thumbnail_big_url,
      duration: duration_ms
  })  
}

export default song

export const getSongInfo = (info, modalSource) => {
  let songInfo

  const getYoutubeNames = (info) => {
    console.log(info)
    let title = info.snippet.title.toLowerCase()
    let symIndex = title.indexOf('-')
    let artist = title.slice(0, symIndex)
    let song = title.slice(symIndex + 1, title.length)
    if (symIndex === -1) {
      return { artist: '', song: title }
    }
    return { artist: artist, song: song }
  }

  const getSpotifyArtistsNames = (info) => {
    let names = ''
    let i = 0
    for (i; i < info.artists.length; i++) {
      if (i < info.artists.length - 1) {
        names += info.artists[i].name + ', '
      } else {
        names += info.artists[i].name
      }
    }
    return names 
  }

  if (modalSource === 'spotify') {
    songInfo = {
      track_id: null,
      source: modalSource,
      url: info.uri,
      title: info.name,
      artist: getSpotifyArtistsNames(info),
      thumbnail_url: info.album.images[2].url,
      thumbnail_big_url: info.album.images[1].url,
      duration_ms: info.duration_ms
    }
  } else if (modalSource === 'youtube') {
    let names = getYoutubeNames(info)
    songInfo = {
      track_id: null,
      source: modalSource,
      url: info.id.videoId,
      title: names.song,
      artist: names.artist,
      thumbnail_url: info.snippet.thumbnails.default.url,
      thumbnail_big_url: info.snippet.thumbnails.high.url,
      duration_ms: null
    }
  } else if (modalSource === 'soundcloud') {
    var patt = /large/i;
    let big_thumb = info.artwork_url.replace(patt, 'crop')
    songInfo = {
      track_id: null,
      source: modalSource,
      url: info.permalink_url,
      title: info.title,
      artist: info.user.username,
      thumbnail_url: info.artwork_url,
      thumbnail_big_url: big_thumb,
      duration_ms: info.duration
    }
  }

  return songInfo
}