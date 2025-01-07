const game = (function () {
    const gameBoard = (function () {
        // Tic-Tac-Toe board displayed as array of rows (2D array)
        const gameBoard = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        
        function placeSymbol(gridRow, gridIndex, symbol) {
            if (gridRow < 0 || gridRow > 2 || gridIndex < 0 || gridIndex > 2) {
                console.log('Invalid grid cords entered: outside of range')
                return false;
            }
            if (gameBoard[gridRow][gridIndex] !== null) {
                console.log('Invalid grid cords entered: grid already occupied')
                return false;
            }

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
        const result = {getName, getSymbol};

        if (Player1) Player2 = result;  
        else {
            Player1 = result;
            turn = Player1;
        }
    } 

    // Initialize starting variables
    let Player1;
    let Player2;
    let turn;
    let turnCount = 0;
    let winner = null;

    const getPlayerTurn = () => turn;

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
            console.log('Error placing symbol');
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
                if (!(board[1][1] === symbol)) return false;
                
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
        retrieveBoard: gameBoard.retrieveBoard,
        getPlayerTurn,
        createPlayer 
    }
})();


const displayController = (function () {
    const $board = document.querySelector('table');
    
    function drawBoard() {
        const board = game.retrieveBoard();
        const $turn = document.querySelector('.turn');
        $board.innerHTML = '';

        $turn.innerText = `It's ${game.getPlayerTurn().getName()}'s turn!`

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

    const $p1Form = document.querySelector('#p1');
    const $p2Form = document.querySelector('#p2');

    $p1Form.addEventListener("submit", submitHandler);
    $p2Form.addEventListener("submit", submitHandler);
    
    function submitHandler(event) {
        event.preventDefault();

        const name = event.target.querySelector('input[type="text"]').value;
        const symbol = event.target.querySelector('input[type="radio"]:checked').value;
        
        if (event.target.id === 'p1') {
            $p2Form.parentElement.classList.add('active');
            game.createPlayer(name, symbol);
            $p2Form.querySelector(`.${game.getPlayerTurn().getSymbol()}`).disabled = true;
            $p2Form.querySelector(`input[type="radio"]`).checked = false;

            event.target.parentElement.remove();
        }
        if (event.target.id === 'p2') {
            // Prevents user from submitting a p2 without a p2 present
            if (!game.getPlayerTurn()) return;
            
            // Prevents player 2 from picking same symbol
            if (symbol === game.getPlayerTurn().getSymbol()) return;

            document.querySelector('.players-container').remove();
            game.createPlayer(name, symbol);
            drawBoard();
        }
    }
})();