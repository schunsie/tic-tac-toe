const game = (function () {
    const gameBoard = (function () {
        const gameBoard = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        
        function placeSymbol(gridRow, gridIndex, symbol) {
            if (gameBoard[gridRow][gridIndex] !== null) return false;
            gameBoard[gridRow][gridIndex] = symbol;
            return true;
        }
    
        function retrieveBoard() {
            return gameBoard;
        }
    
        return { placeSymbol, retrieveBoard }
    })();

    function createPlayer(name, symbol) {
        const getName = () => name;
        const getSymbol = () => symbol;
    
        return { getName, getSymbol };
    } 

    const Player1 = createPlayer('Test1', 'X');
    const Player2 = createPlayer('Test2', 'O');
    let turn = Player1;
    let turnCount = 0;

    function takeTurn(gridRow, gridIndex) {
        if (gameBoard.placeSymbol(gridRow, gridIndex, turn.getSymbol())) {
            turnCount++;
            checkEndConditions() ? console.log(`${turn.getName()} has won!`) : swapTurn();
            console.log(gameBoard.retrieveBoard());
        }
    }

    function swapTurn() {
        turn = turn === Player1 ? Player2 : Player1; 
    }

    function checkEndConditions() {
        if (turnCount <= 9 && checkWinCondition()) return true;
        // else if (turnCount === 9) return 'tie';
        else return false;

        function checkWinCondition() {
            const board = gameBoard.retrieveBoard();
            
            // TODO: check win conditions
            if (checkRowWin() || checkColumnWin() || checkDiagonalWin()) return true;
            else return false;

            function checkRowWin() {
                for (const row of board) {
                    if (row.every(item => item === turn.getSymbol())) return true;
                }
                return false;
            }

            function checkColumnWin() {
                for (let column = 0; column < 3; column++) {
                    if (board.every(row => row[column] === turn.getSymbol())) return true;
                }

                return false;
            }

            function checkDiagonalWin() {
                const symbol = turn.getSymbol();
                if (!board[1][1] === symbol) return false;

                if (board[0][0] === symbol && board[2][2] === symbol) return true;
                else if (board[0][2] === symbol && board[2][0] === symbol) return true;
                return false;
            }
        }
    }

    return { takeTurn }
})();