import React, { Component } from 'react';
import axios from 'axios';

class Error extends Component {

  constructor(props){
    super(props);
    this.interval = null;
  }

  componentWillMount(){
    this.interval = setInterval(() => {
      axios.get("http://localhost:8080/getStatus")
      .then(response => {
        clearInterval(this.interval);
        this.props.history.push("/");
      })
      .catch(e => {
        console.log("still waiting");
      })
    }, 1000);
  }

  render() {
    return (
      <div>
        <div className="board-label final-message" >There was an error</div>
        <img src="https://previews.123rf.com/images/izakowski/izakowski1403/izakowski140300078/26622822-cartoon-illustration-of-sad-or-depressed-funny-guy-character.jpg"></img>
      </div>

    )
  }
}

export default Error;
