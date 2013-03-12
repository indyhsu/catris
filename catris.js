var canvas;
var context;
var size = 30;
var speed = 500;
var ticker = null;
var gridcolor = '#eeeeee';
var shapes = {
	i: [[['0/i_01',0,0,0],['0/i_02',0,0,0],['0/i_03',0,0,0],['0/i_04',0,0,0]],
		[[0,0,0,0],['90/i_04','90/i_03','90/i_02','90/i_01'],[0,0,0,0],[0,0,0,0]],
		[[0,0,'180/i_04',0],[0,0,'180/i_03',0],[0,0,'180/i_02',0],[0,0,'180/i_01',0]],
		[[0,0,0,0],[0,0,0,0],['270/i_01','270/i_02','270/i_03','270/i_04'],[0,0,0,0]]],
	
	o: [[['0/o_01','0/o_02',0,0],['0/o_03','0/o_04',0,0],[0,0,0,0],[0,0,0,0]],
		[['90/o_03','90/o_01',0,0],['90/o_04','90/o_02',0,0],[0,0,0,0],[0,0,0,0]],
		[['180/o_04','180/o_03',0,0],['180/o_02','180/o_01',0,0],[0,0,0,0],[0,0,0,0]],
		[['270/o_02','270/o_04',0,0],['270/o_01','270/o_03',0,0],[0,0,0,0],[0,0,0,0]]],
	
	l: [[[0,0,'0/l_01',0],['0/l_02','0/l_03','0/l_04',0],[0,0,0,0],[0,0,0,0]],
		[[0,'90/l_02',0,0],[0,'90/l_03',0,0],[0,'90/l_04','90/l_01',0],[0,0,0,0]],
		[[0,0,0,0],['180/l_04','180/l_03','180/l_02',0],['180/l_01',0,0,0],[0,0,0,0]],
		[['270/l_01','270/l_04',0,0],[0,'270/l_03',0,0],[0,'270/l_02',0,0],[0,0,0,0]]],
	
	j: [[['0/j_01',0,0,0],['0/j_02','0/j_03','0/j_04',0],[0,0,0,0],[0,0,0,0]],
		[[0,'90/j_02','90/j_01',0],[0,'90/j_03',0,0],[0,'90/j_04',0,0],[0,0,0,0]],
		[[0,0,0,0],['180/j_04','180/j_03','180/j_02',0],[0,0,'180/j_01',0],[0,0,0,0]],
		[[0,'270/j_04',0,0],[0,'270/j_03',0,0],['270/j_01','270/j_02',0,0],[0,0,0,0]]],
	
	t: [[[0,'0/t_01',0,0],[0,'0/t_02','0/t_03',0],[0,'0/t_04',0,0],[0,0,0,0]],
		[[0,0,0,0],['90/t_04','90/t_02','90/t_01',0],[0,'90/t_03',0,0],[0,0,0,0]],
		[[0,'180/t_04',0,0],['180/t_03','180/t_02',0,0],[0,'180/t_01',0,0],[0,0,0,0]],
		[[0,'270/t_03',0,0],['270/t_01','270/t_02','270/t_04',0],[0,0,0,0],[0,0,0,0]]],
	
	s: [[['0/s_01',0,0,0],['0/s_02','0/s_03',0,0],[0,'0/s_04',0,0],[0,0,0,0]],
		[[0,'90/s_02','90/s_01',0],['90/s_04','90/s_03',0,0],[0,0,0,0],[0,0,0,0]],
		[[0,'180/s_04',0,0],[0,'180/s_03','180/s_02',0],[0,0,'180/s_01',0],[0,0,0,0]],
		[[0,0,0,0],[0,'270/s_03','270/s_04',0],['270/s_01','270/s_02',0,0],[0,0,0,0]]],
	
	z: [[[0,0,'0/z_01',0],[0,'0/z_02','0/z_03',0],[0,'0/z_04',0,0],[0,0,0,0]],
		[[0,0,0,0],['90/z_04','90/z_02',0,0],[0,'90/z_03','90/z_01',0],[0,0,0,0]],
		[[0,0,'180/z_04',0],[0,'180/z_03','180/z_02',0],[0,'180/z_01',0,0],[0,0,0,0]],
		[[0,0,0,0],['270/z_01','270/z_03',0,0],[0,'270/z_02','270/z_04',0],[0,0,0,0]]],
};

var imgCache = {};

current = {
	shape: null,
	x: 4,
	y: 0,
	r: 0,
	countdown: 3,
	next: null
};

var theQueue = $({}); 

var tetris = {
	unpressed: true,
	score: 0,
	lines: 0,
	speed: 500, //ms per tick
	init: function() {
		tetris.cacheMeUp();
		tetris.matrix = [[1,0,0,0,0,0,0,0,0,0,0,1],	//this is what happens when you're too lazy to check for bounds
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1]];
		
		tetris.nextShape();
		tetris.nextShape();

		tetris.drawGrid();

		//init handlers
		var key = { space: 32, left: 37, up: 38, right: 39, down: 40 };

		$(document).keydown(function(e){
			switch(e.keyCode){ //start and pause
				case 80: //p or P
				case 112: {
					tetris.pause();
					break;
				}
				case 83: //s or S
				case 115: {
					tetris.start();
					break;
				}
			}
			if(tetris.unpressed && ticker){
			    switch(e.keyCode){
			    	case 37: {//left
			    		theQueue.queue(tetris.move('left'));
			    		theQueue.dequeue();
			    		break;
			    	}
			    	case 39: {//right
			    		theQueue.queue(tetris.move('right'));
			    		theQueue.dequeue();
			    		break;
			    	}
			    	case 40: {//down
			    		theQueue.queue(tetris.down());
			    		theQueue.dequeue();
			    		break;
			    	}
			    	case 38: {//up
			    		theQueue.queue(tetris.rotate());
			    		theQueue.dequeue();
			    		break;
			    	}
			    	case 32: {//space
			    		theQueue.queue(tetris.drop());
			    		theQueue.dequeue();
			    		break;
			    	}
			    }
			    tetris.unpressed = true;
			}

		});
	},
	cacheMeUp: function(){
		//cache me up, before you go-go		
		var rotations = ['0','90','180','270'];
		for(var r = 0; r <= 3; r++){
			for (var key in shapes) {
				var obj = shapes[key];
				for (var i = 1; i <= 4; i++){
					var img = new Image();
					img.src = 'img/'+rotations[r]+'/'+key+'_0'+i+'.png';
					imgCache[rotations[r]+'/'+key+'_0'+i] = img;
				}
			}
		}
	},
	drawGrid: function() {
		//context.fillStyle="#FFFFFF";
		//context.fillRect(0,0,canvas.width,canvas.height);

		context.strokeStyle = gridcolor;
		context.lineWidth = 1;
		
		var n;
		for(n=.5;n<=canvas.width+.5;n+=size){
			context.beginPath();
			context.moveTo(n, 0);
			context.lineTo(n, canvas.height);
    		context.stroke();
		}
		for(n=.5;n<=canvas.height+.5;n+=size){
			context.beginPath();
			context.moveTo(0, n);
			context.lineTo(canvas.width, n);
    		context.stroke();
		}
	},
	tick: function() {
		console.log('tick');
		theQueue.queue(tetris.down());
	},
	drop: function() {
		//keypress: spacebar
		//drops a piece to end, if possible
		console.log("drop");
		tetris.removeSelf();
		var x0 = current.x;
		var y0 = current.y + 1;
		while(tetris.canMove(current.r,x0,y0+1)){
			var y0 = y0 + 1;	//how low can you go?
			console.log(y0);
		}
		current.y = y0;	//this low
		tetris.update(current.r,current.x,current.y);
		current.countdown--;
		theQueue.dequeue();
	},
	removeSelf: function() {
		//erases from old position
		for (m = 0; m < 4; m++) {	//row first (y=m)
			for (n = 0; n < 4; n++) {	//then column (x=n)
				//iterate through each cell of the 4x4
				if (current.shape[current.r][m][n]) {	//if the cell is nonzero for the shape
					tetris.matrix[current.y+m][current.x+n+1] = 0; 
					tetris.repaint(current.x+n,current.y+m);
				}
			}
		}
	},
	move: function(dir) {
		//moves the block if there's no collision
		var y0 = current.y;
		var x0 = current.x + ((dir == "left") ? -1 : 1);
		tetris.removeSelf();
		if(tetris.canMove(current.r,x0,y0)){
			current.x = x0;
			current.y = y0;
		}
		tetris.update(current.r,current.x,current.y);
	},
	down: function() {
		//moves the block if there's no collision
		tetris.removeSelf();
		var x0 = current.x;
		var y0 = current.y + 1;
		if(tetris.canMove(current.r,x0,y0)){
			current.x = x0;
			current.y = y0;
		}
		else{
			console.log("time to go");
			if(--current.countdown <= 0){
				tetris.update(current.r,current.x,current.y);
				theQueue.queue(tetris.touchdown());
			}
		}
		tetris.update(current.r,current.x,current.y);
		theQueue.dequeue();
	},
	canMove: function(r0,x0,y0) {
		//is someone in my way?
		console.log('can i move?');
		var m,n;
		for (m = 0; m < 4; m++) {
			for (n = 0; n < 4; n++) {
				if( current.shape[r0][m][n] && tetris.matrix[y0 + m][x0 + n+1]){
					console.log('i cant move');
					return false;
				}
			}
		}
		return true;
	},
	rotate: function() {
		tetris.removeSelf();
		var r0 = (current.r + 1) % 4;
		if(tetris.canMove(r0,current.x,current.y)){
			console.log('cant rotate nooo');
			current.r = r0;
		}
		tetris.update(current.r,current.x,current.y);
	},
	touchdown: function() {
		var m = 19;
		while(m>0){
			var n=10;
			while(tetris.matrix[m][n]){
				n--;
			}
			if(n<=0){
				tetris.clearLine(m);
				tetris.lines++;
				$('#numLines').html(tetris.lines);
			}
			else{
				console.log("nextline"+m);
				m--;
			}
    	}
    	theQueue.queue(tetris.refresh());
    	theQueue.queue(tetris.nextShape());
    	
    	theQueue.dequeue();
	},
	clearLine: function(y) {
		var m;
		for(m=y;m>0;m--){
			tetris.matrix[m]=tetris.matrix[m-1];
		}

	},
	nextShape: function() {
		//reset current shape
		current.shape = current.next;
		current.x = 4;
		current.y = 0;
		current.r = 0;
		current.countdown = 3;
		
		//generates a new next shape
		var l = Object.keys(shapes).length;
		var r = Math.floor( Math.random() * l);
		var s = Object.keys(shapes)[r];
		current.next = shapes[s];
		theQueue.dequeue();
	},
	update: function(r,x,y) {
		//updates position of current block
		var m,n;
		for (m = 0; m < 4; m++) {	//row first (y=m)
			for (n = 0; n < 4; n++) {	//then column (x=n)
				//iterate through each cell of the 4x4
				if (current.shape[r][m][n]) {	//if the cell is nonzero for the shape
					tetris.matrix[y+m][x+n+1] = current.shape[r][m][n]; 
					tetris.repaint(x+n,y+m);
					//console.log('('+current.x+','+current.y+')');
				}
				//tetris.repaint(x+n,y+m);
			}
		}
		
		var mm = (current.y > 0) ? (current.y - 1) : 0;
		var nn = (current.x > 0) ? (current.x - 1) : 0;

		// for(m = Math.max(current.y-1, 0); m < Math.min(current.y+4,20); m++){
		// 	for(n = Math.max(current.x-1, 0); n< Math.min(current.x+4,20); n++){
		// 		console.log("painting " + n + ","+ m);
		// 		tetris.repaint(n,m);
				
		// 	}
		// }
	},
	repaint: function(x,y){
		//maps cats to the matrix on canvas

		//context.strokeStyle = gridcolor;
		//context.lineWidth = 1;
		if(!tetris.matrix[y][x+1] || tetris.matrix[y][x+1]==1){
			context.strokeRect(x*size+.5,y*size+.5,size,size);
			context.clearRect(x*size+.5,y*size+.5,size,size);
		}
		else{
			context.clearRect(x*size+.5,y*size+.5,size,size);
			if(imgCache[tetris.matrix[y][x+1]]){
				context.drawImage(imgCache[tetris.matrix[y][x+1]], x*size, y*size, size, size);
			}
			else{
				var img = new Image();
				img.src = 'img/'+tetris.matrix[y][x+1]+'.png';
				img.onload = function () {
					context.drawImage(img, x*size, y*size, size, size);
					console.log('nooooooooo');
				};	
			}
		}
		theQueue.dequeue();
		
	},
	refresh: function(){
		var m,n;
		var count = 0;
		for (m = 0; m < tetris.matrix.length; m++) {	//row first (y=m)
			for (n = 0; n < tetris.matrix[0].length; n++) {	//then column (x=n)
				theQueue.queue(tetris.repaint(n,m));
				count++;
			}
		}
		console.log("cleared "+count);
		theQueue.dequeue();
		
	},
	start: function() {
		ticker = window.setInterval(tetris.tick, speed);
		console.log('start game');
		$('#start')[0].disabled = true;
		$('#pause')[0].disabled = false;
	},
	pause: function(){
		window.clearInterval(ticker);
		ticker = null;
		$('#start')[0].disabled = false;
		$('#pause')[0].disabled = true;
	}
}
$(document).ready(function(){
	canvas = $('#grid')[0];
	canvas.width = 10*size;
	canvas.height = 20*size;
	context = canvas.getContext('2d');
	tetris.init();
	$('#pause')[0].disabled = true;
	$('#start').click(function(){
		tetris.start();
	});
	$('#pause').click(function(){
		tetris.pause();
	});
});

