package com.horizons.battleship.service;

import com.horizons.battleship.model.Game;

import java.util.ArrayList;
import java.util.List;

public class GameWrapper {
    private List<Game> games = new ArrayList<>();
    private boolean success;
    private String errorMessage;

    public List<Game> getGames() {
        return games;
    }

    public void setGames(List<Game> games) {
        this.games = games;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
