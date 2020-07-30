import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { setDifficulty, newGame, restartGame, revealAllSquares, undo, redo } from './actions';
import { getSettings, getHistory, getRedoHistory } from './selectors';

const SettingsPanelContainer = styled.div`
    margin-left: 20px;
`;

const SettingsButton = styled.button`
    background-color: #99ccff;
    font-size: 16px;
    padding: 8px;
    border: none;
    border-radius: 8px;
    outline: none;
    cursor: pointer;
    display: block;
    margin-right: 8px;
    margin-bottom: 2px;
    width: 150px;
    user-select: none;
`;

const SettingsSelect = styled.select`
    font-size: 16px;
    padding: 8px;
    border: 1px solid #99ccff;
    border-radius: 8px;
    outline: none;
    cursor: pointer;
    display: block;
    margin-right: 8px;
    margin-bottom: 2px;
    width: 150px;
    user-select: none;
`;

const levels = ['Easy', 'Medium', 'Hard']

const SettingsPanel = ({
    history,
    redoHistory,
    difficulty,
    newGame,
    restartGame,
    revealGrid,
    undo,
    redo,
    setDifficulty,
}) => {
    const undoDisabled = history.length === 0;
    const redoDisabled = redoHistory.length === 0;

    return (
        <SettingsPanelContainer>
            <SettingsSelect
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}>
                    <option key={'set-level'} value={'set-level'} disabled>Set level...</option>
                    {levels.map(level => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
            </SettingsSelect>
            <SettingsButton onClick={newGame}>
                New game
            </SettingsButton>
            <SettingsButton onClick={restartGame}>
                Restart game
            </SettingsButton>
            <SettingsButton onClick={revealGrid}>
                Reveal grid
            </SettingsButton>
            <SettingsButton onClick={undo} disabled={undoDisabled}>
                Undo
            </SettingsButton>
            <SettingsButton onClick={redo} disabled={redoDisabled}>
                Redo
            </SettingsButton>
        </SettingsPanelContainer>
    )
};

const mapStateToProps = state => ({
    settings: getSettings(state),
    history: getHistory(state),
    redoHistory: getRedoHistory(state),
});

const mapDispatchToProps = dispatch => ({
    setDifficulty: level => dispatch(setDifficulty(level)),
    newGame: () => dispatch(newGame()),
    restartGame: () => dispatch(restartGame()),
    revealGrid: () => dispatch(revealAllSquares()),
    undo: () => dispatch(undo()),
    redo: () => dispatch(redo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPanel);
