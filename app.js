const ConnectFour = () => {
    const [board, setBoard] = React.useState(Array(6).fill(null).map(() => Array(7).fill(null)));
    const [currentPlayer, setCurrentPlayer] = React.useState('R');
    const [winner, setWinner] = React.useState(null);
    const [drops, setDrops] = React.useState(0);
    const [dropping, setDropping] = React.useState({ column: null, row: null });

    const dropPiece = (columnIndex) => {
        if (winner) return;

        const newBoard = board.map(row => row.slice());
        for (let row = 5; row >= 0; row--) {
            if (!newBoard[row][columnIndex]) {
                newBoard[row][columnIndex] = currentPlayer;
                setDropping({ column: columnIndex, row: row });
                setBoard(newBoard);
                checkWinner(newBoard, currentPlayer);
                setCurrentPlayer(currentPlayer === 'R' ? 'Y' : 'R');
                setTimeout(() => {
                    setDropping({ column: null, row: null });
                }, 1000);
                break;
            }
        }
        setDrops(drops => {
            const newDrops = drops + 1;
            if (newDrops === 6 * 7) {
                setWinner('D');
            }
            return newDrops;
        });
    };

    const checkWinner = (board, player) => {
        const directions = [
            { x: 1, y: 0 }, // horizontal
            { x: 0, y: 1 }, // vertical
            { x: 1, y: 1 }, // diagonal \
            { x: 1, y: -1 } // diagonal /
        ];

        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                if (board[row][col] === player) {
                    for (const { x, y } of directions) {
                        if (checkDirection(board, row, col, x, y, player)) {
                            setWinner(player);
                            return;
                        }
                    }
                }
            }
        }
    };

    const checkDirection = (board, row, col, x, y, player) => {
        let count = 0;
        for (let i = 0; i < 4; i++) {
            const newRow = row + i * y;
            const newCol = col + i * x;
            if (newRow < 0 || newRow >= 6 || newCol < 0 || newCol >= 7 || board[newRow][newCol] !== player) {
                break;
            }
            count++;
        }
        return count === 4;
    };

    const resetGame = () => {
        setBoard(Array(6).fill(null).map(() => Array(7).fill(null)));
        setCurrentPlayer('R');
        setWinner(null);
        setDrops(0);
    };

    return (
        <div className="connect-four">
            <h1>Connect 4</h1>
            <div className="board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, colIndex) => (
                            <div
                                key={colIndex}
                                className="cell"
                                onClick={() => dropPiece(colIndex)}
                            >
                                {cell && <div className={`chip ${cell}`}></div>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="status">
                {!winner && (
                    <div className="current-player">
                        <h2>Current Player:</h2>
                        <div className={`which-player ${currentPlayer}`}>
                            <div className={`player-circle ${currentPlayer}`}></div>
                            {currentPlayer === 'R' ? 'PLAYER 1' : 'PLAYER 2'}
                        </div>
                    </div>
                )}
                {winner && (
                    <div className="winner">
                        {winner !== "D" ? (
                            <div>
                                <h1>Winner:</h1>
                                <div className={`which-player ${winner}`}>
                                    <div className={`player-circle ${winner}`}></div>
                                    {winner === 'R' ? 'PLAYER 1' : 'PLAYER 2'}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h1>Draw!</h1>
                            </div>
                        )}
                        <button className="reset-button" onClick={resetGame}>Reset Game</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Render the ConnectFour component
ReactDOM.render(<ConnectFour />, document.getElementById('root'));
