const friends = {
  query: async (query) => {
    let res = await fetch('endpoint')
    res = await res.json()
    return res
  }
}


export const friends