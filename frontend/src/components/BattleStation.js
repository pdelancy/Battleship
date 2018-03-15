import React, { Component } from 'react';
import Board from "./Board";
import axios from "axios";

class BattleStation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radar: {},
      fleet: {},
      isTurn: false,
      row: -1,
      column: -1
    }
    this.interval = null;
  }

  // Sets interval to ping backend for game state and then updates game state
  // saved to local storage
  componentWillMount() {
    this.interval = setInterval(() => {
      axios.get("http://localhost:8080/getStatus")
      .then(response => {
        console.log(response.data.games[0]);
        localStorage.setItem('game', JSON.stringify(response.data.games[0]));
        localStorage.setItem('time', Date.now());
        if(response.data.games[0].status > 0 ){
          console.log("HERE");
          localStorage.removeItem('game');
          clearInterval(this.interval);
          axios.get("http://localhost:8080/clearGame")
          if(response.data.games[0].status === localStorage.getItem("id")){
            this.props.history.push(`/loser`);
          } else {
            this.props.history.push(`/winner`);
          }
        };
        let boards = {};
        response.data.games[0].boards.map((board) => {
          if(board.player === parseInt(localStorage.getItem("id"))){
            if(board.type === "FLEET") boards.fleet = board;
            else boards.radar = board;
          }
        })
        this.setState({
          radar: boards.radar,
          fleet: boards.fleet,
          isTurn: response.data.games[0].turn === parseInt(localStorage.getItem("id"))
        })
      })
      .catch(e => {
        clearInterval(this.interval);
        this.props.history.push(`/error`)
      })
    }, 1000);
  }

  // Sets a square in the state to mark it as the current targeted square
  setMove(row, column) {
    if(![0, -1].includes(this.state.radar.tiles[row][column])){
      this.setState({
        row: row,
        column: column
      })
    }
  }

  render() {
    return (
        <div className="battle-station-container">

          <div className="boards-container">
            <div>
              <div className="board-label">Your Armada</div>
              <Board
                type="FLEET"
                playerId={localStorage.getItem("id")}
                board={this.state.fleet} />
            </div>
            <div className="battle-station-header"> {this.state.isTurn ?
              <div style={{"display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center"}}>
                <p className="board-label">YOUR TURN!</p>
                <button
                  className={`landing-page-button ${this.state.row > -1 && this.state.column > -1 ? "" : "selected"}`}
                  onClick={() => {
                    if(this.state.row > -1 && this.state.column > -1){
                      axios.post(`http://localhost:8080/makeMove/${localStorage.getItem("id")}`, {
                        row: this.state.row,
                        column: this.state.column
                      })
                      .then((resp) => {
                        this.setState({
                          row: -1,
                          column: -1
                        })
                      })
                    }
                  }}
                  > FIRE! </button>
                  {/* <button className="quit-game"> Surrender </button> */}
              </div>
              : <p className="board-label">WAITING FOR OTHER PLAYER</p>}
              <button className="quit-game" onClick={() => {
                axios.get(`http://localhost:8080/quitGame/${localStorage.getItem("id")}`)
                .then(() => {
                  clearInterval(this.interval);
                  // axios.get("http://localhost:8080/clearGame");
                  this.props.history.push(`/loser`);
                })
              }}> Surrender </button>
            </div>
            <div>
              <div className="board-label">Radar</div>
              <Board
                type="RADAR"
                playerId={localStorage.getItem("id")}
                board={this.state.radar}
                suggestMove={(row, column)=>{this.setMove(row, column)}}
                row={this.state.row}
                column={this.state.column}
              />
            </div>
          </div>
        </div>
    );
  }
}

export default BattleStation;
