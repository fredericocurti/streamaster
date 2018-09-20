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