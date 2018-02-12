package com.horizons.battleship.model;

import org.springframework.stereotype.Component;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Component
public class Game {
    @Id
    @GeneratedValue
    private Integer id;
    private boolean player1;
    private boolean player1ready;
    private boolean player2;
    private boolean player2ready;
    private List<Board> boards = new ArrayList<>();
    private Integer turn;
    private Integer status = 0;

    @Id
    @GeneratedValue
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public boolean isPlayer1() {
        return player1;
    }

    public void setPlayer1(boolean player1) {
        this.player1 = player1;
    }

    public boolean isPlayer2() {
        return player2;
    }

    public void setPlayer2(boolean player2) {
        this.player2 = player2;
    }

    public boolean isPlayer1ready() {
        return player1ready;
    }

    public void setPlayer1ready(boolean player1ready) {
        this.player1ready = player1ready;
    }

    public boolean isPlayer2ready() {
        return player2ready;
    }

    public void setPlayer2ready(boolean player2ready) {
        this.player2ready = player2ready;
    }

    @OneToMany
    public List<Board> getBoards() {
        return boards;
    }

    public void setBoards(List<Board> boards) {
        this.boards = boards;
    }

    public Integer getTurn() {
        return turn;
    }

    public void setTurn(Integer turn) {
        this.turn = turn;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
