import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getBoard } from './selectors';
import { clickSquare, rightClickSquare } from './actions';
import GridSquare from './gridSquare';

const BoardContainer = styled.span`
    display: inline-block;
`;

const BoardRowContainer = styled.div`
    display: block;
    clear: both;
    // content: "";
    display: table;
    width:
`;

const Board = ({
    board,
    revealSquare,
    flagSquare,
}) => {

    return <BoardContainer>
            {board.map((row, i) => (
                <BoardRowContainer key={i}>
                    {row.map((square, j) => {
                        const { isRevealed, flag, content, skirtedCopyrights, coords, id } = square;
                        return <GridSquare
                            isRevealed={isRevealed}
                            flag={flag}
                            content={content}
                            skirtedCopyrights={skirtedCopyrights}
                            revealSquare={revealSquare}
                            flagSquare={flagSquare}
                            coords={coords}
                            id={id}
                            key={j}/>
                        }
                    )}
                </BoardRowContainer>
            ))}
        </BoardContainer>
};

const mapStateToProps = (state) => ({
    board: getBoard(state),
});

const mapDispatchToProps = dispatch => ({
    revealSquare: coords => dispatch(clickSquare(coords)),
    flagSquare: coords => dispatch(rightClickSquare(coords))
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
