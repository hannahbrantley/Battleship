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
let playerBoard = [];
let playerAttempts = [];
let compBoard = [];
let compAttempts = [];

let playerShots; 
let playerHits;
let playerMisses;

let compShots;
let compHits; 
let compMisses;

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



/*----- functions -----*/



function init() {
    playerBoard = [
        [null, null, null, null, null, null, null, null, null, null, null], 
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null]
      ];
    playerAttempts = [
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null]
      ];
    compBoard = [
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null]
      ];
    compAttempts = [
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null, null]
      ];
    playerShots = 0;
    playerHits = 0;
    playerMisses = 0;
    compShots = 0;
    compHits = 0; 
    compMisses = 0;  
    turn = 1;
    winner = 0;
    allPiecesSet = false;
    renderPlayerBoard();
    
    $("#trythis > div:not(:first)").hide();
    $("#shot").prop('disabled', true);

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
    let nums = generateRand(); // returns array
    let avail = checkSpace(board, piece, nums); // returns boolean
    //console.log(nums);
    //console.log(avail);
    // here we go
    if (avail === true) {
        //console.log(`piece:${piece} spot is available! setting piece`);
        setPiece(board, piece, nums);
        //console.log(compBoard);
    } else if (avail === false) {
        //console.log(`piece:${piece} nums:${nums} not available, re-trying`);
        attemptPlaceShip(board, piece);
    } 
}

function setCompBoard(board){
    compPieces.forEach(function(piece) {
        attemptPlaceShip(board, piece);
    });
}

function setPlayerBoard(){
    //pieces.forEach(function(piece){
        // get input A-K from player
    let a = document.getElementById("setpieceletter").value;
        // get input 1-9 from player
    let b = document.getElementById("setpiecenumber").value;
        // get direction from player
    let c = document.getElementById("setdirection").value;
    let nums = [a, b, c];
    // console.log(nums);
        // if (avail === true) {
        // } else if (avail === false) {
        //     alert(`looks like there is already a ship there`)
        // }
    //})
}

$('#last').click(function(evt){
    //console.log(evt);
    $("#shot").prop('disabled', false);
    allPiecesSet = true;
    // render();
    // console.log(allPiecesSet);
})

$('#randomize').click(function(evt){
    $("#trythis > div:not(:last)").hide();
    $("#guess").show();
    //console.log(evt);
    $("#shot").prop('disabled', false);
    allPiecesSet = true;
    // render();
    //console.log(allPiecesSet);
    setRandomPlayerBoard();
    $('#randomize').hide();
})

$('#trythis').on('click', 'button', function(evt) {
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
    
    // console.log(typeof $('#number').val());
   // console.log($(evt.currentTarget).closest('input').val());
   // console.log(piece, $a, $b, $c);
    // console.log(typeof $a, typeof $b, typeof $c);
    
    let valid = validateInput($a, $b, $c);
    if (valid === true){
        nums = [$a, $b, $c];
    } else if (valid === false){
        alert('Please submit a valid input');
        $(this).closest('div').find('input').attr("val", "");
    }
    
    
    let avail = checkSpace(playerBoard, piece, nums);
    
    if (avail === true) {
        setPiece(playerBoard, piece, nums);
        // console.log(playerBoard);
        shipPlaced = true;
    } else if (avail === false) {
        alert(`Hmmm... it looks like there's a ship there already!`);
        $(this).closest('div').find('input').attr("val", "");
    }

   // console.log(typeof shipPlaced);

    if (shipPlaced === true) {
        renderPlayerBoard();
        $(this).closest('div').hide();
        $(this).closest('div').next().show();
    }
})

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


$('#shot').click(function(evt) {
    let $a;
    let $b; 

    $a = yCoordinates.indexOf($(this).closest('div').find('input[class="number"]').val());
    $b = xCoordinates.indexOf($(this).closest('div').find('input[class="letter"]').val().toUpperCase());

   // console.log($a, $b);
   // console.log(typeof $a, typeof $b);

    let valid = validateInput($a, $b, 1);
   // console.log(valid);
    if (valid === true){
        takeShot($a, $b);
        turn *= -1;
    } else if (valid === false){
        alert('Please submit a valid input');
        $(this).closest('div').find('input').attr("val", "");
    }
    render();
})

function takeShot($a, $b){
    let val = compBoard[$a][$b];
    if (val === 9) {
        playerGuessEl.innerHTML = "<i>hit!</i>";
        compBoard[$a][$b] += 1;
        hitFive.push(val);
        checkPlayerWinner(val);
        // console.log(compBoard);
        playerShots += 1;
        playerHits += 1;
        playerAttempts[$a][$b] = 2;
        // console.log(playerShots, playerHits);
        // console.log(playerAttempts);
        // checkWinner(compBoard);
        // turn *= -1;
    } else if (val === 7) {
        playerGuessEl.innerHTML = "<i>hit!</i>";
        compBoard[$a][$b] += 1;
        hitFour.push(val);
        checkPlayerWinner(val);
        playerShots += 1;
        playerHits += 1;
        playerAttempts[$a][$b] = 2;
    } else if (val === 4) {
        playerGuessEl.innerHTML = "<i>hit!</i>";
        compBoard[$a][$b] += 1;
        hitFirstThree.push(val);
        checkPlayerWinner(val);
        playerShots += 1;
        playerHits += 1;
        playerAttempts[$a][$b] = 2;
    } else if (val === "32") {
        playerGuessEl.innerHTML = "<i>hit!</i>";
        compBoard[$a][$b] += 1;
        hitSecondThree.push(val);
        checkPlayerWinner(val);
        playerShots += 1;
        playerHits += 1;
        playerAttempts[$a][$b] = 2;
    } else if (val === 2) {
        playerGuessEl.innerHTML = "<i>hit!</i>";
        compBoard[$a][$b] += 1;
        hitTwo.push(val);
        checkPlayerWinner(val);
        playerShots += 1;
        playerHits += 1;
        playerAttempts[$a][$b] = 2;
    } else if (val === null) {
        playerGuessEl.innerHTML = "<i>miss</i>";
        compBoard[$a][$b] = -1;
        // console.log(compBoard);
        playerShots += 1;
        playerMisses += 1;
        playerAttempts[$a][$b] = -1;
        // console.log(playerShots, playerMisses);
        // console.log(playerAttempts);
        // turn *= -1;
    } else {
        turn *= -1
        alert('already guessed there');
        playerGuessEl.innerHTML = "<i>Youve already taken that shot</i>";
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
    playerBoard.forEach(function(row){
        let cellId = -1;
        rowId+= 1;
        row.forEach(function(cell){
            cellId+= 1;
            // console.log(xCoordinates[cellId],yCoordinates[rowId]);
        if (cell === 1){
            $(`#${xCoordinates[cellId]}${yCoordinates[rowId]}`).css('background-color', 'gray');
            // const thisCell = document.getElementById(`${xCoordinates[cellId]}${yCoordinates[rowId]}`)
            // thisCell.style.backgroundColor = "gray";
        } if (cell === 2){
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
    playerAttempts.forEach(function(row){
        let cellId = -1;
        rowId+= 1;
        row.forEach(function(cell){
            cellId+= 1;
            // console.log(xCoordinates[cellId],yCoordinates[rowId]);
        if (cell === 2){
            $(`#playerAttempts > #${xCoordinates[cellId]}${yCoordinates[rowId]} > div`).css('background-color', 'red');
        } if (cell === -1){
            $(`#playerAttempts > #${xCoordinates[cellId]}${yCoordinates[rowId]} > div`).css('background-color', 'white');
        } 
    })
  })
}





function compShot(){ 
    if (turn === -1) {
    let $a = Math.floor(Math.random() * 9); // array number
    let $b = Math.floor(Math.random() * 11); // index number // letter
    // console.log($a, $b);
    let val = playerBoard[$a][$b];
    guessEl.textContent = `Opponent's Shot: ${xCoordinates[$b]}${yCoordinates[$a]}`


    if (val === 1) {
        guessEl.innerHTML = '<i>hit</i>';
        //console.log('hit')
        playerBoard[$a][$b] = 2;
        // console.log(playerBoard);
        compShots += 1;
        compHits += 1;
        compAttempts[$a][$b] = 2;
        // console.log(playerShots, playerHits);
        // console.log(playerAttempts);
        // checkWinner(playerBoard);
        turn *= -1;
        render();

    } else if (val === null) {
        guessEl.innerHTML = '<i>miss</i>';
        //console.log('miss');
        playerBoard[$a][$b] = -1;
        // console.log(playerBoard);
        compShots += 1;
        compMisses += 1;
        compAttempts[$a][$b] = -1;
        // console.log(playerShots, playerMisses);
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

    $('#opponent-shots').text(`Opponent's Shots: ${compShots}`);
    $('#opponent-hits').text(`Opponent's Hits: ${compHits}`);
    $('#opponent-misses').text(`Opponent's Misses: ${compMisses}`);

    $('#player-shots').text(`Player's Shots: ${playerShots}`);
    $('#player-hits').text(`Player's Hits: ${playerHits}`);
    $('#player-misses').text(`Player's Misses: ${playerMisses}`);


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


function setRandomPiece(piece, nums){
    let a = nums[0]; // which array on compBoard
    let b = nums[1]; // which index in compBoard[a] array
    let direction = nums[2];
    // change nulls to 1
    if (direction === 1 && (playerBoard[a].length - b) >= piece) {
        for (let i = 0; i < piece; i++) {
            playerBoard[a][b + i] = 1;
        }
    } else if (direction === 1 && (playerBoard[a].length - b) < piece) {
        for (let i = 0; i < piece; i++) {
            playerBoard[a][b - i] = 1;
        } 
    } else if (direction === 2 && (numOfArrays - a) >= piece) {
        for (let i = 0; i < piece; i++) {
            playerBoard[a + i][b] = 1;
        } 
    } else if (direction === 2 && (numOfArrays - a) < piece) {
        for (let i = 0; i < piece; i++) {
            playerBoard[a - i][b] = 1;
        } 
    }
}

function attemptRandomPlaceShip(piece){
    let nums = generateRand(); // returns array
    let avail = checkSpace(playerBoard, piece, nums); // returns boolean
    //console.log(nums);
    //console.log(avail);
    // here we go
    if (avail === true) {
        //console.log(`piece:${piece} spot is available! setting piece`);
        setRandomPiece(piece, nums);
        //console.log(compBoard);
    } else if (avail === false) {
        //console.log(`piece:${piece} nums:${nums} not available, re-trying`);
        attemptRandomPlaceShip(piece);
    } 
}

function setRandomPlayerBoard(){
    pieces.forEach(function(piece) {
        attemptRandomPlaceShip(piece);
    });
    renderPlayerBoard();
}













init();
//console.log(checkSpace(5, [6, 0, 2]));
//console.log(compBoard[0][1]);
// setPiece(5, [0, 0, 2]);
// console.log(generateRand());
// attemptPlaceShip(5);
// compShot();
// renderPlayerBoard();
setCompBoard(compBoard);
//console.log(compBoard);
// checkWinner(compBoard);
// setPlayerBoard();