const game = (function () {
    const gameBoard = (function () {
        const gameBoard = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        
        function placeSymbol(gridRow, gridIndex, symbol) {
            if (gridRow < 0 || gridRow > 2 || gridIndex < 0 || gridIndex > 2) {
                console.log('Invalid grid cords entered')
                return false;
            }

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
    let winner = null;

    function takeTurn(gridRow, gridIndex) {
        if (!winner && gameBoard.placeSymbol(gridRow, gridIndex, turn.getSymbol())) {
            turnCount++;
            checkEndConditions() ? gameOverHandler() : swapTurn();
            console.log(gameBoard.retrieveBoard());
        }
        else if (winner) {
            console.log('The game has ended already');
        }
        else {
            console.log('Grid cords unavailable');
        }
    }

    function swapTurn() {
        turn = turn === Player1 ? Player2 : Player1; 
    }

    function checkEndConditions() {
        if (turnCount <= 9 && checkWinCondition()) {
            winner = turn;
            return true;
        }
        else if (turnCount === 9) {
            winner = 'tie';
            return true;
        }
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

    function gameOverHandler() {
        if (winner === 'tie') {
            console.log("It's a tie!");
        }
        else if (typeof winner === 'object') {
            console.log(`${winner.getName()} has won!`);
        }
        else return false;
    }

    return { 
        takeTurn,
        retrieveBoard: gameBoard.retrieveBoard 
    }
})();

const displayController = (function () {
    const $board = document.querySelector('table');
    
    function drawBoard() {
        const board = game.retrieveBoard();
        $board.innerHTML = '';

        board.forEach((row, rowNum) => {
            const $row = document.createElement('tr');
            row.forEach((cell, columnNum) => {
                const $cell = document.createElement('td');
                $cell.innerText = cell;
                $cell.classList.add(cell ? cell : 'empty');
                $cell.dataset.row = rowNum;
                $cell.dataset.column = columnNum;
                $row.appendChild($cell);
            })
            $board.appendChild($row);
        });
    }

    $board.addEventListener('click', clickHandler);

    function clickHandler(e) {
        const row = e.target.dataset.row;
        const column = e.target.dataset.column;

        if (!row || !column || !e.target.classList.contains('empty')) return;

        game.takeTurn(row, column);
        drawBoard();
    }

    // Initial draw
    drawBoard();
})();