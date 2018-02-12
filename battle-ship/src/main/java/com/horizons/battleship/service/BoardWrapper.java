package com.horizons.battleship.service;

import com.horizons.battleship.model.Board;

import java.util.ArrayList;
import java.util.List;

public class BoardWrapper {
    private List<Board> boards = new ArrayList<>();
    private boolean success;
    private String errorMessage;

    public List<Board> getBoards() {
        return boards;
    }

    public void setBoards(List<Board> boards) {
        this.boards = boards;
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
