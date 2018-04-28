const clientID = '6b8c79718028415081443d6ba2b5ab3a';
const redirectURI = 'http://localhost:3000/';
let accessToken = '';

export const Spotify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    }

  let newAccessToken = window.location.href.match(/access_token=([^&]*)/);
  let expiresIn = window.location.href.match(/expires_in=([^&]*)/);

  if(newAccessToken && expiresIn) {
    accessToken = newAccessToken[1];
    let expirationTime = Number(expiresIn[1]);

    window.setTimeout(() => accessToken = '', expirationTime * 10000);
    window.history.pushState('Access Token', null, '/');

    return accessToken;
  }
  else{
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(searchTerm) {
    accessToken = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks === null) {
        return [];
      }
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
    });
  },

  savePlayList(playlistName, trackURIs) {
    if(!playlistName && !trackURIs) {
      return;
    }
    let accessToken = this.getAccessToken();
    let headers = {
      Authorization: `Bearer ${accessToken}`
    };

    let userID;
    return fetch('https://api.spotify.com/v1/me', {headers: headers})
    .then(response => response.json())
    .then(jsonResponse => {
      userID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({name: playlistName})})
    .then(response => response.json())
    .then(jsonResponse => {
      let playlistID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({uris: trackURIs})
    });
  });
  });
  }
};
