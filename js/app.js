/*----- constants -----*/
const pieces = [5, 4, 3, 3, 2];
const numOfArrays = 9;

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
    setCompBoard();
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
        setPiece(piece, nums);
    } else if (avail === false) {
        attemptPlaceShip(piece);
    } 
}

function setCompBoard(){
    pieces.forEach(function(piece) {
        attemptPlaceShip(piece);
    });
}





init();
//compSetup();
//console.log(checkSpace(5, [6, 0, 2]));
//console.log(compBoard[0][1]);
// setPiece(5, [0, 0, 2]);
// console.log(generateRand());
// attemptPlaceShip(5);
setCompBoard();
console.log(compBoard);