package com.horizons.battleship.model;

import org.springframework.stereotype.Component;

import javax.persistence.criteria.CriteriaBuilder;

@Component
public class Boat {
    private String name;
    private Integer length;
    private Integer startRow;
    private Integer startColumn;
    private Integer direction;
    private Integer hits = 0;
    private boolean sunk = false;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public boolean isSunk() {
        return sunk;
    }

    public void hitBoat(){
        if(getLength() > getHits()){
            hits++;
            sunk = hits == length  ? true : false;
        }
    }

    public Integer getStartRow() {
        return startRow;
    }

    public void setStartRow(Integer startRow) {
        this.startRow = startRow;
    }

    public Integer getStartColumn() {
        return startColumn;
    }

    public void setStartColumn(Integer startColumn) {
        this.startColumn = startColumn;
    }

    public Integer getDirection() {
        return direction;
    }

    public void setDirection(Integer direction) {
        this.direction = direction;
    }

    public Integer getHits() {
        return hits;
    }

    //    public void setSunk(boolean sunk) {
//        this.sunk = sunk;
//    }
}
