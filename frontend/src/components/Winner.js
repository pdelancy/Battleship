import React, { Component } from 'react';

class Winner extends Component {
  componentDidMount() {
    localStorage.removeItem("game");
    localStorage.removeItem("id");
    localStorage.removeItem("time");
    setTimeout(() => {
      this.props.history.push("/");
    }, 5000)
  }
  render() {
    return (
      <div className="board-label final-message" >You are a winner!</div>
    )
  }
}

export default Winner;
