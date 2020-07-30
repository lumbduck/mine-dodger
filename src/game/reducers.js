import * as actions from './actions';
import {
    getBoardFromGame,
    getHistoryFromGame,
    getRedoHistoryFromGame,
    getSettingsFromGame,
    getBoardDimensionsFromGame
} from './selectors';

const difficultyLevels = {
    EASY: {
        difficulty: 'Easy',
        boardHeight: 10,
        boardWidth: 10,
        minePercentage: 15,
    },
    MEDIUM: {
        difficulty: 'Medium',
        boardHeight: 15,
        boardWidth: 20,
        minePercentage: 15,
    },
    HARD: {
        difficulty: 'Hard',
        boardHeight: 20,
        boardWidth: 30,
        minePercentage: 15,
    },
};

const initialGameState = {
    settings: difficultyLevels['MEDIUM'],
    lastCoords: [null, null],  // Only used for highlighting which bomb exploded during loss
    gameResult: 0,  // 0 for no result, 1 for a win, -1 for a loss
    history: [],
    redoHistory: [],
    board: [],
};

export const game = (gameState=initialGameState, action) => {
    const { type, payload } = action;

    switch (type) {
        case actions.SET_DIFFICULTY: {
            const { level } = payload;

            return {
                ...gameState,
                settings: difficultyLevels[level.toUpperCase()],
            }
        }

        case actions.REVEAL_ALL_SQUARES: {
            const board = getBoardFromGame(gameState);

            return {
                ...gameState,
                history: getHistoryFromGame(gameState).concat(board),
                redoHistory: [],
                board: board.map(
                    row => row.map(
                        square => ({
                            ...square,
                            isRevealed: true,
                        })
                    )
                ),
            }
        }

        case actions.UNDO: {
            const history = getHistoryFromGame(gameState);
            if (history.length === 0) {
                return gameState;
            }

            return {
                ...gameState,
                gameResult: 0,
                board: history[history.length - 1],
                history: history.slice(0, history.length - 1),
                redoHistory: [getBoardFromGame(gameState), ...getRedoHistoryFromGame(gameState)],
            }
        }

        case actions.REDO: {
            const redoHistory = getRedoHistoryFromGame(gameState);
            if (redoHistory.length === 0) {
                return gameState;
            }

            return {
                ...gameState,
                gameResult: 0,
                board: redoHistory[0],
                history: [...getHistoryFromGame(gameState), getBoardFromGame(gameState)],
                redoHistory: redoHistory.slice(1),
            }
        }

        case actions.NEW_GAME: {
            const settings = getSettingsFromGame(gameState);
            const { boardHeight, boardWidth, minePercentage } = settings;

            // random bombs in single array
            const randomized = Array.from(Array(boardHeight * boardWidth)).map(
                (_, i) => ({
                    content: Math.random() * 100 >= minePercentage ? 0 : 1,
                    isRevealed: false,
                    flag: 0,
                    skirtedCopyrights: null,
                    id: i,
                })
            );
            // map to grid
            const board = Array.from(Array(boardHeight)).map(
                (_, i) => randomized.slice(i * boardWidth, (i + 1) * boardWidth).map(
                    (square, j) => ({
                        ...square,
                        coords: [i, j],
                    })
                )
            );
            return {
                ...initialGameState,
                settings,
                board,
            };
        }

        case actions.RESTART_GAME: {
            const history = getHistoryFromGame(gameState);
            const settings = getSettingsFromGame(gameState);
            if (history.length === 0) {
                return gameState;
            }

            return {
                ...initialGameState,
                settings,
                board: history[0],
            }
        }

        case actions.CLICK_SQUARE: {
            // TODO: Factor some of this out into functions for readability, especially boundary search
            if (gameState.gameResult !== 0) {
                // TODO: Get side effect out of the reducer.
                //       Replace it with something marginally aesthetically pleasing. Need same effect for won games.
                alert("Game is over. Please choose another option.")
                return gameState;
            }

            const { coords } = payload;
            const board = getBoardFromGame(gameState);
            const history = getHistoryFromGame(gameState);

            const [i, j] = coords
            const square = board[i][j];
            const { boardHeight, boardWidth } = getBoardDimensionsFromGame(gameState);

            let skirtedCopyrights = null;
            let boundary = {};

            if (square.content === 0) {
                // This is not a bomb, so count the adjacent copyrights
                for (let m = -1; m < 2; m++) {
                    for (let n = -1; n < 2; n++) {
                        if (m === 0 && n === 0) {
                            continue;
                        } else {
                            const x = i + m;
                            const y = j + n;
                            if (x >= 0 && y >= 0 && x < boardHeight && y < boardWidth) {
                                const neighbor = board[x][y];
                                boundary[neighbor.id] = neighbor;
                                skirtedCopyrights += neighbor.content;
                            }
                        }
                    }
                }
            }

            // Get a new board with the clicked square revealed
            const newBoard = board.map(
                (row, i) => i !== coords[0] ? row : row.map(
                    (square, j) => j !== coords[1] ? square : {
                        ...square,
                        skirtedCopyrights,
                        isRevealed: true,
                    }
                )
            );

            if (square.content === 1) {
                // Hit a bomb, game over
                return {
                    ...gameState,
                    gameResult: -1,
                    lastCoords: coords,
                    history: [...history, board],
                    redoHistory: [],
                    board: newBoard,
                };

            } else if (skirtedCopyrights === 0) {
                // Reveal boundary squares until no more adjacent zeros (breadth-first)
                // (This is by far the ugliest code in this game... Enjoy.)

                while (Object.keys(boundary).length > 0) {
                    let nextBoundary = {};

                    for (const square of Object.values(boundary)) {
                        if (square.isRevealed || square.flag === 1 || square.content === 1) {
                            continue;
                        }

                        let thisSkirtedCopyrights = 0;
                        const thisSquareBoundary = {};

                        const [ i, j ] = square.coords;

                        for (let m = -1; m < 2; m++) {
                            const x = i + m; // row x
                            if (x < 0 || x >= boardHeight) {
                                // Row is outside board dimensions
                                continue;
                            }

                            // Copy row x before mutating it
                            newBoard[x] = newBoard[x].slice();

                            for (let n = -1; n < 2; n++) {
                                if (m === 0 && n === 0) {
                                    // Do not count the current square in its own boundary
                                    continue;

                                } else {
                                    const y = j + n; // column y
                                    if (y >= 0 && y < boardWidth) {
                                        // Count this square if it's a bomb
                                        const neighbor = newBoard[x][y];

                                        if (neighbor.content === 1) {
                                            thisSkirtedCopyrights += 1;
                                        };

                                        if (!boundary[neighbor.id] ?? (!neighbor.isRevealed && neighbor.flag !== 1)) {
                                            // Square has never been revealed or processed, so goes into the next batch
                                            thisSquareBoundary[neighbor.id] = neighbor;
                                        }
                                    }
                                }
                            }
                        }

                        newBoard[i][j] = {
                            ...square,
                            isRevealed: true,
                            skirtedCopyrights: thisSkirtedCopyrights,
                        };

                        if (thisSkirtedCopyrights === 0) {
                            nextBoundary = {
                                ...nextBoundary,
                                ...thisSquareBoundary,
                            };
                        }
                    }
                    boundary = nextBoundary;
                }
            }

            // test win conditions
            let gameResult = 1;
            outerLoop:
            for (const row of newBoard) {
                for (const square of row) {
                    if (square.content === 0 && !square.isRevealed) {
                        gameResult = 0;
                        break outerLoop;
                    }
                }
            }

            // Finished processing CLICK_SQUARE
            return {
                ...gameState,
                gameResult,
                lastCoords: coords,
                history: [...history, board],
                redoHistory: [],
                board: newBoard,
            };
        }

        case actions.RIGHT_CLICK_SQUARE: {
            const { coords } = payload;
            const board = getBoardFromGame(gameState);
            const history = getHistoryFromGame(gameState);

            return {
                ...gameState,
                lastCoords: coords,
                history: [...history, board],
                redoHistory: [],
                board: board.map(
                    (row, i) => i !== coords[0] ? row : row.map(
                        (square, j) => j !== coords[1] ? square : {
                            ...square,
                            flag: square.flag < 2 ? square.flag + 1 : 0,
                        }
                    )
                )
            };
        }

        default:
            return gameState;
    }
};
