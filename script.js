const game = (function () {
    const gameBoard = [
        null, null, null,
        null, null, null,
        null, null, null
    ]
    
    function takeTurn(gridNumber) {
        gameBoard[gridNumber] = turn.getSymbol();
        swapTurn()
    }
    
    function swapTurn() {
        turn = Player1 ? Player2 : Player1;
    }
    
    function retrieveBoard() {
        return gameBoard;
    }
    
    function createPlayer(name, symbol) {
        const getName = () => name;
        const getSymbol = () => symbol;
    
        return { getName, getSymbol };
    } 

    let Player1 = createPlayer('Test One', 'O');
    let Player2 = createPlayer('Test Two', 'X')
    let turn = Player1;

    return { takeTurn, retrieveBoard }
})();
