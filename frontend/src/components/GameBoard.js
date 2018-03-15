import React, { Component } from 'react';
import axios from "axios";

class GameBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carrier: [],
      destroyer: [],
      submarine: [],
      cruiser: [],
      patrol: [],
      selectedBoatLength: 0,
      startRow: null,
      startCol: null,
      ready: false
    };
    this.boatTypes = ["patrol", "cruiser", "submarine", "destroyer", "carrier"];
    this.interval = null;
  }
  componentWillMount(){
    this.interval = setInterval(function () {
      axios.get("http://localhost:8080/getStatus")
      .then(response => {
        localStorage.setItem('game', JSON.stringify(response.data.games[0]));
        console.log(JSON.parse(localStorage.getItem("game")));
        localStorage.setItem('time', Date.now());
        if(response.data.games[0].isPlayer1 && response.data.games[0].isPlayer2){
          this.setState({
            ready: true
          })
        }
      })
    }, 1000);

    let fleet;
    axios.get("http://localhost:8080/getStatus")
    .then(resp => {
      console.log(JSON.parse(localStorage.getItem("game")).boards.length);
      if(JSON.parse(localStorage.getItem("game")).boards.length === 0){
        axios.get("http://localhost:8080/setupGame")
        .then(response => {
          localStorage.setItem('game', JSON.stringify(response.data.games[0]));
          localStorage.setItem('time', Date.now());
          fleet = response.data.games[0].boards.reduce((myFleet, board) => {
            if(myFleet){
              return myFleet
            } else {
              if(board.type === "FLEET" && board.player === parseInt(localStorage.getItem("id"))){
                return board;
              } else return myFleet ? myFleet : null;
            }
          }, null);
          this.setState({
            tiles: fleet.tiles
          })
      })
    } else {
      console.log(resp.data.games[0].boards);
      fleet = resp.data.games[0].boards.reduce((myFleet, board) => {
        if(myFleet){
          return myFleet;
        } else {
          if(board.type === "FLEET" && board.player === parseInt(localStorage.getItem("id"))){
            return board;
          } else return board ? board : null;
        }
      }, null);
      let boatTracker = this.trackBoats(fleet.boats);
      this.setState(Object.assign({}, boatTracker, {tiles: fleet.tiles}))
    }
  })
}

trackBoats( boats ){
  let boatTracker = {};
  boats.map(boat => {
    let bArr = [];
    for(let i = 0; i < boat.length; i++ ){
      if(boat.direction === 1){
        bArr.push([boat.startRow + i, boat.startColumn])
      } else {
        bArr.push([boat.startRow, boat.startColumn + i])
      }
    }
    boatTracker[boat.name] = bArr;
  })
  return boatTracker;
}

  selectBoat( length ){
    this.setState({
      selectedBoatLength: length
    })
  }

  startingLocation( row, column ){
    this.setState({
      startRow: row,
      startCol: column,
      [this.boatTypes[this.state.selectedBoatLength - 1]]: []
    })
  }

  placeBoat( row, column ){
    let direction = row === this.state.startRow ? 0 : 1;
    let boat = this.state[this.boatTypes[this.state.selectedBoatLength - 1]].slice();
    let start;
    if(direction === 0){
      start = column > this.state.startCol ? this.state.startCol : column;
      for( let i = 0; i < this.state.selectedBoatLength; i++){
        boat.push([row, start + i])
      }
    }
    if(direction === 1){
      start = row > this.state.startRow ? this.state.startRow : row;
      for( let i = 0; i < this.state.selectedBoatLength; i++){
        boat.push([start + i, column])
      }
    }
    axios.post(`http://localhost:8080/placeBoat/${localStorage.getItem("id")}`, {
      name: this.boatTypes[this.state.selectedBoatLength - 1],
      length: this.state.selectedBoatLength,
      startRow: direction ? start : this.state.startRow,
      startColumn: direction ? this.state.startCol : start,
      direction: direction
    })
    this.setState({
      [this.boatTypes[this.state.selectedBoatLength - 1]]: boat,
      selectedBoatLength: 0,
      startRow:null,
      startCol: null
    })
  }

  isHighlighted( row, column ){
    return (
      ((row === this.state.startRow + this.state.selectedBoatLength - 1) && (column === this.state.startCol)) ||
      ((row === this.state.startRow - this.state.selectedBoatLength + 1) && (column===this.state.startCol)) ||
      ((row === this.state.startRow) && (column===this.state.startCol + this.state.selectedBoatLength - 1)) ||
      ((row === this.state.startRow) && (column===this.state.startCol - this.state.selectedBoatLength + 1))
    )
  }

  boatPresent( row, column ){
    let boatName = this.boatTypes.map(boat => {
      let there = this.state[boat].reduce((found, coords) => {
        return found ? found : coords[0] === row && coords[1] === column;
      }, false);
      if(there)
      return there ? boat : null;
    }).reduce((found, next) => found ? found : next, null);
    return boatName ? boatName : "";
  }

  boatBetween( row, column ){
    if(row === this.state.startRow || column === this.state.startCol){
      let direction = row === this.state.startRow ? 0 : 1;
      if(direction === 0){
        let start = column > this.state.startCol ? this.state.startCol : column;
        for( let i = 0; i < this.state.selectedBoatLength; i++){
          if(this.boatPresent(row, start + i)) return true;
        }
      }
      if(direction === 1){
        let start = row > this.state.startRow ? this.state.startRow : row;
        for( let i = 0; i < this.state.selectedBoatLength; i++){
          if(this.boatPresent(start + i, column)) return true;
        }
      }
    }
  }

  render () {
    let allBoatsSelected = false;
    if(this.boatTypes.map((boat) => this.state[boat].length).reduce((full, l) => (!full ? full : l > 0), true)){
      allBoatsSelected = true
    }
    return (
      <div className="App">
        <p>Place boats:</p>
        <div className="boat-list">

        </div>
        <button className={`landing-page-button small carrier ${this.state.selectedBoatLength === 5 ? "selected-boat" : ""}`} onClick={()=>this.selectBoat(5)}> Carrier </button>
        <button className={`landing-page-button small destroyer ${this.state.selectedBoatLength === 4 ? "selected-boat" : ""}`} onClick={()=>this.selectBoat(4)}> Destroyer </button>
        <button className={`landing-page-button small submarine ${this.state.selectedBoatLength === 3 ? "selected-boat" : ""}`} onClick={()=>this.selectBoat(3)}> Submarine </button>
        <button className={`landing-page-button small cruiser ${this.state.selectedBoatLength === 2 ? "selected-boat" : ""}`} onClick={()=>this.selectBoat(2)}> Cruiser </button>
        <button className={`landing-page-button small patrol ${this.state.selectedBoatLength === 1 ? "selected-boat" : ""}`} onClick={()=>this.selectBoat(1)}> Patrol </button>
        <div>
          <button className={`landing-page-button`} style={{"background-color": "black"}} onClick={() => {
            axios.get(`http://localhost:8080/randomBoard/${localStorage.getItem("id")}`)
            .then(response => {
              let boatTracker = this.trackBoats(response.data.boards[0].boats);
              this.setState(Object.assign({}, boatTracker, {tiles: response.data.boards[0].tiles}))
            })
          }}>Randomly Place Boats</button>
        </div>
        <div>
          {this.state.tiles ? this.state.tiles.map((row, r) => {
            return <div className="board-row">
              {row.map((tile, c) => {
                let startRow = this.state.startRow;
                let startCol = this.state.startCol;
                let highlighted = this.isHighlighted(r, c) && !this.boatBetween(r, c);
                let boatName = this.boatPresent(r, c);
                return (
                  <div className={`board-tile ${r === startRow && c === startCol ? "selected" : ""} ${highlighted ? "highlighted" : ""} ${boatName}`}
                    onClick={() => {
                      highlighted ?  this.placeBoat(r, c) : this.startingLocation(r, c)
                    }}
                  ></div>
                )
              })}
            </div>
          }) :
          <div> </div>
        }
        </div>
        <div>
          { allBoatsSelected ?
            <button className={`landing-page-button`} onClick={() => {
                clearInterval(this.interval);
                axios.get(`http://localhost:8080/setReady/${localStorage.getItem("id")}`)
                this.props.history.push(`/battleStation`)
            }}> Start Game </button> :
            <button className={`landing-page-button selected-boat`}> Start Game </button>
          }
        </div>

      </div>
    );
  }
}


export default GameBoard;
