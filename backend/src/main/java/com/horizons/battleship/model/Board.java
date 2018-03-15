package com.horizons.battleship.model;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.ArrayList;
import java.util.List;

@Component
public class Board {
    @Id
    @GeneratedValue
    private Integer id;
    private Integer player;
    private String type;
    private Integer [][] tiles = new Integer[10][10];
    private List<Boat> boats = new ArrayList<>();


    @Id
    @GeneratedValue
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPlayer() {
        return player;
    }

    public void setPlayer(Integer player) {
        this.player = player;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer[][] getTiles() {
        return tiles;
    }

    public void setTiles(Integer[][] tiles) {
        this.tiles = tiles;
    }

    public List<Boat> getBoats() {
        return boats;
    }

    public void setBoats(List<Boat> boats) {
        this.boats = boats;
    }
}
