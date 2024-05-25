var ball;
var p1;
var p2;
var ctx;
var width;
var height;
var canvas;

function windowResized()
{
	const pixelRatio = window.devicePixelRatio || 1;
	canvas.width  = pixelRatio * canvas.clientWidth;
	canvas.height = pixelRatio * canvas.clientHeight;
	
	var scaleX = canvas.width / width;
	var scaleY = canvas.height / height;
	
	width = canvas.width;
	height = canvas.height;

	var x = p1.x * scaleX;
	var y = p1.y * scaleY;
	p1.resize(x, y, height / 20, height / 5);

	x = p2.x * scaleX;
	y = p2.y * scaleY;
	p2.resize(x, y, height / 20, height / 5);

	x = ball.x * scaleX;
	y = ball.y * scaleY;
	var velX = ball.velX * scaleX;
	var velY = ball.velY * scaleY;
	ball.resize(x, y, velX, velY, 20);
}

function random(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB()
{
	return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Define variables to keep track of player movements
let player1Up = false;
let player1Down = false;
let player2Up = false;
let player2Down = false;
let paused = false;
let savedVelX = 0;
let savedVelY = 0;

document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
		paused = !paused;
		if (paused) {
			savedVelX = ball.velX;
			savedVelY = ball.velY;
			ball.velX = 0;
			ball.velY = 0;
		}
		else {
			ball.velX = savedVelX;
			ball.velY = savedVelY;
		}
	}
});

// Add event listeners for player 1 movement
document.addEventListener('keydown', function(event) {
    if (event.key === 'w') {
        player1Up = true;
    } else if (event.key === 's') {
        player1Down = true;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'w') {
        player1Up = false;
    } else if (event.key === 's') {
        player1Down = false;
    }
});

// Add event listeners for player 2 movement
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        player2Up = true;
    } else if (event.key === 'ArrowDown') {
        player2Down = true;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowUp') {
        player2Up = false;
    } else if (event.key === 'ArrowDown') {
        player2Down = false;
    }
});

// Update player positions based on key states
function updatePlayers() {
	const offset = 10;
    if (player1Up) {
        if (p1.y - offset + p1.height < height && p1.y - offset > 0)
		{
			p1.move(-offset);
		}
    }
    if (player1Down) {
        if (p1.y + offset + p1.height < height && p1.y + offset > 0)
		{
			p1.move(offset);
		}
    }
    if (player2Up) {
        if (p2.y - offset + p2.height < height && p2.y - offset > 0)
		{
			p2.move(-offset);
		}
    }
    if (player2Down) {
        if (p2.y + offset + p2.height < height && p2.y + offset > 0)
		{
			p2.move(offset);
		}
    }
	if (paused) {
		player1Up = false;
		player1Down = false;
		player2Up = false;
		player2Down = false;
		ball.velX = 0;
		ball.velY = 0;
	}
}

class Player {
	constructor(x, y, color, width, height)
	{
		this.x = x;
		this.y = y;
		this.color = color;
		this.width = width;
		this.height = height;
	}
	draw()
	{
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fill();
	}
	move(offset)
	{
		this.y += offset;
	}
	resize(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

class Ball {
	constructor(x, y, velX, velY, color, size)
	{
		this.x = x;
		this.y = y;
		this.velX = velX;
		this.velY = velY;
		this.color = color;
		this.size = size;
	}

	draw()
	{
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.fill();
	}

	update()
	{
		if (this.x + this.size >= width)
		{
			this.velX = -Math.abs(this.velX);
		}

		if (this.x - this.size <= 0)
		{
			this.velX = Math.abs(this.velX);
		}

		if (this.y + this.size >= height)
		{
			this.velY = -Math.abs(this.velY);
		}

		if (this.y - this.size <= 0)
		{
			this.velY = Math.abs(this.velY);
		}
		this.x += this.velX;
		this.y += this.velY;
	}
	resize(x, y, velX, velY, size)
	{
		this.x = x;
		this.y = y;
		this.velX = velX;
		this.velY = velY;
		this.size = size;
	}
	collisionDetect()
	{
		if (this.x - this.size <= p1.x + p1.width && this.y >= p1.y && this.y <= p1.y + p1.height)
		{
			this.velX = Math.abs(this.velX);
		}
		if (this.x + this.size >= p2.x && this.y >= p2.y && this.y <= p2.y + p2.height)
		{
			this.velX = -Math.abs(this.velX);
		}
	}
}

function loop()
{
	ctx.fillStyle = "rgba(0, 0, 0, 0.50)";
	ctx.fillRect(0, 0, width, height);

	updatePlayers();
	ball.update();
	ball.collisionDetect();
	ball.draw();
	p1.draw();
	p2.draw();
	requestAnimationFrame(loop);
}

export function makeGame()
{
	canvas = document.getElementById("canvas");
	if (!canvas)
	{
		console.error("Canvas not found!");
		return;
	}
	ctx = canvas.getContext("2d");
	if (!ctx)
	{
		console.error("Canvas context not found!");
		return;
	}

	const pixelRatio = window.devicePixelRatio || 1;
	canvas.width  = pixelRatio * canvas.clientWidth;
	canvas.height = pixelRatio * canvas.clientHeight;

	width = canvas.width;
	height = canvas.height;

	var offset = width / 30;
	var halfHeight = height / 2 - height / 10;
	p1 = new Player(offset, halfHeight, randomRGB(), height / 20, height / 5);
	p2 = new Player(width - offset - (height / 20), halfHeight, randomRGB(), height / 20, height / 5);
	ball = new Ball(
		width / 2 + 5,
		height / 2 + 5,
		10,
		10,
		randomRGB(),
		20
	);
	//document.addEventListener('keydown', moveP, false);
	loop();
}
