import React, { Component } from 'react';
import axios from "axios";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPlayer1: null,
      hasPlayer2: null,
      id: null
    }
  }

  componentWillMount(){
    if(Date.now() - parseInt(localStorage.getItem("time")) < 120000){
      axios.post("http://localhost:8080/resumeGame", JSON.parse(localStorage.getItem("game")))
      .then((resp) => {
        let id = JSON.parse(localStorage.getItem("id"))
        if(id === 1 && resp.data.games[0].player1ready) this.props.history.push(`/battleStation`);
        else if(id === 2 && resp.data.games[0].player2ready) this.props.history.push(`/battleStation`);
        else this.props.history.push(`/setup`);
      })
      .catch(e => console.log(e))
    } else {
      console.log("here");

      axios.get("http://localhost:8080/getStatus")
      .then(response => {
        let id = JSON.parse(localStorage.getItem("id"));
        if(id === 1){
          if(response.data.games[0].player1ready) this.props.history.push(`/battleStation`);
          if(response.data.games[0].player1) this.props.history.push(`/setup`);
        } else if(id === 2) {
          if(response.data.games[0].player2ready) this.props.history.push(`/battleStation`);
          if(response.data.games[0].player2) this.props.history.push(`/setup`);
        } else {
          localStorage.removeItem("game");
          localStorage.removeItem("id");
          localStorage.removeItem("time");
          this.setState({
            hasPlayer1: !!response.data.games[0].player1,
            hasPlayer2: !!response.data.games[0].player2
          })
        }
      })
    }
  }

  render() {
    return (
        <div className="App">
          {
            (!(this.state.hasPlayer1 && this.state.hasPlayer2) ?
            <button className="landing-page-button" onClick={()=>{
              axios.get("http://localhost:8080/joinGame")
              .then(response => {
                localStorage.setItem('game', JSON.stringify(response.data.games[0]));
                localStorage.setItem('time', Date.now());
                localStorage.setItem('id', response.data.games[0].player2 ? 2 : 1);
                this.props.history.push(`/setup`)
              })
            }}> Join game </button>
            :
            <div>There are already 2 players</div> )
          }
        </div>
    );
  }
}

export default Landing;
