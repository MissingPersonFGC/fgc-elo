import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

class Header extends React.Component {
  doLogout = async e => {
    e.preventDefault();
    auth.signOut().then(() => {
      this.props.releaseUser();
    });
  };

  render() {
    return (
      <header>
        {!this.props.user && (
          <div className="admin-buttons">
            <Link to="/login">Login</Link>
          </div>
        )}
        {this.props.user && (
          <div className="admin-buttons">
            <Link to="/">Leaderboard</Link>
            <Link to="/add-tournament">Add Tournament</Link>
            <Link to="/add-player">Add Player</Link>
            <button onClick={this.doLogout}>Logout</button>
          </div>
        )}
        <div className="header-text">
          <h1>Sailor Moon S Global Rankings</h1>
          <h2>Who's the best at fighting evil by moonlight?</h2>
        </div>
      </header>
    );
  }
}

export default Header;
