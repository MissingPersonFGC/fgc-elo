import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyD_L93QGk5L-B8tkewVe8kUCrsK_DjIfFQ",
  authDomain: "sailormoon-elo.firebaseapp.com",
  databaseURL: "https://sailormoon-elo.firebaseio.com",
  projectId: "sailormoon-elo",
  storageBucket: "",
  messagingSenderId: "841627538839"
};
firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {
    return (
      <div>
        <div className="jumbotron text-center">
          <h1 className="page-header">Sailor Moon S Global Rankings</h1>
          <p>Who's best at fighting evil by moonlight?</p>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
