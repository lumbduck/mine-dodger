import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { newGame } from './actions';
import { getBoard, getGame, getBoardDimensionsFromGame } from './selectors';
import Board from './board';
import SettingsPanel from './settingsPanel';

const GameContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

// TODO: Figure out how to make  min width prevent the board rows from wrapping
const boardAreaCreator = boardWidth => styled.div`
    display: inline;
    min-width: ${boardWidth};
`;

const SideBarContainer = styled.div`
    margin-left: 25px;
    display: inline;
`;

const Game = ({ board, boardDimensions, newGame }) => {
    if (!board || board.length === 0){
        // No game found in local storage; need to create one
        useEffect(() => {
            newGame();
        }, []);
    }

    const BoardArea = boardAreaCreator(boardDimensions[0]);

    return (
        <div>
            <h2>Copyright Dodger!</h2>
            <GameContainer>
                <BoardArea>
                    <div>
                        <h4>Reveal the board, but don't step on the copyrights!</h4>
                        <Board />
                    </div>
                </BoardArea>
                <SideBarContainer>
                    <h3>Controls</h3>
                    <SettingsPanel />
                </SideBarContainer>
            </GameContainer>
        </div>
    );
};

const mapStateToProps = state => ({
    board: getBoard(state),
    boardDimensions: getBoardDimensionsFromGame(getGame(state))
})

const mapDispatchToProps = dispatch => ({
    newGame: () => dispatch(newGame()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
