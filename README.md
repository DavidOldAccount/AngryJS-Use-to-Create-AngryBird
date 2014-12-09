AngryJS-Use-to-Create-AngryBird
===============================

The Game Engine That Can Use To Make AngryBird Games.Include the support for ogg and mp3, mp4.
Some images included : http://pan.baidu.com/s/1o6qjch0    

Tutorial:
     Due to the engine being based on JQuery and Box2D, to use this engine, those software components need to be downloaded before you 
use the engine. For your convenience, here are the download links:
JQuery:  www.JQuery.com         Box2D:  www.box2d.com

JQuery is a very important engine for JavaScript.  
Box2D is a physics engine.

How to use AngryJS engine:
     First, open “skeleton.html”, then you’ll see a couple dozen lines of code which include the following game functions:
               
    		<span id=“score”>Score: 0</span>
or:


		<p id=“playcurrentlevel” onclick=“game.restartLevel();”><img src=“images/icons/prev.png”>Restart This Level</p>	


      
You can change the contents to suit the game that you are programming.


Second, open “style.css”, then you can edit the CSS of your game’s main page. Find the following code: 



		background:url(images/yourImage.jpg);       //It can also be .png, and it’s not a string!



Once you've found it,  study the following example to understand how it works:



		background:url(images/splashscreen.jpg);   /*Although the command “background;url(images)” is the same in both cases, it is            							         			used to display different images, which may be used in different ways by other accompanying code. 


												       				For example, some are for icons, others are for characters. */



The CSS code is divided into blocks. Each block has a different purpose.



     Third, open “game.js”, then find the an object called “level”, and locate an array called “entities”. After that, you can edit the game map by the array:

		
		
		
		{type:”itemType”, name:”itemName”, x:coordinateX, y:coordinateY, width:width, height:height, isStatic:boolean},




Here’s an example of this:

		
		
		
		{type:”ground”, name:”wood”, x:100, y:100, width:40, height:20, isStatic:true},





Using this array, you can edit the map easily. Simply change the numbers or names to fit your game’s specifications.
Comments are embedded clearly in the code. You can learn more this way.
