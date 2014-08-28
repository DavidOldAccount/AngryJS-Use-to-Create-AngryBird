var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolyShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

(function(){
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0;x < vendors.length && !window.requestAnimationFrame;++x){//The animation frame
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		if(!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element){//window.requestAnimationFrame(callback, element);
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id  = window.setTimeout(function(){
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
			if(!window.cancelAnimationFrame)
				window.cancelAnimationFrame = function(id){
					clearTimeout(id);
				};
}());

$(window).load(function(){
	game.init();//Load the init(); inside object "game".
});

var game = {
	showLevelScreen:function(){
		$('.gamelayer').hide();
		$('#levelselectscreen').show('slow');//Show the menu and hide the mission screen
	},
	
	init:function(){
		levels.init();
		loader.init();
		mouse.init();
		//touch.init();  this one is not finished!!
		$('.gamelayer').hide();
		$('#gamestartscreen').show();
		game.canvas = $('#gamecanvas')[0];
		game.context = game.canvas.getContext('2d');//Load canvas and context
	},
	
	mode:"intro", slingshotX:140, slingshotY:280, //The image of the slingshot
	start:function(){
		$('.gamelayer').hide();
		$('#gamecanvas').show();
		$('#scorescreen').show();
		game.mode = "intro";//Intro game mode
		game.offsetLeft = 0;
		game.ended = false;
		game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);//Load the animation
	},
	
	handlePanning:function(){
		//game.offsetLeft++;   the old one!!!
		if(game.mode == "intro"){
			if(game.panTo(700)){
				game.mode = "load-next-hero";//load heros
			}
		}
		if(game.mode == "wait-for-firing"){//Wait for firing
			if(mouse.dragging){
				game.panTo(mouse.x + game.offsetLeft);
			}else{
				game.panTo(game.slingshotX);
			}
		}
		if(game.mode == "load-next-hero"){
			//Add your hero here
			game.mode = "wait-for-firing";
		}
		if(game.mode == "firing"){
			game.panTo(game.slingshotX);
		}
		if(game.mode == "fired"){
			//Add your fiream here
		}
	},
	
	animate:function(){
		game.handlePanning();
		game.context.drawImage(game.currentLevel.backgroundImage, game.offsetLeft / 4, 0, 640, 480, 0, 0, 640, 480);
		game.context.drawImage(game.currentLevel.foregroundImage, game.offsetLeft, 0, 640, 480, 0, 0, 640, 480);
		game.context.drawImage(game.slingshotImage, game.slingshotX - game.offsetLeft, game.slingshotY);
		game.context.drawImage(game.slingshotFrontImage, game.slingshotX - game.offsetLeft, game.slingshotY);
		if(!game.ended){
			game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
		}
	},
	
	maxSpeed:3, minOffset:0, maxOffset:300, offsetLeft:0, score:0,
	panTo:function(newCenter){
		if(Math.abs(newCenter - game.offsetLeft - game.canvas.width / 4) > 0 && game.offsetLeft <= game.maxOffset && game.offsetLeft >= game.minOffset){
			var deltaX = Math.round((newCenter - game.offsetLeft - game.canvas.width / 4) / 2);
			if(deltaX && Math.abs(deltaX) > game.maxSpeed){
				deltaX = game.maxSpeed * Math.abs(deltaX) / (deltaX);
			}
			game.offsetLeft += deltaX;
		}else{
			return true;
		}
		if(game.offsetLeft < game.minOffset){
			game.offsetLeft = game.minOffset;
			return true; 
		}else if(game.offsetLeft > game.maxOffset){
			game.offsetLeft = game.maxOffset;
			return true;
		}
		return false;
	}
}

var levels = {
	data:[
	{foreground:'desert-foreground', background:'clouds-background', 
	entities:[
	{type:"ground", name:"dirt", x:500, y:440, width:1000, height:20, isStatic:true},//This is the example
	{type:"block", name:"wood", x:520, y:375, angle:90, width:300, height:50},
	]},
	{foreground:'desert-foreground', background:'clouds-background', entities:[]}
	],
	
	init:function(){
		var html = "";
		for(var i = 0;i < levels.data.length;i++){
			var level = levels.data[i];
			html += '<input type="button" value="' + (i + 1) + '">';
		};
		$('#levelselectscreen').html(html);
		$('#levelselectscreen input').click(function(){
			levels.load(this.value - 1);
			$('#levelselectscreen').hide();
		});
	},
	
	load:function(number){
		box2d.init();
		game.currentLevel = {number:number, hero:[]};
		game.score = 0;
		$('#score').html('分数 ' + game.score);
		var level = levels.data[number];
		game.currentLevel.backgroundImage = loader.loadImage("images/backgrounds/" + level.background + ".png");//Image Loader
		game.currentLevel.foregroundImage = loader.loadImage("images/backgrounds/" + level.foreground + ".png");
		game.slingshotImage = loader.loadImage("images/slingshot.png");
		game.slingshotFrontImage = loader.loadImage("images/slingshot-front.png");//Load the slingshot-front.png
		for(var i = level.entities.length - 1;i >= 0;i--){
			var entity = level.entites[i];
			entities.create(entity);
		}
		if(loader.loaded){
			game.start();
		}else{
			loader.onload = game.start;
		}
	},
	
}

var loader = {
	loaded:true, loadedCount:0, totalCount:0,
	init:function(){
		var mp3Support, oggSupport;
		var audio = document.createElement('audio');//Audio supports, with ogg, mp3 and mp4.
		if(audio.canPlayType){
			mp3Support = "" != audio.canPlayType('audio/mpeg');
			oggSupport = "" != audio.canPlayType('audio/ogg;codecs = "vorbis"');
		}else{
			mp3Support = false;
			oggSupport = false;
		}
		loader.soundFileExtn = oggSupport ? ".ogg":mp3Support ? ".mp3":undefined;
	},
	
	loadImage:function(url){
		this.totalCount++;
		this.loaded = false;
		$('#loadingscreen').show();
		var image = new Image();
		image.src = url;
		image.onload = loader.itemLoaded;
		return image;
	},
	
	soundFileExtn:".ogg",
	loadSound:function(url){
		this.totalCount++;
		this.loaded = false;
		$('loadingscreen').show();
		var audio = new Audio();
		audio.src = url + loader.soundFileExtn;
		audio.addEventListener('canplaythrough', loader.itemLoaded, false);
		return audio;
	},
	
	itemLoaded:function(){
		loader.loadedCount++;
		$('#loadingmessage').html('Loaded ' + loader.loadedCount + ' of ' + loader.totalCount);//The loading part
		if(loader.loadedCount === loader.totalCount){
			loader.loaded = true;
			$('#loadingscreen').hide();
			if(loader.onload){
				loader.onload();
				loader.onload = undefined;
			}
		}
	}
}

var mouse = {
	x:0, y:0, down:false, 
	init:function(){
		$('#gamecanvas').mousemove(mouse.mousemovehandler);//Mouse container
		$('#gamecanvas').mousedown(mouse.mousedownhandler);
		$('#gamecanvas').mouseup(mouse.mouseuphandler);
		$('#gamecanvas').mouseout(mouse.mouseuphandler);
	},

	mousemovehandler:function(ev){
		var offset = $('#gamecanvas').offset();
		mouse.x = ev.pageX - offset.left;//Mouse coordinate
		mouse.y = ev.pageY - offset.top;
		if(mouse.down){
			mouse.dragging = true;
		}
	},
	
	mousedownhandler:function(ev){
		mouse.down = true;
		mouse.downX = mouse.x;
		mouse.downY = mouse.y;
		ev.originalEvent.preventDefault();
	},
	
	mouseuphandler:function(ev){
		mouse.down = false;
		mouse.dragging = false;
	}
	//eventAdapt();  this is the touch part!Still not finished!!!
}

var entities = {    																	/*Attension! This is the part of the items!You canchange these code yourself!!!*/ 
	definitions:{																		
		"glass":{
			fullHealth:100, density:2.4, friction:0.4, restitution:0.15,
		},
		"wood":{
			fullHealth:550, density:0.7, friction:0.4, restitution:0.4,
		},
		"dirt":{
			density:3.0, friction:1.5, restitution:0.2,
		},
		"redbird":{
			shape:"circle", fullHealth:40, radius:25, density:1, friction:0.5, restitution:0.4,
		},
		"bluebird":{
			shape:"circle", fullHealth:60, radius:40, density:1, friction:0.5, restitution:0.7,
		},
		"yellowbird":{
			shape:"rectangle", fullHealth:30, width:20, height:25, density:1, friction:0.5, restitution:0.4,
		},
		"flappybird":{
			shape:"circle", radius:30, density:1.5, friction:0.5, restitution:0.4,
		}
	},
	/*create:function(entity){
		var definition = entities.definitions[entity.name];
		if(!definition){
			console.log("Alert!Undefined item:  ", entity.name);
			return;
		}
		switch(entity.type){
			case "block":
			entity.health = definition.fullHealth;
			entity.fullHealth = definition.fullHealth;
			entity.shape = "rectangle";//Itme loader type;;
			entity.sprite = loader.loadImage("images/entities/" + entity.name + ".png");
			box2d.createRectangle(entity, definition);
			break;
			case "ground":
			entity.shape = "rectangle";
			box2d.createRectangle(entity, definition);
			break;
			case "hero":
			case "villain":
			entity.health = definition.fullHealth;
			entity.fullHealth = definition.fullHealth;
			entity.sprite = loader.loadImage("images/entities/" + entity.name + ".png");
			entity.shape = definition.shape;
			if(definition.shape == "circle"){
				entity.radius = definition.radius;
			}else if(definition.shape == "rectangle"){
				entity.width = definition.width;
				entity.height = definition.height;
				box2d.createRectangle(entity, definition);
			}
			break;
			default:
			console.log("Alert! Item undefiend: ", entity.type);
			break;
		}
	},
	draw:function(entity, position, angle){
		//Not Added;;
	}*/
}

var box2d = {
	scale:30, 
	init:function(){
		var gravity = new b2Vec2(0, 9.8);
		var allowSleep = true;
		box2d.world = new b2World(gravity, allowSleep);
		var debugContext = document.getElementById('debugcanvas').getContext('2d');
		var debugDraw = new b2DebugDraw();
		//debugDraw.setSprite()//Still Not Finished
	},
	
	createRectangle:function(entity, definition){
		var bodyDef = new b2BodyDef;
		if(entity.isStatic){
			bodyDef.type = b2Body.b2_staticBody;
		}else{
			bodyDef.type = b2Body.b2_dynamicBody;
		}
		bodyDef.position.x = entity.x / box2d.scale;
		bodyDef.position.y = entity.y / box2d.scale;
		if(entity.angle){
			bodyDef.angle = Math.PI / entity.angle / 180;
		}
		var fixtureDef = new b2FixtureDef;
		fixtureDef.density = definition.density;
		fixtureDef.friction = definition.friction;
		fixtureDef.restitution = definition.restitution;
		fixtureDef.shape = new b2PolygonShape;
		fixtureDef.shape.SetAsBox(entity.width / 2 / box2d.scale, entity.height / 2 / box2d.scale);
		var body = box2d.world.CreateBody(bodyDef);
		body.SetUserData(entity);
		var fixture = body.CreateFixture(fixtureDef);
		return body;
	},
	
	createCircle:function(entity, definition){
		var bodyDef = new b2BodyDef;
		if(entity.isStatic){
			bodyDef.type = b2Body.b2_staticBody;
		}else{
			bodyDef.type = b2Body.b2_dynamicBody;
		}
		bodyDef.position.x = entity.x / box2d.scale;
		bodyDef.position.y = entity.y / box2d.scale;
		if(entity.angle){
			bodyDef.angle = Math.PI * entity.angle / 180;
		}
		var fixtureDef = new b2FixtureDef;
		fixtureDef.density = definition.density;
		fixtureDef.friction = definition.friction;
		fixtureDef.restitution = definition.restitution;
		fixtureDef.shape = new b2CircleShape(entity.radius / box2d.scale);
		var body = box2d.world.CreateBody(bodyDef);
		body.SetUserData(entity);
		var fixture = body.CreateFixture(fixtureDef);
		return body;
	},
}

