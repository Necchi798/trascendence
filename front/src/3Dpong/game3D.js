import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { router } from "../main.js";

var renderer;
var orbit;
var scene;
var camera;
var table;
var ball;
var width;
var height;
var p1;
var p2;
var score1;
var score2;
var p1Offense = false;
var p2Offense = true;

function sendResult3D(winner_id, match_id){
	let data = {
		winner: winner_id,
		match_id:match_id
	}
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
		console.log("Result sent");
		var state = history.state;
		state.winner_id = winner_id;
		history.replaceState(state, "", "/3dpong");
		router();
		return;
	})
}

class Table {
	constructor(width, height, depth, x, y, z) {
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
		this.material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(x, y, z);
	}
}

class Player3D {
	constructor(width, height, depth, x, y, z, color, match_id, player_id, player_name) {
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.offsetmove = 1;
		this.match_id = match_id;
		this.player_id = player_id;
		this.player_name = player_name;
		this.x = x;
		this.y = y;
		this.z = z;
		this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
		this.material = new THREE.MeshLambertMaterial({ color: color });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(x, y, z);
	}
	move(offset) {
		this.mesh.position.y += offset;
		this.y += offset;
	}
}

class Ball3D {
	constructor(size, color, x, y, z, vel, alpha, paused, acceleration, isAccelerated, savedVel, savedAlpha) {
		this.size = size;
		this.geometry = new THREE.BoxGeometry(size, size, size);
		this.material = new THREE.MeshLambertMaterial({ color: color });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(x, y, z);
		this.acceleration = acceleration;
		this.isAccelerated = isAccelerated;
		this.savedVel = savedVel;
		this.savedAlpha = savedAlpha;
		this.vel = vel;
		this.alpha = alpha;
		this.paused = paused;
	}
	togglePause() {
		this.paused = !this.paused;
		if (this.paused) {
			this.savedVel = this.vel;
			this.savedAlpha = this.alpha;
			this.vel = 0;
			this.alpha = 0;
		} else {
			this.vel = this.savedVel;
			this.alpha = this.savedAlpha;
		}
	}
	update() {
		if (this.mesh.position.x >= (table.width / 2)) {
			console.log('Player 2 scores!');
			this.alpha = 0;
			this.vel = 0;
			score2.value++;
			console.log('Score: ' + score2.value);
			score2.update();
			player1Down = false;
			player1Up = false;
			player2Down = false;
			player2Up = false;
			p1Offense = false;
			p2Offense = true;
			this.mesh.position.set(0, 0, 2);
			this.paused = true;
			this.savedVel = 1;
			this.savedAlpha = Math.PI / 4;
		}

		else if (this.mesh.position.x <= - width / 2) {
			this.alpha = 0;
			this.vel = 0;
			score1.value++;
			score1.update();
			player1Down = false;
			player1Up = false;
			player2Down = false;
			player2Up = false;
			p1Offense = true;
			p2Offense = false;
			this.mesh.position.set(0, 0, 2);
			this.paused = true;
			this.savedVel = 1;
			this.savedAlpha = Math.PI + Math.PI / 4;
		}

		if (this.mesh.position.y >= height / 2) {
			this.alpha = -this.alpha;
		}

		else if (this.mesh.position.y <= - height / 2) {
			this.alpha = -this.alpha;
		}

		var velX = this.vel * Math.cos(this.alpha);
		var velY = this.vel * Math.sin(this.alpha);

		this.mesh.position.x += velX;
		this.mesh.position.y += velY;
	}
	collisionDetect() {

		if (p2Offense && this.mesh.position.x >= ((table.width / 2) - p1.depth - (this.size)) && this.mesh.position.y >= p1.mesh.position.y - p1.height / 2 && this.mesh.position.y <= p1.mesh.position.y + p1.height / 2) {
			console.log('Player 1 collision');
			console.log('Ball position: ' + this.mesh.position.x + ' ' + this.mesh.position.y);
			console.log('Player 1 position: ' + p1.mesh.position.x + ' ' + p1.mesh.position.y);
			this.alpha = Math.PI - this.alpha;
			if ((player1Down || player1Up) && !this.isAccelerated) {
				this.vel += this.acceleration;
				this.isAccelerated = true;
			}
			else if (this.isAccelerated) {
				this.vel -= this.acceleration;
				this.isAccelerated = false;
			}
			p2Offense = false;
			p1Offense = true;
		}

		else if (p1Offense && this.mesh.position.x <= - width / 2 + p2.depth + this.size && this.mesh.position.y >= p2.mesh.position.y - p2.height / 2 && this.mesh.position.y <= p2.mesh.position.y + p2.height / 2) {
			console.log('Player 2 collision');
			console.log('Ball position: ' + this.mesh.position.x + ' ' + this.mesh.position.y);
			console.log('Player 2 position: ' + p2.mesh.position.x + ' ' + p2.mesh.position.y);
			this.alpha = Math.PI - this.alpha;
			if ((player2Down || player2Up) && !this.isAccelerated) {
				this.vel += this.acceleration;
				this.isAccelerated = true;
			}
			else if (this.isAccelerated) {
				this.vel -= this.acceleration;
				this.isAccelerated = false;
			}
			p2Offense = true;
			p1Offense = false;
		}
	}
}

class Score {
	constructor(width, height, depth, unit, x, y, z) {
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.unit = unit;
		this.value = 0;
		this.x = x;
		this.y = y;
		this.z = z;

		this.scoreMaterial = new THREE.MeshBasicMaterial({ color: "red" });
		this.geometryVerticalUp = new THREE.BoxGeometry(this.unit, this.unit * 4, this.depth);
		this.geometryVerticalDown = new THREE.BoxGeometry(this.unit, this.unit * 5, this.depth);
		this.geometryHorizontal = new THREE.BoxGeometry(this.unit * 4, this.unit, this.depth);

		this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
		this.material = new THREE.MeshBasicMaterial({ color: "white" });

		this.meshArr = [];
		this.meshArr.push(new THREE.Mesh(this.geometry, this.material));

		this.meshArr.push(new THREE.Mesh(this.geometryVerticalUp, this.scoreMaterial)); //1 and 2
		this.meshArr.push(new THREE.Mesh(this.geometryVerticalUp, this.scoreMaterial));

		this.meshArr.push(new THREE.Mesh(this.geometryVerticalDown, this.scoreMaterial)); //3 and 4
		this.meshArr.push(new THREE.Mesh(this.geometryVerticalDown, this.scoreMaterial));

		this.meshArr.push(new THREE.Mesh(this.geometryHorizontal, this.scoreMaterial)); //5, 6 and 7
		this.meshArr.push(new THREE.Mesh(this.geometryHorizontal, this.scoreMaterial));
		this.meshArr.push(new THREE.Mesh(this.geometryHorizontal, this.scoreMaterial));

		this.meshArr[0].position.set(x, y, z);

		this.meshArr[1].position.set(x + (this.width / 2 - this.unit / 2), y - (this.height / 4), z + 1);

		this.meshArr[2].position.set(x - (this.width / 2 - this.unit / 2), y - (this.height / 4), z + 1);

		this.meshArr[3].position.set(x + (this.width / 2 - this.unit / 2), y + (this.height / 4 - this.unit / 2), z + 1);

		this.meshArr[4].position.set(x - (this.width / 2 - this.unit / 2), y + (this.height / 4 - this.unit / 2), z + 1);

		this.meshArr[5].position.set(x, y - this.height / 2 + this.unit / 2, z + 1);

		this.meshArr[6].position.set(x, y - this.unit / 2, z + 1);

		this.meshArr[7].position.set(x, y + this.height / 2 - this.unit / 2, z + 1);

		this.functArrayAdd = [];
		for (let i = 0; i < 8; i++)
		{
			this.functArrayAdd.push(() => scene.add(this.meshArr[i]));
		}

		this.functArrayRemove = [];
		for (let i = 0; i < 8; i++)
		{
			this.functArrayRemove.push(() => scene.remove(this.meshArr[i]));
		}
		
		this.functArrayAdd.forEach(func => {
			func(); // Chiamare la funzione corrente
		})

		this.functArrayRemove[6]();
		this.components = [
		//   0  1  2  3  4  5  6  7
			[1, 1, 1, 1, 1, 1, 0, 1],
			[1, 0, 1, 0, 1, 0, 0, 0],
			[1, 0, 1, 1, 0, 1, 1, 1],
			[1, 0, 1, 0, 1, 1, 1, 1]
		  ]

	}
	update()
	{
		console.log('Score updating...');
		if (this.value <= 3)
		{
			var oldScore = this.value - 1;
			for (let i = 0; i < 8; i++)
			{
				if (this.components[oldScore][i] == 1 && this.components[this.value][i] == 0)
					this.functArrayRemove[i]();
				else if (this.components[oldScore][i] == 0 && this.components[this.value][i] == 1)
					this.functArrayAdd[i]();
			}
		}
		console.log("Score updated");
	}
}


let player1Up = false;
let player1Down = false;
let player2Up = false;
let player2Down = false;

/* function togglePause() {
	paused = !paused;
	if (paused) {
		savedVel = ball.vel;
		savedAlpha = ball.alpha;
		ball.vel = 0;
		ball.alpha = 0;
	} else {
		ball.vel = savedVel;
		ball.alpha = savedAlpha;
	}
} */


function pu(event) {
	if (event.key === ' ') {
		ball.togglePause();
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


function updatePlayers() {
	if (player1Up) {
		if (p1.mesh.position.y > - height / 2 + p1.height / 2)
			p1.move(-p1.offsetmove);
	}
	if (player1Down) {
		if (p1.mesh.position.y < height / 2 - p1.height / 2)
			p1.move(p1.offsetmove);
	}
	if (player2Up) {
		if (p2.mesh.position.y > - height / 2 + p2.height / 2)
			p2.move(-p2.offsetmove);
	}
	if (player2Down) {
		if (p2.mesh.position.y < height / 2 - p2.height / 2)
			p2.move(p2.offsetmove);
	}
}

function animate() {
	updatePlayers();
	if (!ball.paused)
	{
		ball.update();
		ball.collisionDetect();
	}
	if (score1.value == 1)
	{
		console.log('Player 1 wins!');
		sendResult3D(p1.player_id, p1.match_id);
		return;
	}
	else if (score2.value == 1)
	{
		console.log('Player 2 wins!');
		sendResult3D(p2.player_id, p2.match_id);
		return;
	}
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}
		
export function actionGame3D()
{
	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('keydown', handleKeyDown2);
	document.addEventListener('keyup', handleKeyUp2);
	document.addEventListener('keyup', handleKeyUp);
	addTogglePauseEventListener();
	const state = history.state;
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
		makeGame3d(match_id, player1_id, player2_id, player1, player2);
	}
	else
	{
		console.error("No state found");
	}
}

export function makeGame3d(match_id, player1_id, player2_id, player1, player2) {
	renderer = new THREE.WebGLRenderer();
	if (!renderer) {
		console.log('Failed to create renderer');
	}
	else {
		console.log('Renderer created');
	}
	renderer.setSize(window.innerWidth, window.innerHeight);
	var main = document.body.querySelector('main');
	if (!main) {
		console.log('Failed to find main');
	}
	else {
		console.log('Main found');
	}
	main.appendChild(renderer.domElement);
	scene = new THREE.Scene();
	if (!scene) {
		console.log('Failed to create scene');
	}
	else {
		console.log('Scene created');
	}
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	if (!camera) {
		console.log('Failed to create camera');
	}
	else {
		console.log('Camera created');
	}

	scene.rotateX(- Math.PI / 2);
	scene.rotateZ(- Math.PI / 2);
	camera.position.set(20, 50, 0);
	camera.lookAt(0, 0, 0);

	renderer.setClearColor(0x000000);
	orbit = new OrbitControls(camera, renderer.domElement);

	width = 90;
	height = 60;
	var depth = 2;

	var tablePosX = 0;
	var tablePosY = 0;
	var tablePosZ = 0;
	table = new Table(width, height, depth, tablePosX, tablePosY, tablePosZ);
	scene.add(table.mesh);
	console.log('Table created');

	//light
	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 0, 5);
	scene.add(light);

	//ambient light
	var ambientLight = new THREE.AmbientLight(0x404040);
	scene.add(ambientLight);

	var ballSize = 2;
	var ballPosX = 0;
	var ballPosY = 0;
	var ballPosZ = ballSize;
	var ballColor = "white";
	var savedVel = 1;
	var savedAlpha = Math.PI / 4;
	var acceleration = 0.5;
	var isAccelerated = false;

	ball = new Ball3D(ballSize, ballColor, ballPosX, ballPosY, ballPosZ, 0, 0, true, acceleration, isAccelerated, savedVel, savedAlpha);
	scene.add(ball.mesh);
	console.log('Ball created');

	var playerWidth = 2;
	var playerHeight = 10;
	var playerDepth = 2;
	var player1PosY = 0;
	var player1PosZ = playerDepth;
	var player1PosX = width / 2 - playerWidth / 2 - playerDepth;
	p1 = new Player3D(playerWidth, playerHeight, playerDepth, player1PosX, player1PosY, player1PosZ, "white", match_id, player1_id, player1);
	scene.add(p1.mesh);
	console.log('Player 1 created');

	var player2PosX = - player1PosX;
	var player2PosY = 0;
	var player2PosZ = playerDepth;
	p2 = new Player3D(playerWidth, playerHeight, playerDepth, player2PosX, player2PosY, player2PosZ, "white", match_id, player2_id, player2);
	scene.add(p2.mesh);
	console.log('Player 2 created');

	var scoreWidth = 8;
	var scoreHeight = 16;
	var scoreDepth = 1;
	var scoreUnit = 2;
	var score1PosX = width / 4 + scoreWidth / 2;
	var score1PosY = - height / 2 - scoreHeight / 2;
	var score1PosZ = 1;
	score1 = new Score(scoreWidth, scoreHeight, scoreDepth, scoreUnit, score1PosX, score1PosY, score1PosZ);

	var score2PosX = - width / 4 - scoreWidth / 2;
	var score2PosY = - height / 2 - scoreHeight / 2;
	var score2PosZ = 1;
	score2 = new Score(scoreWidth, scoreHeight, scoreDepth, scoreUnit, score2PosX, score2PosY, score2PosZ);

	orbit.update();

	animate();
}