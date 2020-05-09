/*----- constants -----*/
const pieces = [5, 4, 3, 3, 2];
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

let compHits; 
let compMisses;

let turn;
let winner;

let colIdx; 
let rowIdx;
let direction;

/*----- cached element references -----*/



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
    compHits = 0; 
    compMisses = 0;  
    turn = 1;
    winner = 0;
    
    $("#trythis > div:not(:first)").hide();

    //render();
}


function generateRand(){
    let a = Math.floor(Math.random() * 9); // will return 0 - 8; this chooses which array on compBoard
    let b = Math.floor(Math.random() * 11); // will return 0-10; this chooses which item on array[a] on compBoard
    let c = Math.floor(Math.random() * 2) + 1; // will return either 1 (horizontal) or 2 (vertical)
    return [a, b, c];
}

function checkSpace(piece, nums){
    //console.log(piece, nums);
    let a = nums[0]; // which array on compBoard
    let b = nums[1]; // which index in compBoard[a] array
    let direction = nums[2];
    //console.log(a, b);
    //console.log(typeof a, typeof b);
    //let starterSquare = compBoard[a][b];
    let potentialPlacement = [];
    if (direction === 1 && (compBoard[a].length - b) >= piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(compBoard[a][b + i]);
        }
    } else if (direction === 1 && (compBoard[a].length - b) < piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(compBoard[a][b - i]);
        } 
    } else if (direction === 2 && (numOfArrays - a) >= piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(compBoard[a + i][b]);
        } 
    } else if (direction === 2 && (numOfArrays - a) < piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(compBoard[a - i][b]);
        } 
    } else {
            console.log('error');
        }
    return potentialPlacement.every(square => square === null);
}

function setPiece(piece, nums){
    let a = nums[0]; // which array on compBoard
    let b = nums[1]; // which index in compBoard[a] array
    let direction = nums[2];
    // change nulls to 1
    if (direction === 1 && (compBoard[a].length - b) >= piece) {
        for (let i = 0; i < piece; i++) {
            compBoard[a][b + i] = 1;
        }
    } else if (direction === 1 && (compBoard[a].length - b) < piece) {
        for (let i = 0; i < piece; i++) {
            compBoard[a][b - i] = 1;
        } 
    } else if (direction === 2 && (numOfArrays - a) >= piece) {
        for (let i = 0; i < piece; i++) {
            compBoard[a + i][b] = 1;
        } 
    } else if (direction === 2 && (numOfArrays - a) < piece) {
        for (let i = 0; i < piece; i++) {
            compBoard[a - i][b] = 1;
        } 
    }
}

function attemptPlaceShip(piece){
    let nums = generateRand(); // returns array
    let avail = checkSpace(piece, nums); // returns boolean
    //console.log(nums);
    //console.log(avail);
    // here we go
    if (avail === true) {
        //console.log(`piece:${piece} spot is available! setting piece`);
        setPiece(piece, nums);
        //console.log(compBoard);
    } else if (avail === false) {
        //console.log(`piece:${piece} nums:${nums} not available, re-trying`);
        attemptPlaceShip(piece);
    } 
}

function setCompBoard(){
    pieces.forEach(function(piece) {
        attemptPlaceShip(piece);
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
    console.log(nums);
        // let avail = checkPlayerSpace(piece, nums);
        // if (avail === true) {
        //     setPlayerPiece(piece, nums);
        // } else if (avail === false) {
        //     alert(`looks like there is already a ship there`)
        // }
    //})
}

function checkPlayerSpace(piece, nums){
    //console.log(piece, nums);
    let a = nums[0]; // which array on playerBoard
    let b = nums[1]; // which index in playerBoard[a] array
    let direction = nums[2];
    console.log(piece, a, b);
    //console.log(typeof a, typeof b);
    //let starterSquare = playerBoard[a][b];
    let potentialPlacement = [];
    if (direction === 1 && (playerBoard[a].length - b) >= piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(playerBoard[a][b + i]);
        }
    } else if (direction === 1 && (playerBoard[a].length - b) < piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(playerBoard[a][b - i]);
        } 
    } else if (direction === 2 && (numOfArrays - a) >= piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(playerBoard[a + i][b]);
        } 
    } else if (direction === 2 && (numOfArrays - a) < piece) {
        for (let i = 0; i < piece; i++) {
            potentialPlacement.push(playerBoard[a - i][b]);
        } 
    } else {
            console.log('error');
        }
    return potentialPlacement.every(square => square === null);
}

function setPlayerPiece(piece, nums){
    let a = nums[0]; // which array on playerBoard
    let b = nums[1]; // which index in playerBoard[a] array
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

$('#trythis').on('click', 'button', function(evt) {
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
    
    
    let avail = checkPlayerSpace(piece, nums);
    
    if (avail === true) {
        setPlayerPiece(piece, nums);
        // console.log(playerBoard);
        shipPlaced = true;
    } else if (avail === false) {
        alert(`Hmmm... it looks like there's a ship there already!`);
        $(this).closest('div').find('input').attr("val", "");
    }

    console.log(typeof shipPlaced);

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
   // console.log(evt);
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
    } else if (valid === false){
        alert('Please submit a valid input');
        $(this).closest('div').find('input').attr("val", "");
    }
})

function takeShot($a, $b){
    let val = compBoard[$a][$b];
    if (val === 1) {
        console.log('hit')
        compBoard[$a][$b] = 2;
        // console.log(compBoard);
        playerShots += 1;
        playerHits += 1;
        playerAttempts[$a][$b] = 2;
        // console.log(playerShots, playerHits);
        // console.log(playerAttempts);
        checkWinner(compBoard);
    } else if (val === -1 || val === 2) {
       console.log(`You've already taken that shot`);
    } else if (val === null) {
        console.log('miss');
        compBoard[$a][$b] = -1;
        // console.log(compBoard);
        playerShots += 1;
        playerMisses += 1;
        playerAttempts[$a][$b] = -1;
        // console.log(playerShots, playerMisses);
        // console.log(playerAttempts);
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
    console.log(hitArray.length);
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



// function compShot(){
//     let a = Math.floor(Math.random() * 9); // array number
//     let b = Math.floor(Math.random() * 11); // index number
// }
                   



init();
//console.log(checkSpace(5, [6, 0, 2]));
//console.log(compBoard[0][1]);
// setPiece(5, [0, 0, 2]);
// console.log(generateRand());
// attemptPlaceShip(5);
setCompBoard();
// renderPlayerBoard();
// console.log(compBoard);
// checkWinner(compBoard);
// setPlayerBoard();