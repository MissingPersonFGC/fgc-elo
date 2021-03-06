import React from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import Flag from "react-world-flags";
import Helmet from "react-helmet";
import moon from "../assets/moon.png";
import pluto from "../assets/pluto.png";
import uranus from "../assets/uranus.png";
import venus from "../assets/venus.png";
import mars from "../assets/mars.png";
import mercury from "../assets/mercury.png";
import chibi from "../assets/chibi.png";
import jupiter from "../assets/jupiter.png";
import neptune from "../assets/neptune.png";

class Player extends React.Component {
  state = {
    player: {},
    characterUrl: "",
    tournaments: []
  };

  async componentDidMount() {
    const allTournaments = [];
    const key = window.location.pathname.replace("/player/", "");
    const characterObject = {
      moon: moon,
      mercury: mercury,
      jupiter: jupiter,
      mars: mars,
      venus: venus,
      uranus: uranus,
      pluto: pluto,
      neptune: neptune,
      chibi: chibi
    };
    this.dbRefPlayer = firebase.database().ref(`players/${key}`);
    await this.dbRefPlayer.on("value", async snapshot => {
      const player = snapshot.val();
      player.key = key;
      let characterUrl = null;
      if (player.characterShort && player.characterShort !== "") {
        characterUrl = characterObject[player.characterShort];
      }
      await this.setState({
        player,
        characterUrl
      });
    });
    this.dbRefTournaments = firebase.database().ref(`tournaments/`);
    this.dbRefTournaments.on("value", async snapshot => {
      const data = snapshot.val();
      for (let key in data) {
        const tournament = {
          key,
          ...data[key]
        };
        allTournaments.push(tournament);
      }
      const tournaments = allTournaments.filter(tournament => {
        let hasPlayer = false;
        tournament.results.forEach(player => {
          if (player.key === key) {
            hasPlayer = true;
          }
        });
        return hasPlayer === true;
      });
      tournaments.forEach(tournament => {
        tournament.results.forEach(player => {
          if (player.key === key) {
            tournament.place = player.place;
          }
        });
      });

      await this.setState({
        tournaments
      });
    });
  }

  render() {
    return (
      <>
        <Helmet>
          <title>
            {`${this.state.player.name} | Sailor Moon S Global Rankings`}
          </title>
        </Helmet>
        <section className="player">
          <div className="grid-container">
            <div className="profile-picture">
              {this.state.player.imageUrl &&
                this.state.player.imageUrl !== "" && (
                  <img
                    src={this.state.player.imageUrl}
                    alt={this.state.player.name}
                  />
                )}
            </div>
            <div className="player-profile">
              <h3>{this.state.player.name}</h3>
              <div className="profile-grid">
                <div className="profile-header">Real Name:</div>
                <div className="profile-answer">
                  {this.state.player.realName || "Unknown"}
                </div>
                <div className="profile-header">Country:</div>
                <div className="profile-answer">
                  {this.state.player.country &&
                    this.state.player.country !== "" && (
                      <>
                        <Flag code={this.state.player.country} height="18" />{" "}
                        {this.state.player.countryLong}
                      </>
                    )}
                </div>
                <div className="profile-header">Character:</div>
                <div className="profile-answer">
                  {this.state.player.characterShort &&
                    this.state.player.characterShort !== "" && (
                      <>
                        <img
                          src={this.state.characterUrl}
                          alt={this.state.player.character}
                          height="20"
                        />{" "}
                        {this.state.player.character}
                      </>
                    )}
                </div>
                <div className="profile-header">Team:</div>
                <div className="profile-answer">
                  {this.state.player.team || "None"}
                </div>
                <div className="profile-header">Controller:</div>
                <div className="profile-answer">
                  {this.state.player.controller || "Unknown"}
                </div>
                {this.state.player.twitter && this.state.player.twitter !== "" && (
                  <>
                    <div className="profile-header">Twitter:</div>
                    <div className="profile-answer">
                      <a
                        href={`https://twitter.com/${this.state.player.twitter}`}
                      >
                        @{this.state.player.twitter}
                      </a>
                    </div>
                  </>
                )}
                {this.state.player.twitch && this.state.player.twitch !== "" && (
                  <>
                    <div className="profile-header">Twitch:</div>
                    <div className="profile-answer">
                      <a href={`https://twitch.tv/${this.state.player.twitch}`}>
                        {this.state.player.twitch}
                      </a>
                    </div>
                  </>
                )}
                {this.state.player.mixer && this.state.player.mixer !== "" && (
                  <>
                    <div className="profile-header">Mixer:</div>
                    <div className="profile-answer">
                      <a href={`https://mixer.com/${this.state.player.mixer}`}>
                        {this.state.player.mixer}
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {this.props.user && (
            <Link
              to={`/edit-player/${this.state.player.key}`}
              className="admin-button"
            >
              Edit Player
            </Link>
          )}
        </section>
        {this.state.tournaments && (
          <section className="tournament-list">
            <div className="grid-container">
              <div className="grid-row grid-header">
                <div>Date</div>
                <div>Tournament</div>
                <div>Place</div>
                <div># Entrants</div>
              </div>
              {this.state.tournaments.map((tournament, index) => {
                return (
                  <Link to={`/tournament/${tournament.key}`}>
                    <div className="grid-row" key={index}>
                      <div>{tournament.tournamentDate}</div>
                      <div>
                        {tournament.country && tournament.country !== "" && (
                          <Flag code={tournament.country} height="16" />
                        )}
                        &nbsp;
                        {tournament.tournamentName}
                      </div>
                      <div>
                        {tournament.place}
                        {tournament.place.toString()[
                          tournament.place.toString().length - 1
                        ] === "1"
                          ? "st"
                          : tournament.place.toString()[
                              tournament.place.toString().length - 1
                            ] === "3"
                          ? "rd"
                          : tournament.place.toString()[
                              tournament.place.toString().length - 1
                            ] === "2"
                          ? "nd"
                          : tournament.place.toString()[
                              tournament.place.toString().length - 2
                            ] === "1" &&
                            tournament.place.toString()[
                              tournament.place.toString().length - 1
                            ] === "1"
                          ? "th"
                          : tournament.place.toString()[
                              tournament.place.toString().length - 2
                            ] === "1" &&
                            tournament.place.toString()[
                              tournament.place.toString().length - 1
                            ] === "2"
                          ? "th"
                          : tournament.place.toString()[
                              tournament.place.toString().length - 2
                            ] === "1" &&
                            tournament.place.toString()[
                              tournament.place.toString().length - 1
                            ] === "3"
                          ? "th"
                          : "th"}
                      </div>
                      <div>{tournament.results.length}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </>
    );
  }
}

export default Player;
