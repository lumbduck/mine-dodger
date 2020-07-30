import React from 'react';
import styled from 'styled-components';

const BaseSquare = styled.button`
    height: 25px;
    width: 25px;
    float: left;
    font-size: 1.3em;
    line-height: 20px;
    padding: 0;
    text-align: center;
    outline: none;
    user-select: none;
  `;

const RevealedSquare = styled(BaseSquare)`
    background-color: #909090;
    border: 1px solid #707070;
    font-weight: 100;
`;

const ExplodedSquare = styled(RevealedSquare)`
    background-color: red;
    font-weight: bold;
`;

const BadFlaggedSquare = styled(RevealedSquare)`
    background-color: pink;
`;

const HiddenSquare = styled(BaseSquare)`
    background-color: darkgray;
    border-top: 2px solid lightgray;
    border-left: 2px solid lightgray;
    border-bottom: 3px solid gray;
    border-right: 3px solid gray;
`;

const flagChars = {
    0: '',
    1: '∆',
    2: '?',
};

const bombChar = '©';

const GridSquare = ({
    isRevealed,
    flag,
    content,
    skirtedCopyrights,
    coords,
    revealSquare,
    flagSquare,
    id,
}) => {
    const StyledSquare = isRevealed ? (content === 1 ? ExplodedSquare : RevealedSquare) : HiddenSquare ;
    return (
      <StyledSquare
        onClick={() => {
            if (!isRevealed && flag === 0) {
                return revealSquare(coords);
            }
        }}
        onContextMenu={(e) => {
            e.preventDefault();
            if (!isRevealed) {
                return flagSquare(coords);
            }
        }}>
        {isRevealed ? (content === 1 ? bombChar : (skirtedCopyrights > 0 ? skirtedCopyrights : '')) : flagChars[flag]}
      </StyledSquare>
    );
}

export default React.memo(GridSquare);
