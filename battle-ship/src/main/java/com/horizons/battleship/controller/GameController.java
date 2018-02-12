package com.horizons.battleship.controller;

import com.horizons.battleship.model.Board;
import com.horizons.battleship.model.Boat;
import com.horizons.battleship.model.Game;
import com.horizons.battleship.model.Move;
import com.horizons.battleship.service.BoardWrapper;
import com.horizons.battleship.service.GameWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Controller
@RestController
public class GameController {
    private Game game;
    String [] boatTypes = { "patrol", "cruiser", "submarine", "destroyer", "carrier"};

    @Autowired
    public GameController(Game game){
        this.game = game;
    }

    @CrossOrigin
    @RequestMapping(path = "/joinGame")
    public GameWrapper joinGame(){
        GameWrapper gameWrapper = new GameWrapper();
        try {
            List<Game> games = new ArrayList<>();
            if(game.isPlayer1()) game.setPlayer2(true);
            else game.setPlayer1(true);
            games.add(game);

            gameWrapper.setGames(games);
            gameWrapper.setSuccess(true);
        } catch (Exception e){
            gameWrapper.setErrorMessage(e.getMessage());
            gameWrapper.setSuccess(false);
        }
        return gameWrapper;
    }

    @CrossOrigin
    @RequestMapping(path = "/setupGame")
    public GameWrapper setupGame(){
        GameWrapper gameWrapper = new GameWrapper();
        try{
            List<Game> games = new ArrayList<>();
            List<Board> boards = new ArrayList<>();
            for(int i = 0; i < 2; i++){
                Board radarBoard = new Board();
                radarBoard.setTiles(new Integer [10][10]);
                radarBoard.setType("RADAR");
                radarBoard.setPlayer(i + 1);
                boards.add(radarBoard);
                Board boatsBoard = new Board();
                boatsBoard.setTiles(new Integer [10][10]);
                boatsBoard.setType("FLEET");
                boatsBoard.setPlayer(i + 1);
                List<Boat> boats = new ArrayList<>();
                boards.add(boatsBoard);
            }
            game.setBoards(boards);
            games.add(game);
            gameWrapper.setGames(games);
            gameWrapper.setSuccess(true);
        } catch (Exception e) {
            gameWrapper.setSuccess(false);
            gameWrapper.setErrorMessage(e.getMessage());
        }
        return gameWrapper;
    }

    @CrossOrigin
    @RequestMapping(path = "/randomBoard/{playerId}")
    public BoardWrapper randomBoard (@PathVariable("playerId") Integer playerId){
        BoardWrapper boardWrapper = new BoardWrapper();
        try{
            List<Board> boards = new ArrayList<>();
            List<Boat> boats = new ArrayList<>();
            Board fleetBoard = findBoard(playerId, "FLEET");
            Integer [][] tiles = fleetBoard.getTiles();
            for(int i = 0; i < boatTypes.length; i++){
                Random r = new Random();
                Integer startRow = r.nextInt(10 - (i));
                Integer startColumn = r.nextInt(10 - (i));
                Integer direction = r.nextInt(2);
                while(!this.spaceAvailable(tiles, startRow, startColumn, i + 1, direction, boats)){
                    startRow = r.nextInt(10 - (i));
                    startColumn = r.nextInt(10 - (i));
                    direction = r.nextInt(2);
                }
                Boat boat = new Boat();
                boat.setDirection(direction);
                boat.setLength(i+1);
                boat.setName(boatTypes[i]);
                boat.setStartRow(startRow);
                boat.setStartColumn(startColumn);
                boats.add(boat);
            }
            fleetBoard.setTiles(tiles);
            fleetBoard.setBoats(boats);
            boards.add(fleetBoard);
            boardWrapper.setBoards(boards);
            boardWrapper.setSuccess(true);
        } catch (Exception e) {
            boardWrapper.setErrorMessage(e.getMessage());
            boardWrapper.setSuccess(false);
        }
        return boardWrapper;
    }

    @CrossOrigin
    @RequestMapping(path="/placeBoat/{playerId}", method = RequestMethod.POST)
    public BoardWrapper placeBoat(@RequestBody Boat boat, @PathVariable("playerId") Integer playerId){
        BoardWrapper boardWrapper = new BoardWrapper();
        try{
            System.out.println("In place boat");
            System.out.println(boat.getName());
            List<Board> boards = game.getBoards();
            Board board = findBoard(playerId, "FLEET");
            List<Boat> boats = new ArrayList<>();
            for(Boat b :  board.getBoats()) {
                if(!b.getName().equals(boat.getName())){
                    boats.add(b);
                }
            }
            boats.add(boat);
            board.setBoats(boats);
            game.setBoards(boards);
            boardWrapper.setBoards(boards);
            boardWrapper.setSuccess(true);
        } catch (Exception e){
            boardWrapper.setErrorMessage(e.getMessage());
            boardWrapper.setSuccess(false);
        }
        return boardWrapper;
    }

    @CrossOrigin
    @RequestMapping(path="/makeMove/{playerId}", method=RequestMethod.POST)
    public BoardWrapper makeMove(@RequestBody Move move, @PathVariable("playerId") Integer playerId){
        BoardWrapper boardWrapper = new BoardWrapper();
        try{
            List<Board> boards = new ArrayList<>();
            Board fleetBoard = findBoard(playerId ==  1 ? 2 : 1, "FLEET");
            Integer [][] fleetTiles = fleetBoard.getTiles();
            Board radar = findBoard(playerId, "RADAR");
            Integer [][] radarTiles = radar.getTiles();
            if(fleetBoard.getTiles()[move.getRow()][move.getColumn()] == null){
                boolean hit = false;
                for( Boat boat : fleetBoard.getBoats()){
                    for( int i = 0; i < boat.getLength(); i++){
                        if(boat.getDirection() == 0 &&
                                boat.getStartRow() == move.getRow() &&
                                boat.getStartColumn() + i == move.getColumn()){
                            boat.hitBoat();
                            fleetTiles[move.getRow()][move.getColumn()] = -1;
                            radarTiles[move.getRow()][move.getColumn()] = -1;
                            hit = true;
                            break;
                        } else if(boat.getDirection() == 1 &&
                                boat.getStartRow() + i == move.getRow() &&
                                boat.getStartColumn() == move.getColumn()){
                            boat.hitBoat();
                            fleetTiles[move.getRow()][move.getColumn()] = -1;
                            radarTiles[move.getRow()][move.getColumn()] = -1;
                            boat.hitBoat();
                            hit = true;
                            break;
                        }
                    }
                }
                if(!hit){
                    fleetTiles[move.getRow()][move.getColumn()] = 0;
                    radarTiles[move.getRow()][move.getColumn()] = 0;
                }
            }
            fleetBoard.setTiles(fleetTiles);
            boards.add(fleetBoard);
            radar.setTiles(radarTiles);
            boards.add(radar);
            game.setTurn(game.getTurn() == 1 ? 2 : 1);
            boardWrapper.setBoards(boards);
            boardWrapper.setSuccess(true);
        } catch (Exception e){
            boardWrapper.setErrorMessage(e.getMessage());
            boardWrapper.setSuccess(false);
        }
        return boardWrapper;
    }

    @CrossOrigin
    @RequestMapping(path="/getStatus")
    public GameWrapper getStatus(){
        GameWrapper gameWrapper = new GameWrapper();
        try{
            List<Game> games = new ArrayList<>();
            List<Board> boards = game.getBoards();
            if(boards != null) {
                for (Board board : boards) {
                    if (board.getType().equals("FLEET")) {
                        boolean boatsRemain = false;
                        for (Boat boat : board.getBoats()) {
                            boatsRemain = boatsRemain ? boatsRemain : !boat.isSunk();
                        }
                        if (!boatsRemain && board.getBoats().size() == 5) {
                            game.setStatus(board.getPlayer());
                            break;
                        } else {
                            game.setStatus(0);
                        }
                    }
                }
            }
            games.add(game);
            gameWrapper.setGames(games);
            gameWrapper.setSuccess(true);
        } catch ( Exception e ){
            gameWrapper.setErrorMessage(e.getMessage());
            gameWrapper.setSuccess(false);
        }
        return gameWrapper;
    }

    @CrossOrigin
    @RequestMapping("/setReady/{playerId}")
    public GameWrapper setReady(@PathVariable("playerId") Integer playerId){
        GameWrapper gameWrapper = new GameWrapper();
        try{
            List<Game> games = new ArrayList<>();
            if(playerId == 1){
                game.setPlayer1ready(true);
            } else {
                game.setPlayer2ready(true);
            }
            if(game.isPlayer1ready() && game.isPlayer2ready()){
                game.setTurn(Math.random() > .5 ? 1 : 2);
            }
            games.add(game);
            gameWrapper.setGames(games);
            gameWrapper.setSuccess(true);
        } catch ( Exception e ){
            gameWrapper.setErrorMessage(e.getMessage());
            gameWrapper.setSuccess(false);
        }
        return gameWrapper;
    }

    @CrossOrigin
    @RequestMapping("/clearGame")
    public GameWrapper clearGame(){
        GameWrapper gameWrapper = new GameWrapper();
        try{
            List<Game> games = new ArrayList<>();
            game = new Game();
            games.add(game);
            gameWrapper.setGames(games);
            gameWrapper.setSuccess(true);
        } catch ( Exception e ){
            gameWrapper.setErrorMessage(e.getMessage());
            gameWrapper.setSuccess(false);
        }
        return gameWrapper;
    }

    @CrossOrigin
    @RequestMapping(value = "/resumeGame", method = RequestMethod.POST)
    public GameWrapper resumeGame(@RequestBody Game game){
        GameWrapper gameWrapper = new GameWrapper();
        try{
            System.out.println("IN RESUME GAME");
            System.out.println(game.isPlayer1());
            for(Board b : game.getBoards()){
                System.out.println(b.getBoats().size());
            }
            List<Game> games = new ArrayList<>();
            games.add(game);
            this.game = game;
            gameWrapper.setGames(games);
            gameWrapper.setSuccess(true);
        } catch ( Exception e ){
            gameWrapper.setErrorMessage(e.getMessage());
            gameWrapper.setSuccess(false);
        }
        return gameWrapper;
    }


    private Board findBoard(Integer playerId, String type){
        Board ret = null;
        for( Board b : game.getBoards()){
            if(b.getType().equals(type) && b.getPlayer() == playerId){
                ret = b;
            }
        }
        return ret;
    }

    private boolean spaceAvailable(
            Integer [][] board,
            Integer row,
            Integer column,
            Integer length,
            Integer direction,
            List<Boat> boats){
        boolean available = true;

        for( int i = 0; i < length; i++){
            if(direction == 0 ){
                for( Boat boat : boats){
                    for( int j = 0; j < boat.getLength(); j++){
                        if(boat.getDirection() == 0 &&
                                boat.getStartRow() == row &&
                                boat.getStartColumn() + j == column + i){
                            available = false;
                            break;
                        } else if(boat.getStartRow() + j == row &&
                            boat.getStartColumn() == column + i){
                            available = false;
                            break;
                        }
                    }
                    if(!available) break;
                }
            } else {
                for( Boat boat : boats){
                    for( int j = 0; j < boat.getLength(); j++){
                        if(boat.getDirection() == 0 &&
                                boat.getStartRow() == row + i &&
                                boat.getStartColumn() + j == column){
                            available = false;
                            break;
                        } else if(boat.getStartRow() + j == row + i &&
                            boat.getStartColumn() == column){
                            available = false;
                            break;
                        }
                        if(!available) break;
                    }
                }
            }
            if(!available) break;
        }
        return available;
    }

}
