var ball;
var p1;
var p2;
var ctx;
var width;
var height;
var canvas;
var p1Score = 0;
var p2Score = 0;

// Define variables to keep track of player movements
let player1Up = false;
let player1Down = false;
let player2Up = false;
let player2Down = false;
let paused = false;
let savedVel = 0;
let savedAlpha = 0;
let p1Offense = true;
let p2Offense = false;
let acceleration = 5;
let isAccelerated = false;

document.addEventListener('keydown', function(event) {
	if (event.key === ' ') {
		paused = !paused;
		if (paused) {
			savedVel = ball.vel;
			savedAlpha = ball.alpha;
			ball.vel = 0;
			ball.alpha = 0;
		}
		else {
			ball.vel = savedVel;
			ball.alpha = savedAlpha;
		}
	}
});

document.addEventListener('keydown', function(event)
{
	if (event.key === 'w')
		player1Up = true;
	else if (event.key === 's')
		player1Down = true;
}
);

document.addEventListener('keyup', function(event) {
    if (event.key === 'w') {
        player1Up = false;
    } else if (event.key === 's') {
        player1Down = false;
    }
});

// Add event listeners for player 2 movement
document.addEventListener('keydown', function(event)
{
	if (event.key === 'ArrowUp') {
		player2Up = true;
	} else if (event.key === 'ArrowDown') {
		player2Down = true;
	}
});

document.addEventListener('keyup', function(event)
{
	if (event.key === 'ArrowUp') {
		player2Up = false;
	} else if (event.key === 'ArrowDown') {
		player2Down = false;
	}
});

// Update player positions based on key states
function updatePlayers() {
	if (player1Up)
	{
		if (p1.y - p1.offsetmove + p1.height < height && p1.y - p1.offsetmove > 0)
		{
			p1.move(-p1.offsetmove);
		}
	}
	if (player1Down)
	{
		if (p1.y + p1.offsetmove + p1.height < height && p1.y + p1.offsetmove > 0)
		{
			p1.move(p1.offsetmove);
		}
	}
	if (player2Up)
	{
		if (p2.y - p2.offsetmove + p2.height < height && p2.y - p2.offsetmove > 0)
		{
			p2.move(-p2.offsetmove);
		}
	}
	if (player2Down)
		{
		if (p2.y + p2.offsetmove + p2.height < height && p2.y + p2.offsetmove > 0)
		{
			p2.move(p2.offsetmove);
		}
	}
}

class Player {
	constructor(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.color = "white";
		this.width = width;
		this.height = height;
		this.offsetmove = this.height / 10;
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
const  sendResult = (winner)=>{
	data = {
		winner:winner,
		match_id:localStorage.getItem("match_id")
	}
	localStorage.removeItem('nomeUtente');
	 fetch('https://127.0.0.1/get-next-match/', { 
		method: 'POST',
		headers: {
			'Content-Type': 'application/json' 
		},
		body: JSON.stringify(data)	
		}
	).then(()=>{
        history.pushState({},"","/3dpong_tournament")
        router();
	})
}
class Ball {
	constructor(x, y, vel, alpha, color, size)
	{
		this.x = x;
		this.y = y;
		this.vel = vel;
		this.alpha = alpha;
		this.color = color;
		this.size = size;
	}

	draw()
	{
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.x, this.y, this.size, this.size);
		ctx.fill();
	}

	start()
	{
		this.x = width / 2 - height / 40;
		this.y = height / 2 - height / 40;
		this.vel = 0;
		this.alpha = 0;
	}

	update()
	{
		if (this.x + this.size >= width)
		{
			alert("p1 score!");
			p1Score++;
			// if(p1Score === 3)

			paused = true;
			isAccelerated = false;
			player1Down = false;
			player1Up = false;
			player2Down = false;
			player2Up = false;
			p1Offense = true;
			p2Offense = false;
			this.start();
			savedVel = 10;
			savedAlpha = -(Math.PI / 4);
		}

		else if (this.x <= 0)
		{
			alert("p2 score!");
			p2Score++;
			isAccelerated = false;
			paused = true;
			player1Down = false;
			player1Up = false;
			player2Down = false;
			player2Up = false;
			p2Offense = true;
			p1Offense = false;
			this.start();
			savedVel = 10;
			savedAlpha = Math.PI + Math.PI / 4;
		}

		if (this.y + this.size >= height)
		{
			this.alpha = -this.alpha;
		}

		else if (this.y <= 0)
		{
			this.alpha = -this.alpha;
		}
	
		var velX = this.vel * Math.cos(this.alpha);
		var velY = this.vel * Math.sin(this.alpha);

		this.x += velX;
		this.y += velY;
	}
	resize(x, y, vel, alpha, size)
	{
		this.x = x;
		this.y = y;
		this.vel = vel;
		this.alpha = alpha;
		this.size = size;
	}
	collisionDetect()
	{
		if (p2Offense && this.x <= p1.x + p1.width && this.y >= p1.y && this.y <= p1.y + p1.height)
		{
			this.alpha = Math.PI - this.alpha;
			if ((player1Down || player1Up) && !isAccelerated)
			{	
				this.vel += acceleration;
				isAccelerated = true;
			}
			else if (isAccelerated)
			{
				this.vel -= acceleration;
				isAccelerated = false;
			}
			p2Offense = false;
			p1Offense = true;
		}
		if (p1Offense && this.x + this.size >= p2.x && this.y >= p2.y && this.y <= p2.y + p2.height)
		{
			//console.log("before p2: " + this.velX);
			this.alpha = Math.PI - this.alpha;
			//console.log("p2: " + (player2Down || player2Up));
			//console.log("isAccelerated: " + isAccelerated);
			if ((player2Down || player2Up) && !isAccelerated)
			{	
				this.vel += acceleration;
				isAccelerated = true;
			}
			else if (isAccelerated)
			{
				this.vel -= acceleration;
				isAccelerated = false;
			}
			//console.log("after p2: " + this.velX);
			p2Offense = true;
			p1Offense = false;
			//console.log("p1Offense: " + p1Offense);
			//console.log("p2Offense: " + p2Offense);
		}
	}
}

function drawScore(line_width, x, y, score)
{
	ctx.fillStyle = "white";

	if (score == 0)
		ctx.fillRect(x, y, line_width, 4 * line_width); //1
	
	ctx.fillRect((3 * line_width) + x, y, line_width, 4 * line_width); //2

	if (score == 0 || score == 2)
		ctx.fillRect(x, (3 * line_width) + y, line_width, 4 * line_width); //3

	if (score == 0 || score == 1 || score == 3)
		ctx.fillRect((3 * line_width) + x, (3 * line_width) + y, line_width, 4 * line_width); //4

	if (score == 0 || score == 2 || score == 3)
		ctx.fillRect(x, y, 4 * line_width, line_width); //5

	if (score == 2 || score == 3)
		ctx.fillRect(x, (3 * line_width) + y, 4 * line_width, line_width); //6
	
	if (score == 0 || score == 2 || score == 3)
		ctx.fillRect(x, (6 * line_width) + y, 4 * line_width, line_width); //7
}

function loop()
{
	ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = "white";
	var line_width = ball.size / 2;
	var line_start = 0;
	while (line_start < height)
	{
		ctx.fillRect(width / 2 - line_width / 2, line_start, line_width, line_width * 2);
		line_start = line_start + line_width * 3;
	}

	drawScore(line_width, width / 4, 0, p1Score);
	drawScore(line_width, 3 * width / 4, 0, p2Score);

	updatePlayers();
	if (!paused)
	{
		ball.update();
		ball.collisionDetect();
	}
	/* if (p1Offense)
		ball.color = "red";
	else if (p2Offense)
		ball.color = "blue";
	else
		ball.color = "white"; */
	ball.draw();
	p1.draw();
	p2.draw();
	requestAnimationFrame(loop);
}

function drawCanvas()
{
	var playerWidth = height / 20;
	var playerHeight = height / 5;
	var startingP1X = width / 30;
	var startingPY = height / 2 - playerHeight / 2;
	var startingP2X = width - startingP1X - playerWidth;
	var ballSize = height / 20;
	var startingBallX = width / 2 - ballSize / 2;
	var startingBallY = height / 2 - ballSize / 2;

	p1.resize(startingP1X, startingPY, playerWidth, playerHeight);
	p2.resize(startingP2X, startingPY, playerWidth, playerHeight);
	ball.resize(startingBallX, startingBallY, 0, 0, ballSize);

	ctx.fillStyle = "rgba(0, 0, 0, 1)";
	ctx.fillRect(0, 0, width, height);
	p1.draw();
	p2.draw();
	ball.draw();
}

/* function resizeCanvas() {
	var tempWidth = window.screen.availWidth < window.innerWidth ? window.screen.availWidth : window.innerWidth;
	var tempHeight = window.screen.availHeight < window.innerHeight ? window.screen.availHeight : window.innerHeight;

	if (tempWidth < 1.5 * tempHeight)
	{
		canvas.width = tempWidth;
		canvas.height = tempWidth / 1.5;
	}
	else
	{
		canvas.width = 1.5 * tempHeight;
		canvas.height = tempHeight;
	}

	width = canvas.width;
	height = canvas.height;

	drawCanvas();
} */

//window.addEventListener('resize', resizeCanvas);


export function makeGame()
{
	canvas = document.createElement("canvas");
	if (!canvas)
	{
		console.error("Canvas not created!");
		return;
	}
	document.getElementById("content").appendChild(canvas);
	canvas.id = "canvas";
	ctx = canvas.getContext("2d");
	if (!ctx)
	{
		console.error("Canvas context not found!");
		return;
	}

	var tempWidth = window.screen.availWidth < window.innerWidth ? window.screen.availWidth : window.innerWidth;
	var tempHeight = window.screen.availHeight < window.innerHeight ? window.screen.availHeight : window.innerHeight;

	if (tempWidth < 1.5 * tempHeight)
	{
		canvas.width = tempWidth;
		canvas.height = tempWidth / 1.5;
	}
	else
	{
		canvas.width = 1.5 * tempHeight;
		canvas.height = tempHeight;
	}

	width = canvas.width;
	height = canvas.height;

	var playerWidth = height / 20;
	var playerHeight = height / 5;
	var startingP1X = width / 30;
	var startingPY = height / 2 - playerHeight / 2;
	var startingP2X = width - startingP1X - playerWidth;
	var ballSize = height / 20;
	var startingBallX = width / 2 - ballSize / 2;
	var startingBallY = height / 2 - ballSize / 2;

	p1 = new Player(startingP1X, startingPY, playerWidth, playerHeight);
	p2 = new Player(startingP2X, startingPY, playerWidth, playerHeight);
	ball = new Ball(startingBallX, startingBallY, 0, 0, "white", ballSize);
	//document.addEventListener('keydown', moveP, false);
 	paused = true;
	savedVel = 10;
	savedAlpha = - (Math.PI / 4);
	loop();
}