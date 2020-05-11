/*----- constants -----*/
const playerLookup = {
    '1': 'Player 1',
    '-1': 'Opponent',
    'null': 'transparent' 
  };
const pieces = [5, 4, 3, 3, 2];
const compPieces = [2, 3, [2 + 1], 4, 5];
const numOfArrays = 9;
const xCoordinates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const yCoordinates = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

/*----- app's state (variables) -----*/



let player = {
    playerBoard: [],
    playerAttempts: []
};

let opponent = {
    compBoard: [],
    compAttempts: []
};

let turn;
let winner;

let allPiecesSet;
let hitFive = [];
let hitFour = [];
let hitFirstThree = [];
let hitSecondThree = [];
let hitTwo = [];


/*----- cached element references -----*/

let msgEl = document.getElementById('main-title');
let guessEl = document.getElementById('guess');
let playerGuessEl = document.getElementById('message');

/*----- event listeners -----*/
$('#last').click(function(evt){
    $("#shot").prop('disabled', false);
    allPiecesSet = true;
})

$('#randomize').click(function(evt){
    $("#set-board > div:not(:last)").hide();
    $("#shot").prop('disabled', false);
    allPiecesSet = true;
    autoSetBoard(player.playerBoard);
    renderPlayerBoard();
    $('#randomize').hide();
})

$('#set-board').on('click', 'button', function(evt) {
    $('#randomize').hide();
    let $a;
    let $b; 
    let $c; 
    let nums;
    let piece;
    let shipPlaced = false;

    $a = yCoordinates.indexOf($(this).closest('div').find('input[class="number"]').val());
    $b = xCoordinates.indexOf($(this).closest('div').find('input[class="letter"]').val().toUpperCase());
    $c = parseInt($(this).closest('div').find('input[class="direction"]').val());
    
    piece = (parseInt($(this).closest('div').attr('class')));
    
    let valid = validateInput($a, $b, $c);
    if (valid === true){
        nums = [$a, $b, $c];
    } else if (valid === false){
        alert('Please submit a valid input');
        $(this).closest('div').find('input').attr("val", "");
    }
    
    let avail = checkSpace(player.playerBoard, piece, nums);
    
    if (avail === true) {
        setPiece(player.playerBoard, piece, nums);

        shipPlaced = true;
    } else if (avail === false) {
        alert(`Hmmm... it looks like there's a ship there already!`);
        $(this).closest('div').find('input').attr("val", "");
    }

    if (shipPlaced === true) {
        renderPlayerBoard();
        $(this).closest('div').hide();
        $(this).closest('div').next().show();
    }
})


$('#shot').click(function(evt) {
    let $a;
    let $b; 

    $a = yCoordinates.indexOf($(this).closest('div').find('input[class="number"]').val());
    $b = xCoordinates.indexOf($(this).closest('div').find('input[class="letter"]').val().toUpperCase());

   // console.log($a, $b);
   // console.log(typeof $a, typeof $b);

    let valid = validateInput($a, $b, 1);
    if (valid === true){
        takeShot($a, $b, player.playerAttempts, opponent.compBoard);
        turn *= -1;
    } else if (valid === false){
        alert('Please submit a valid input');
        $(this).closest('div').find('input').attr("val", "");
    }
    render();
})



/*----- functions -----*/



function init() {
    // playerScore.playerBoard = [
    //     [null, null, null, null, null, null, null, null, null, null, null], 
    //     [null, null, null, null, null, null, null, null, null, null, null],
    //     [null, null, null, null, null, null, null, null, null, null, null],
    //     [null, null, null, null, null, null, null, null, null, null, null],
    //     [null, null, null, null, null, null, null, null, null, null, null],
    //     [null, null, null, null, null, null, null, null, null, null, null],
    //     [null, null, null, null, null, null, null, null, null, null, null],
    //     [null, null, null, null, null, null, null, null, null, null, null],
    //     [null, null, null, null, null, null, null, null, null, null, null]
      //];
    
    

      player = {
        shots: 0,
        hits: 0,
        misses: 0, 
        playerBoard: [
            [null, null, null, null, null, null, null, null, null, null, null], 
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null]
        ], 
        playerAttempts: [
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null]
        ]
    };
    opponent = {
        shots: 0,
        hits: 0,
        misses: 0,
        compBoard: [
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null]
        ],
        compAttempts: [
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null]
        ]
    };
    turn = 1;
    winner = 0;
    allPiecesSet = false;
    renderPlayerBoard();
    
    $("#set-board > div:not(:first)").hide();
    $("#shot").prop('disabled', true);

    autoSetBoard(opponent.compBoard);

    //render();
    
}


function generateRand(){
    let a = Math.floor(Math.random() * 9); // will return 0 - 8; this chooses which array on compBoard
    let b = Math.floor(Math.random() * 11); // will return 0-10; this chooses which item on array[a] on compBoard
    let c = Math.floor(Math.random() * 2) + 1; // will return either 1 (horizontal) or 2 (vertical)
    return [a, b, c];
}

function checkSpace(board, piece, nums){
    let a = nums[0]; 
    let b = nums[1]; 
    let direction = nums[2];
    let potentialPlacement = [];
    if (direction === 1 && (board[a].length - b) >= piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(board[a][b + i]);
        }
    } else if (direction === 1 && (board[a].length - b) < piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(board[a][b - i]);
        } 
    } else if (direction === 2 && (numOfArrays - a) >= piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(board[a + i][b]);
        } 
    } else if (direction === 2 && (numOfArrays - a) < piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(board[a - i][b]);
        } 
    } else {
            console.log('error');
        }
    return potentialPlacement.every(square => square === null);
}

function setPiece(board, piece, nums){
    let a = nums[0]; 
    let b = nums[1];
    let direction = nums[2];
    if (direction === 1 && (board[a].length - b) >= piece) {
        for (let i = 0; i < piece; i++) {
            board[a][b + i] = piece + compPieces.indexOf(piece);
        }
    } else if (direction === 1 && (board[a].length - b) < piece) {
        for (let i = 0; i < piece; i++) {
            board[a][b - i] = piece + compPieces.indexOf(piece);
        } 
    } else if (direction === 2 && (numOfArrays - a) >= piece) {
        for (let i = 0; i < piece; i++) {
            board[a + i][b] = piece + compPieces.indexOf(piece);
        } 
    } else if (direction === 2 && (numOfArrays - a) < piece) {
        for (let i = 0; i < piece; i++) {
            board[a - i][b] = piece + compPieces.indexOf(piece);
        } 
    }
}

function attemptPlaceShip(board, piece){
    let nums = generateRand(); 
    let avail = checkSpace(board, piece, nums); 
    if (avail === true) {
        setPiece(board, piece, nums);
    } else if (avail === false) {
        attemptPlaceShip(board, piece);
    } 
}
function autoSetBoard(board){
    compPieces.forEach(function(piece) {
        attemptPlaceShip(board, piece);
    });
}
function validateInput($a, $b, $c){
    if ($a >= 0 && $a <= 8 && 
        $b >= 0 && $b <= 10 && 
        $c >= 1 && $c <= 2 && 
        Number.isInteger($a) === true && 
        Number.isInteger($b) === true && 
        Number.isInteger($c) === true) {
            return true;
        } else {
            return false;
        }
}

function takeShot($a, $b, attemptBoard, targetBoard){
    let val = targetBoard[$a][$b];
    if (val === 9) {
        targetBoard[$a][$b] += 1;
        hitFive.push(val);
        checkPlayerWinner(val); 

        player.shots += 1;
        player.hits += 1;
        attemptBoard[$a][$b] = targetBoard[$a][$b];

    } else if (val === 7) {

        targetBoard[$a][$b] += 1;
        hitFour.push(val);
        checkPlayerWinner(val);

        player.shots += 1;
        player.hits += 1;
        attemptBoard[$a][$b] = targetBoard[$a][$b];

    } else if (val === 4) {
   
        targetBoard[$a][$b] += 1;
        hitFirstThree.push(val);
        checkPlayerWinner(val);
        player.shots += 1;
        player.hits += 1;
        attemptBoard[$a][$b] = targetBoard[$a][$b];

    } else if (val === "32") {
     
        targetBoard[$a][$b] += 1;
        hitSecondThree.push(val);
        checkPlayerWinner(val);
        player.shots += 1;
        player.hits += 1;
        attemptBoard[$a][$b] = targetBoard[$a][$b];

    } else if (val === 2) {

        targetBoard[$a][$b] += 1;
        hitTwo.push(val);
        checkPlayerWinner(val);
        player.shots += 1;
        player.hits += 1;
        attemptBoard[$a][$b] = targetBoard[$a][$b];

    } else if (val === null) {

        targetBoard[$a][$b] = -1;
        player.shots += 1;
        player.misses += 1;
        attemptBoard[$a][$b] = -1;

    } else {
        turn *= -1
        alert('already guessed there');
    }
}

function checkPlayerWinner(val){
    if (hitFive.length === 5 && hitFour.length === 4 && hitFirstThree.length === 3 && hitSecondThree.length === 3 && hitTwo.length === 2){
        alert('YOU WIN!! You sunk all battleships!');
    }
    else if (val === 9){
        if (hitFive.length >= 5){
            alert(`You sunk your opponent's battleship!`)
        }
    } else if (val === 7){
        if (hitFour.length >= 4){
            alert(`You sunk your opponent's battleship!`)
        }
    } else if (val === 4){
        if (hitFirstThree.length >= 3){
            alert(`You sunk your opponent's battleship!`)
        }
    } else if (val === "32"){
        if (hitSecondThree.length >= 3){
            alert(`You sunk your opponent's battleship!`)
        }
    } else if (val === 2){
        if (hitTwo.length >= 2){
            alert(`You sunk your opponent's battleship!`)
        }
    } else {
        //console.log('no sunk ship yet')
    }
}

function checkWinner(board){
    let hitArray = [];
    board.forEach(function(row){
        row.forEach(function(space){
            if (space === 2){
                hitArray.push(space);
            }
        })
    })
    //console.log(hitArray.length);
    if (hitArray.length === 17){
        alert('game over!');
    }
}

function renderPlayerBoard() {
    // $("#playerBoard > #E1 > div").css('background-color', 'red');
    // $("#E1").css('background-color', 'gray');
    let rowId = -1;
    player.playerBoard.forEach(function(row){
        let cellId = -1;
        rowId+= 1;
        row.forEach(function(cell){
            cellId+= 1;
            // console.log(xCoordinates[cellId],yCoordinates[rowId]);
        if (cell >= 1){
            $(`#${xCoordinates[cellId]}${yCoordinates[rowId]}`).css('background-color', 'gray');
            // const thisCell = document.getElementById(`${xCoordinates[cellId]}${yCoordinates[rowId]}`)
            // thisCell.style.backgroundColor = "gray";
        } if (cell === 10 || cell === 8 || cell === 5 || cell === "321" || cell === 3){
            $(`#playerBoard > #${xCoordinates[cellId]}${yCoordinates[rowId]} > div`).css('background-color', 'red');
            $(`#playerBoard > #${xCoordinates[cellId]}${yCoordinates[rowId]}`).css('background-color', 'gray');
        } if (cell === -1){
            $(`#playerBoard > #${xCoordinates[cellId]}${yCoordinates[rowId]} > div`).css('background-color', 'white');
        } 
    
    })
  })
}

function renderPlayerAttempts() {
    // $("#playerBoard > #E1 > div").css('background-color', 'red');
    // $("#E1").css('background-color', 'gray');
    let rowId = -1;
    player.playerAttempts.forEach(function(row){
        let cellId = -1;
        rowId+= 1;
        row.forEach(function(cell){
            cellId+= 1;
            // console.log(xCoordinates[cellId],yCoordinates[rowId]);
        if (cell === 10 || cell === 8 || cell === 5 || cell === "321" || cell === 3){
            $(`#playerAttempts > #${xCoordinates[cellId]}${yCoordinates[rowId]} > div`).css('background-color', 'red');
        } if (cell === -1){
            $(`#playerAttempts > #${xCoordinates[cellId]}${yCoordinates[rowId]} > div`).css('background-color', 'white');
        } 
    })
  })
}





function compShot(){ 
    if (turn === -1) {
    let $a = Math.floor(Math.random() * 9); 
    let $b = Math.floor(Math.random() * 11);
  
    let val = player.playerBoard[$a][$b];


    if (val === 1) {
        player.playerBoard[$a][$b] = 2;
        // console.log(playerBoard);
        opponent.shots += 1;
        opponent.hits += 1;
        opponent.compAttempts[$a][$b] = 2;
       
        // console.log(playerAttempts);
        // checkWinner(playerBoard);
        turn *= -1;
        render();

    } else if (val === null) {
        guessEl.innerHTML = '<i>miss</i>';
        //console.log('miss');
        player.playerBoard[$a][$b] = -1;
        // console.log(playerBoard);
        opponent.shots += 1;
        opponent.misses += 1;
        opponent.compAttempts[$a][$b] = -1;
     
        // console.log(playerAttempts);

        turn *= -1;
        render();
    } else if (val === -1 || val === 2) {
        compShot(); 
        console.log('recursion');
    // console.log(compAttempts);
    // console.log(playerBoard);
    }
}
}

function render() {
    //console.log(turn);
    renderPlayerAttempts();
    renderPlayerBoard();

    $('#opponent-shots').text(`Opponent's Shots: ${opponent.shots}`);
    $('#opponent-hits').text(`Opponent's Hits: ${opponent.hits}`);
    $('#opponent-misses').text(`Opponent's Misses: ${opponent.misses}`);

    $('#player-shots').text(`Player's Shots: ${player.shots}`);
    $('#player-hits').text(`Player's Hits: ${player.hits}`);
    $('#player-misses').text(`Player's Misses: ${player.misses}`);


    if (allPiecesSet === true){
    msgEl.textContent = `${playerLookup[turn]}'s Shot`;
    }    
    if (turn === -1) {
        $("#guess").show();
        $("#message").hide();
        compShot();
    }
    else if (turn === 1) {
        $("#guess").hide();
        $("#message").show();
        playerGuessEl.innerHTML = 'Bombs away';

    }
}
















init();
//console.log(checkSpace(5, [6, 0, 2]));
//console.log(compBoard[0][1]);
// setPiece(5, [0, 0, 2]);
// console.log(generateRand());
// attemptPlaceShip(5);
// compShot();
// renderPlayerBoard();
//console.log(compBoard);
// checkWinner(compBoard);
