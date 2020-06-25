const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const box = 32;

let playAgainBtn = document.getElementById("button");
let gameOverTxt = document.getElementById("gameOverTxt");
let highscore_check = false;

// load images

const background = new Image();
background.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

// load audio files

const dead = new Audio();
const eat = new Audio();
const up = new Audio();
const left = new Audio();
const right = new Audio();
const down = new Audio();
const highscore_sound = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";
highscore_sound.src = "audio/highscore.wav";

// create the snake

let snake = [];

snake[0] = {
  x: 9 * box,
  y: 10 * box
};

// create the food

let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box
};

let score = 0;

let highscore = 0;

// control the snake

let d;

document.addEventListener("keydown", direction);

function direction(event) {
  let key = event.keyCode;
  if (key == 37 && d != "RIGHT") {
    left.play();
    d = "LEFT";
  } else if (key == 38 && d != "DOWN") {
    up.play();
    d = "UP";
  } else if (key == 39 && d != "LEFT") {
    right.play();
    d = "RIGHT";
  } else if (key == 40 && d != "UP") {
    down.play();
    d = "DOWN";
  }
}

// restart the game when restart button is clicked

function playAgain() {
  // Reinitializing everything
  playAgainBtn.style.display = "none";
  gameOverTxt.style.display = "none";
  d = "";
  snake = [];
  snake[0] = {
    x: 9 * box,
    y: 10 * box
  };

  food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
  };

  score = 0;

  // Start the game again
  game = setInterval(draw, 120);
}

// when the snake collides with itself

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

// main fucntion to draw all the elements and keep the snake moving and postioning the food
function draw() {
  // play sound when you exceed highscore
  if (highscore != 0 && !highscore_check) {
    if (score > highscore) {
      highscore_sound.play();
      highscore_check = true;
    }
  }

  ctx.drawImage(background, 0, 0);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "black" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    ctx.strokeStyle = "red";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.drawImage(foodImg, food.x, food.y);

  ctx.fillStyle = "white";
  ctx.font = "32px san-serif";
  ctx.fillText(score, 2.2 * box, 1.6 * box);

  ctx.fillStyle = "white";
  ctx.font = "22px san-serif";
  ctx.fillText("Highscore : " + highscore, 12 * box, 1.6 * box);

  // old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // check the direction
  if (d == "LEFT") snakeX -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "UP") snakeY -= box;
  if (d == "DOWN") snakeY += box;

  // when the snake eats the food

  if (snakeX == food.x && snakeY == food.y) {
    score++;
    eat.play();
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box
    };
  } else {
    // remove the tail
    snake.pop();
  }

  // add new head
  let newHead = {
    x: snakeX,
    y: snakeY
  };

  // Game Over Rules

  if (
    snakeX < box ||
    snakeX > 17 * box ||
    snakeY < 3 * box ||
    snakeY > 17 * box ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    dead.play();

    // setting up the highscore
    if (score > highscore) {
      highscore = score;
      highscore_check = false;
    }
    // displaying game over txt
    gameOverTxt.style.display = "block";

    // displaying the play again button
    setTimeout(() => (playAgainBtn.style.display = "block"), 1000);
  }

  snake.unshift(newHead);
}

let game = setInterval(draw, 200);
