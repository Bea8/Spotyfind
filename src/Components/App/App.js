import React from 'react';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {PlayList} from '../PlayList/PlayList';
import {Spotify} from '../../util/Spotify';
import './App.css';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track, isRemoval) {
    if (this.state.playlistTracks.filter(item => track.id !== item.id)) {
      let newPlayList = this.state.playlistTracks;
      newPlayList.push(track);
      this.setState({
        playlistTracks: newPlayList
      });
  }}

  removeTrack(track) {
    let newPlayList = this.state.playlistTracks.filter(item => track.id !== item.id);
    this.setState({
      playlistTracks: newPlayList
    });
  }

  updatePlayListName(name) {
    this.setState({
      playlistName: name
    });
  }

  savePlayList() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlayList(this.state.playlistName, trackURIs)
    .then(() => {
     this.setState({
       playlistName: 'New Playlist',
       playlistTracks: []
     });
   });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

  render() {
    return (
      <div>
        <h1>SPOTYFiND</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlayListName} onSave={this.savePlayList} />
          </div>
        </div>
      </div>
    );
  }
}
