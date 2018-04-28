import React from 'react';
import {TrackList} from '../TrackList/TrackList';
import './PlayList.css';

export class PlayList extends React.Component {

  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(e) {
    this.props.onNameChange(e.target.value);
  }

  render() {
    return (
      <div className="Playlist">
        <input defaultValue={"New Playlist"} onChange={this.handleNameChange}/>

        <TrackList tracks={this.props.playlistTracks} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval="true" />

        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}
