import { router } from "../main.js";

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

function togglePause() {
	ball.paused = !ball.paused;
	if (ball.paused) {
		ball.savedVel = ball.vel;
		ball.savedAlpha = ball.alpha;
		ball.vel = 0;
		ball.alpha = 0;
	}
	else {
		ball.vel = ball.savedVel;
		ball.alpha = ball.savedAlpha;
	}
}

function pu(event) {
	if (event.key === ' ') {
		togglePause(); 
	}
}
function addTogglePauseEventListener() {
	document.addEventListener('keydown', pu);
}

function removeTogglePauseEventListener() {
	document.removeEventListener('keydown', pu);
}

function handleKeyDown(event) {
	if (event.key === 'w') {
		player1Up = true;
	} else if (event.key === 's') {
		player1Down = true;
	}
}


function handleKeyUp(event) {
	if (event.key === 'w') {
		player1Up = false;
	} else if (event.key === 's') {
		player1Down = false;
	}
}

// Add event listeners for player 2 movement
function handleKeyDown2(event) {
	if (event.key === 'ArrowUp') {
		player2Up = true;
	} else if (event.key === 'ArrowDown') {
		player2Down = true;
	}
}


function handleKeyUp2(event) {
	if (event.key === 'ArrowUp') {
		player2Up = false;
	} else if (event.key === 'ArrowDown') {
		player2Down = false;
	}
}


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
	constructor(x, y, width, height, player, player_id, match_id, offense)
	{
		this.x = x;
		this.y = y;
		this.color = "white";
		this.width = width;
		this.height = height;
		this.offsetmove = this.height / 10;
		this.offense = offense;
		this.player = player;
		this.player_id = player_id;
		this.match_id = match_id;
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

function sendResult(winner_id, match_id){
	let data = {
		winner: winner_id,
		match_id:match_id
	}
	//localStorage.removeItem("match_id");
	//remove the event listeners
	document.removeEventListener('keydown', handleKeyDown);
	document.removeEventListener('keyup', handleKeyUp);
	document.removeEventListener('keydown', handleKeyDown2);
	document.removeEventListener('keyup', handleKeyUp2);
	removeTogglePauseEventListener();
	fetch('https://127.0.0.1:9001/update-match-result/', { 
		method: 'POST',
		headers: {
			'Content-Type': 'application/json' 
		},
		body: JSON.stringify(data)
	}
	).then(()=>{
		//document.getElementById("canvas").remove();
		console.log("Result sent");
		const state = history.state;
		state.winner_id = winner_id;
		history.replaceState(state, "", "/2dpong");
		router();
		return;
	})
}

class Ball {
	constructor(x, y, vel, alpha, color, size, acceleration, isAccelerated, savedVel, savedAlpha, paused)
	{
		this.x = x;
		this.y = y;
		this.vel = vel;
		this.alpha = alpha;
		this.color = color;
		this.size = size;
		this.acceleration = acceleration;
		this.isAccelerated = isAccelerated;
		this.savedVel = savedVel;
		this.savedAlpha = savedAlpha;
		this.paused = paused;
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
			p1Score++;
			this.paused = true;
			this.isAccelerated = false;
			player1Down = false;
			player1Up = false;
			player2Down = false;
			player2Up = false;
			p1.offense = true;
			p2.offense = false;
			this.start();
			this.savedVel = 10;
			this.savedAlpha = -(Math.PI / 4);
		}

		else if (this.x <= 0)
		{
			p2Score++;
			this.isAccelerated = false;
			this.paused = true;
			player1Down = false;
			player1Up = false;
			player2Down = false;
			player2Up = false;
			p2.offense = true;
			p1.offense = false;
			this.start();
			this.savedVel = 10;
			this.savedAlpha = Math.PI + Math.PI / 4;
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
		if (p2.offense && this.x <= p1.x + p1.width && this.y >= p1.y && this.y <= p1.y + p1.height)
		{
			this.alpha = Math.PI - this.alpha;
			if ((player1Down || player1Up) && !this.isAccelerated)
			{	
				this.vel += this.acceleration;
				this.isAccelerated = true;
			}
			else if (this.isAccelerated)
			{
				this.vel -= this.acceleration;
				this.isAccelerated = false;
			}
			p2.offense = false;
			p1.offense = true;
		}
		if (p1.offense && this.x + this.size >= p2.x && this.y >= p2.y && this.y <= p2.y + p2.height)
		{
			//console.log("before p2: " + this.velX);
			this.alpha = Math.PI - this.alpha;
			//console.log("p2: " + (player2Down || player2Up));
			//console.log("isAccelerated: " + isAccelerated);
			if ((player2Down || player2Up) && !this.isAccelerated)
			{	
				this.vel += this.acceleration;
				this.isAccelerated = true;
			}
			else if (this.isAccelerated)
			{
				this.vel -= this.acceleration;
				this.isAccelerated = false;
			}
			//console.log("after p2: " + this.velX);
			p2.offense = true;
			p1.offense = false;
			//console.log("p1.offense: " + p1.offense);
			//console.log("p2.offense: " + p2.offense);
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
	if (!ball.paused)
	{
		ball.update();
		ball.collisionDetect();
	}
	if (p1Score == 1)
	{
		sendResult(p1.player_id, p1.match_id);
		return;
	}
	else if (p2Score == 1)
	{
		sendResult(p2.player_id, p2.match_id);
		return;
	}
	ball.draw();
	p1.draw();
	p2.draw();
	// write the name of the player
	ctx.fillStyle = "white";
	ctx.font = "30px Arial";
	ctx.fillText(p1.player, width / 10, height / 10);
	ctx.fillText(p2.player, 7 * width / 10, height / 10);
	requestAnimationFrame(loop);
}

/* function drawCanvas()
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
} */

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

export function actionGame()
{
	console.log(history.state);
	const state = history.state;
	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('keyup', handleKeyUp);
	document.addEventListener('keydown', handleKeyDown2);
	document.addEventListener('keyup', handleKeyUp2);
	addTogglePauseEventListener();
	if (state)
	{
		if (state.nextmatch)
		{
			var match_id = state.nextmatch.id;
			var player1_id = state.nextmatch.player1;
			var player2_id = state.nextmatch.player2;
			for (let i = 0; i < state.playerNames.length; i++)
			{
				if (state.players_id[i] == player1_id)
				{
					var player1 = state.playerNames[i];
				}
				else if (state.players_id[i] == player2_id)
				{
					var player2 = state.playerNames[i];
				}
			}
		}
		else
		{
			var match_id = state.match_id;
			var player1_id = state.players[0];
			var player2_id = state.players[1];
			var player1 = state.player_names[0];
			var player2 = state.player_names[1];
		}
		makeGame(match_id, player1_id, player2_id, player1, player2);
	}
	else
	{
		console.error("No state found");
	}
}

export function makeGame(match_id, player1_id, player2_id, player1, player2)
{	
	p1Score = 0;
	p2Score = 0;

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

	p1 = new Player(startingP1X, startingPY, playerWidth, playerHeight, player1, player1_id, match_id, true);
	p2 = new Player(startingP2X, startingPY, playerWidth, playerHeight, player2, player2_id, match_id, false);
	ball = new Ball(startingBallX, startingBallY, 0, 0, "white", ballSize, 5, false, 10, -(Math.PI / 4), true);
	loop();
}