export const SET_DIFFICULTY = 'SET_DIFFICULTY';
export const setDifficulty = level => ({
    type: SET_DIFFICULTY,
    payload: { level },
});

export const NEW_GAME = 'NEW_GAME';
export const newGame = () => ({
    type: NEW_GAME,
});

export const RESTART_GAME = 'RESTART_GAME';
export const restartGame = () => ({
    type: RESTART_GAME,
});

export const CLICK_SQUARE = 'CLICK_SQUARE';
export const clickSquare = coords => ({
    type: CLICK_SQUARE,
    payload: { coords },
});

export const RIGHT_CLICK_SQUARE = 'RIGHT_CLICK_SQUARE';
export const rightClickSquare = coords => ({
    type: RIGHT_CLICK_SQUARE,
    payload: { coords },
});

export const REVEAL_ALL_SQUARES = 'REVEAL_ALL_SQUARES';
export const revealAllSquares = () => ({
    type: REVEAL_ALL_SQUARES,
});

export const UNDO = 'UNDO';
export const undo = () => ({
    type: UNDO,
});

export const REDO = 'REDO';
export const redo = () => ({
    type: REDO,
});
