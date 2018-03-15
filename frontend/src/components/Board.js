import React, { Component } from 'react';

class Board extends Component {
  constructor(props) {
    super(props);
    this.boatTypes = ["patrol", "cruiser", "submarine", "destroyer", "carrier"];
  }

  //Tracks the location of the boats on the board
  trackBoats( boats ){
    let boatTracker = {};
    boats.map(boat => {
      for(let i = 0; i < boat.length; i++ ){
        if(boat.direction === 1){
          boatTracker[`${boat.startRow + i}-${boat.startColumn}`] = boat.name
        } else {
          boatTracker[`${boat.startRow}-${boat.startColumn + i}`] = boat.name
        }
      }
    })
    return boatTracker;
  }

  render() {
    let boatTracker = {};
    if(this.props.board && this.props.type === "FLEET" && this.props.board.boats) boatTracker = this.trackBoats(this.props.board.boats);

    return (
        <div className="board">
          {this.props.board && this.props.board.tiles ? this.props.board.tiles.map((row, r) => {
            return <div className="board-row">
              {row.map((tile, c) => {
                let boatName = boatTracker[`${r}-${c}`] ? boatTracker[`${r}-${c}`] : "";
                return (
                  <div
                    className={
                      `${this.props.type === "FLEET" ? "radar-tile" : "radar-tile"} ${boatName}
                      ${this.props.row === r && this.props.column === c ? "radar-tile-select" : ""}`
                    }
                    onClick={() => {
                      if(this.props.type === "RADAR") this.props.suggestMove(r, c);
                    }}
                  >
                    {tile === 0 ? <div className="miss">O</div> : (tile === -1 ? <div className="hit">X</div> : "")}
                  </div>
                )
              })}
            </div>
          }) :
          <div> </div>
        }
        </div>
    );
  }
}

export default Board;
