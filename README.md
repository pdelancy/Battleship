# Battleship

This is a simple Battleship application that consists of a Spring backend and a ReactJS frontend. It is client-persisted, meaning that instead of using a database to record the state of the game, the game state is saved within the client's local storage within the browser. When the client visits the landing page, if there is a game within the local storage saved within the last two minutes, the client will restore the game. The other player, when connected, will receive the restored game, and the game will continue. Therefore, neither the client's reloading the page nor the server's restarting will interrupt the game flow.

Only one game may occur at a time. 

To launch the app, open two different terminal windows, one for the front end, and one for the backend. 

To launch the backend, navigate to  /backend , and run the following command:

    ./mvnw spring-boot:run

To launch the frontend, navigate to /frontend, and run npm install, followed by npm start.

Below is a summary of the tech stack:

Backend: Runs on Port 8080

  Developed using Spring Boot, it relies on Object Oriented programming. Although it does not persist using a database, it is structured so that it can easily be adapted to do so. It is designed with a Model-View-Controller framework, with models for the Game, the Board, Boat, and Moves. It also implements service framework, always interacting with the client via wrappers.
  
Frontend: Runs on Port 3000

  Developed using ReactJS, it is a single page web app that implements Hash Router to increase responsivity. The user interface handles a large portion of the game logic, and is responsible for persisting the game state.
