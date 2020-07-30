import { createSelector } from 'reselect';

// root selectors
export const getGame = state => state.game;
export const getSettings = state => state.game.settings;
export const getBoard = state => state.game.board;
export const getHistory = state => state.game.history;
export const getRedoHistory = state => state.game.redoHistory;

// Selectors for `game` reducer
// This is overkill for this app, but helps to illustrate useful selector layering for a more complex model.
// (Should these go in the reducer file?)
export const getBoardFromGame = gameState => gameState.board;
export const getHistoryFromGame = gameState => gameState.history;
export const getRedoHistoryFromGame = gameState => gameState.redoHistory;
export const getSettingsFromGame = gameState => gameState.settings;

export const getBoardDimensionsFromGame = createSelector(
    [ getBoardFromGame ],
    board => {
        const boardHeight = board.length;
        const boardWidth = board[0].length;
        return { boardHeight, boardWidth }
    }
);
