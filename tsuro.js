function TsuroState(canvas) {
	this.margin = 40;
	this.grid = 6;
	this.path_spacing = .15;
	this.ticker_length = .25;
	this.board = [[],[],[],[],[],[],[],[]];
	this.boardAlphas = [[],[],[],[],[],[],[],[]];
	this.players = [];
	this.hand_size = 3; //this.grid*this.grid; //3
	this.next_player = 0;
	this.current_player = 0;
	if(window.location.hash) {
		if(0 < window.location.hash.substring(1) && 9 > window.location.hash.substring(1)) {
			this.total_players = window.location.hash.substring(1);
		} else {
			this.total_players = 8;
		}
	} else {
		this.total_players = 8;
	}
	this.tile_w = 60;
	this.tile_h = 60;
	if(false) {
		this.stack = [];
		for(var t = 0; t < this.grid*this.grid - 1; t++) {
			var remainingTileLocs = [0, 1, 2, 3, 4, 5, 6, 7];
			var newTileLocs = [-1, -1, -1, -1, -1, -1, -1, -1];
			for(var l = 0; l < 8; l++) {
				if(newTileLocs[l] == -1) {
					remainingTileLocs.splice(remainingTileLocs.indexOf(l), 1);
					var to = remainingTileLocs[Math.floor(Math.random()*remainingTileLocs.length)];
					remainingTileLocs.splice(remainingTileLocs.indexOf(to), 1);
					newTileLocs[l] = to;
					newTileLocs[to] = l;
					
				}
			}
			tile = new TsuroTile(newTileLocs, this.tile_w, this.tile_h);
			this.stack[this.stack.length] = tile;
		}
	} else {
		this.stack = [new TsuroTile([7,4,5,6,1,2,3,0],this.tile_w,this.tile_h),
				new TsuroTile([6,5,4,7,2,1,0,3],this.tile_w,this.tile_h),
				new TsuroTile([6,5,7,4,3,1,0,2],this.tile_w,this.tile_h),
				new TsuroTile([6,4,5,7,1,2,0,3],this.tile_w,this.tile_h),
				new TsuroTile([2,3,0,1,6,7,4,5],this.tile_w,this.tile_h),
				new TsuroTile([3,4,5,0,1,2,7,6],this.tile_w,this.tile_h),
				new TsuroTile([5,3,4,1,2,0,7,6],this.tile_w,this.tile_h),
				new TsuroTile([4,5,6,7,0,1,2,3],this.tile_w,this.tile_h),
				new TsuroTile([5,4,7,6,1,0,3,2],this.tile_w,this.tile_h),
				new TsuroTile([5,3,6,1,7,0,2,4],this.tile_w,this.tile_h),
				new TsuroTile([1,0,7,6,5,4,3,2],this.tile_w,this.tile_h),
				new TsuroTile([3,2,1,0,6,7,4,5],this.tile_w,this.tile_h),
				new TsuroTile([3,2,1,0,7,6,5,4],this.tile_w,this.tile_h),
				new TsuroTile([6,3,7,1,5,4,0,2],this.tile_w,this.tile_h),
				new TsuroTile([7,2,1,4,3,6,5,0],this.tile_w,this.tile_h),
				new TsuroTile([4,5,7,6,0,1,3,2],this.tile_w,this.tile_h),
				new TsuroTile([6,7,3,2,5,4,0,1],this.tile_w,this.tile_h),
				new TsuroTile([4,2,1,6,0,7,3,5],this.tile_w,this.tile_h),
				new TsuroTile([3,6,5,0,7,2,1,4],this.tile_w,this.tile_h),
				new TsuroTile([4,5,3,2,0,1,7,6],this.tile_w,this.tile_h),
				new TsuroTile([2,7,0,4,3,6,5,1],this.tile_w,this.tile_h),
				new TsuroTile([5,2,1,4,3,0,7,6],this.tile_w,this.tile_h),
				new TsuroTile([3,7,5,0,6,2,4,1],this.tile_w,this.tile_h),
				new TsuroTile([4,7,3,2,0,6,5,1],this.tile_w,this.tile_h),
				new TsuroTile([4,6,5,7,0,2,1,3],this.tile_w,this.tile_h),
	            new TsuroTile([7,6,3,2,5,4,1,0],this.tile_w,this.tile_h),
	            new TsuroTile([4,3,6,1,0,7,2,5],this.tile_w,this.tile_h),
				new TsuroTile([1,0,4,7,2,6,5,3],this.tile_w,this.tile_h),
				new TsuroTile([6,4,7,5,1,3,0,2],this.tile_w,this.tile_h),
				new TsuroTile([2,7,0,5,6,3,4,1],this.tile_w,this.tile_h),
				new TsuroTile([2,6,0,4,3,7,1,5],this.tile_w,this.tile_h),
				new TsuroTile([1,0,6,5,7,3,2,4],this.tile_w,this.tile_h),
				new TsuroTile([4,2,1,7,0,6,5,3],this.tile_w,this.tile_h),
				new TsuroTile([3,5,4,0,2,1,7,6],this.tile_w,this.tile_h),
				//new TsuroTile([1,0,3,2,5,4,7,6],this.tile_w,this.tile_h), //dupe
				new TsuroTile([1,0,3,2,5,4,7,6],this.tile_w,this.tile_h)]; 
	}
	this.starts = [];
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.width = canvas.width;
	this.height = canvas.height;
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
	  this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
	  this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
	  this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
	  this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
	}
	var html = document.body.parentNode;
	this.htmlTop = html.offsetTop;
	this.htmlLeft = html.offsetLeft;
	
	this.valid = false; // when set to false, the canvas will redraw everything
	this.dragging = false; // Keep track of when we are dragging
	this.selection = new TsuroTile(null, null, null, null);
	this.dragoffx = 0; // See mousedown and mousemove events for explanation
	this.dragoffy = 0;
	this.mx = 0;
	this.my = 0;
	
	var myState = this;
	  
	//fixes a problem where double clicking causes text to get selected on the canvas
	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
	// Up, down, and move are for dragging
	document.body.addEventListener('keyup', function(k) {		
		if(!myState.game_started && k.which > 48 && k.which < 57) {
			myState.total_players = k.which - 48;
		}
	});
	canvas.addEventListener('mousedown', function(e) {
		if (! myState.dragging){
			var mouse = myState.getMouse(e);
			myState.mx = mouse.x;
			myState.my = mouse.y;
			var h = myState.clickToHand(myState.mx, myState.my);
			if(h != -1) {
				myState.selection.dx = myState.mx - myState.grid_w - Math.floor(h/myState.grid)*myState.tile_w;
				myState.selection.dy = myState.my - myState.margin - (h%myState.grid)*myState.tile_h;
				myState.selection.tile = myState.players[myState.current_player].hand[h];
				myState.selection.from_hand = h;
				//myState.players[myState.current_player].hand.splice(h,1);
				myState.players[myState.current_player].hand[h] = new TsuroTile(null, null, null, null);
				myState.dragging = true;
				myState.draw();
			}
		    // havent returned means we have failed to select anything.
		    // If there was an object selected, we deselect it
		    if (myState.selection) {
		      myState.valid = false; // Need to clear the old selection border
		    }
		}
	  }, true);
	  canvas.addEventListener('mousemove', function(e) {
	    if (myState.dragging){
	      var mouse = myState.getMouse(e);
	      myState.mx = mouse.x;
	      myState.my = mouse.y;
	      // We don't want to drag the object by its top-left corner, we want to drag it
	      // from where we clicked. Thats why we saved the offset and use it here
	      //myState.draw();
	      myState.valid = false; // Something's dragging so we must redraw
	    }
	  }, true);
	  canvas.addEventListener('mouseup', function(e) {
		  var mouse = myState.getMouse(e);
	      myState.mx = mouse.x;
	      myState.my = mouse.y;
	      if(myState.game_started == false) {
	    	  pos = myState.startPosition(myState.mx, myState.my);
	    	  
	    	  if(pos != -1 && myState.starts.indexOf(pos) == -1) {
	    		 myState.starts[myState.starts.length - 1] = pos;
	    		 
	    		 start = pos;
				po = Math.floor(start / (myState.grid*2))*2 + start % 2;
				switch(Math.floor(start / (myState.grid * 2))) {
					case 0:
						x = -1;
						y = Math.floor(start / 2);
						break;
					case 1:
						y = -1;
						x = Math.floor((start - 2* myState.grid)/2);
						break;
					case 2: 
						x = myState.grid;
						y = Math.floor((start - 4*myState.grid)/2);
						break;
					case 3:
						y = myState.grid;
						x = Math.floor((start  - 6*myState.grid)/2);
						break;
				}
				br = .75;
				p = myState.starts.length;
				switch(p) {
					case 0:
						cr = 255;
						cg = 80;
						cb = 80;
						break;
					case 1:
						cr = 255;
						cg = 170;
						cb = 80;
						break;
					case 2:
						cr = 255;
						cg = 255;
						cb = 80;
						break;
					case 3:
						cr = 80;
						cg = 255;
						cb = 80;
						break;
					case 4:
						cr = 80;
						cg = 80;
						cb = 255;
						break;
					case 5:
						cr = 255;
						cg = 80;
						cb = 255;
						break;
					case 6:
						cr = 170;
						cg = 170;
						cb = 170;
						break;
					case 7:
						cr = 80;
						cg = 80;
						cb = 80;
						break;
					default:
						cr = 255;
						cg = 80;
						cb = 80;
						break;
				}
				myState.players[p] = new TsuroPlayer([], new TsuroLocation(x, y, po), Math.floor(br*cr), Math.floor(br*cg), Math.floor(br*cb));
				myState.players[p].path.push(myState.players[p].location);
				myState.starts.length++;
				if(p == myState.total_players - 1) {
			    	  myState.game_started = true;
			    	  myState.loadTsuro();
				}
	    	  }
	      }
	      if (myState.dragging){
	    	  myState.dragging = false;
		      if(myState.clickToHand(myState.mx, myState.my) == myState.selection.from_hand) {
		    	myState.rotateTile(myState.selection.tile);
		    	myState.players[myState.current_player].hand[myState.selection.from_hand] = myState.selection.tile;
		    	myState.selection = new TsuroTile(null, null, null, null);
		      } else if(myState.clickToHand(myState.mx, myState.my) != -1) {
		    	  myState.players[myState.current_player].hand[myState.selection.from_hand] = myState.players[myState.current_player].hand[myState.clickToHand(myState.mx, myState.my)];
		    	  myState.players[myState.current_player].hand[myState.clickToHand(myState.mx, myState.my)] = myState.selection.tile;
		    	  myState.selection = new TsuroTile(null, null, null, null);
		      } else if(myState.clickToActive(myState.mx, myState.my)) {
		    	active = myState.players[myState.current_player].location.activeLocation();
		    	myState.board[active.x][active.y] = myState.selection.tile;
		    	myState.selection = new TsuroTile(null, null, null, null);
		    	myState.movePlayers();
		    	myState.current_player = (myState.current_player + 1) % myState.players.length;
		    	dead_count = 0;
		    	while(dead_count < myState.total_players && (myState.countHand(myState.players[myState.current_player].hand) == 0 || !myState.players[myState.current_player].alive)) {
		    		dead_count++;
			    	myState.current_player = (myState.current_player + 1) % myState.players.length;
		    	}
		    	myState.pullFromStack();
		      } else {
		    	myState.players[myState.current_player].hand[myState.selection.from_hand] = myState.selection.tile;
		    	myState.selection = new TsuroTile(null, null, null, null);
		      }
	      }
	      
	      dead_count = 0;
	      while(myState.game_started && myState.current_player != -1 && 
	    		  dead_count < myState.total_players 
	    			&& myState.players[myState.current_player].alive == false 
	    			&& myState.countHand(myState.players[myState.current_player]) == 0) {
	    		dead_count++;
	    		myState.current_player = (myState.current_player + 1) % myState.players.length;
	    		if(dead_count == myState.total_players)
	    			myState.current_player = -1;
	    }
	      
	      myState.draw();
	  }, true);
	  window.addEventListener('resize', function(e) {
		  myState.draw();
	  }, true);
	
	this.startPosition = function(x, y) {
		
		//Put in grid context
		x = x - this.margin;
		y = y - this.margin;
		
		for(s = 0; s < this.grid*8; s++) {
			so = Math.floor(s / (this.grid*2))*2 + s % 2;
			switch(Math.floor(s / (this.grid * 2))) {
			case 0:
				sx = -1;
				sy = Math.floor(s / 2);
				break;
			case 1:
				sy = -1;
				sx = Math.floor((s - 2* this.grid)/2);
				break;
			case 2: 
				sx = this.grid;
				sy = Math.floor((s - 4*this.grid)/2);
				break;
			case 3:
				sy = this.grid;
				sx = Math.floor((s  - 6*this.grid)/2);
				break;
			}
			
			tileLoc = this.pointToPixel(so);
			
			sx = this.tile_w * sx + tileLoc[0];
			sy = this.tile_h * sy + tileLoc[1];
			
			r = this.ticker_length/2 * this.tile_w;
			
			if(Math.pow(r,2) > Math.pow(sx - x, 2) + Math.pow(sy - y, 2)) {
				return s;
			}
		}
		
		return -1;
	};
	  
	this.initiateTsuro = function() {
		this.players_initiated = false;
		this.game_started = false;
		
		this.ctx.strokeStyle = "rgba(236,222,201,1)";
		this.ctx.lineWidth = 2;
		
		var w = this.canvas.width;
		var h = this.canvas.height;
		var grid_w = this.grid*this.tile_w +2*this.margin;
		var grid_h = this.grid*this.tile_h + 2*this.margin;
		
		this.grid_w = grid_w;
		this.grid_h = grid_h;
		
		for(x = 0; x < this.grid; x++) {
			this.board[x] = [];
			this.boardAlphas[x] = 0;
			for(y = 0; y < this.grid; y++) {
				this.board[x][y] = [];
				this.boardAlphas[x][y] = 0;
			}
		}
		
		setInterval(myState.draw, 15);
		this.draw();
	};
	  
	this.loadTsuro = function() {
			this.shuffleStack();
			this.fillHands();
			
			this.next_player = this.current_player;
			
			this.draw();
		};
	  
	this.rotateTile = function(tile) {
		if(tile != null && tile.t != null && tile.t.length == 8) {
			tile.rotate();
		}
	};
	
	this.shuffleStack = function() {
		dragon = this.stack.pop();
		for(var j, x, i = this.stack.length; i; j = Math.floor(Math.random() * i), x = this.stack[--i], this.stack[i] = this.stack[j], this.stack[j] = x);
		this.stack.forEach(function(tile) {
			rotates = Math.floor((Math.random()*4));
			while(--rotates > 0) {
				myState.rotateTile(tile);
			}
		});
		this.stack.push(dragon);
	};
	
	this.fillHands = function() {
		while(this.players[this.next_player].hand.length < this.hand_size && this.stack.length > 0) {
			this.players[this.next_player].hand.push(this.stack.shift());
			this.next_player = (this.next_player + 1) % this.total_players;
		}
	};
	
	this.pullFromStack = function() {
		if(this.stack.length > 0) {
			while(this.next_player != -1 && this.countHand(this.players[this.next_player].hand) < this.hand_size && this.stack.length > 0) {
				for(h = 0; h < this.hand_size; h++) {
					if(this.players[this.next_player].alive && (
							this.players[this.next_player].hand[h] == null ||
							typeof this.players[this.next_player].hand[h] == 'undefined' ||
							this.players[this.next_player].hand[h].t == null)) {
						this.players[this.next_player].hand[h] = this.stack.shift();
						this.next_player = (this.next_player + 1) % this.total_players;
						dead_count = 0;
						while(dead_count < myState.total_players && !this.players[this.next_player].alive) {
				    		dead_count++;
							this.next_player = (this.next_player + 1) % this.total_players;
						}
						h = this.hand_size;
					} 
				}
				if(!this.players[this.next_player].alive) {
					dead_count = 0;
					while(dead_count < myState.total_players && !this.players[this.next_player].alive) {
			    		dead_count++;
						this.next_player = (this.next_player + 1) % this.total_players;
					}
					if(dead_count == this.total_players) {
						this.next_player = -1;
					}
				}
			}
		}
	};
	
	this.countHand = function(hand) {
		count = 0;
		for(h = 0; h < hand.length; h++) {
			if(hand[h] != null && hand[h].t != null && hand[h].t.length == 8) {
				count++;
			}
		}
		
		return count;
	};
	
	this.movePlayers = function () {
		active = this.players[this.current_player].activeLocation();
		
		for(p = 0; p < this.total_players; p++) {
			player_active = this.players[p].activeLocation();
			
			if(active.x == player_active.x && active.y == player_active.y) {
				while(typeof this.board[player_active.x] != 'undefined' 
						&& typeof this.board[player_active.x][player_active.y] != 'undefined' 
						&& this.board[player_active.x][player_active.y] != null 
						&& this.board[player_active.x][player_active.y].t != null
						&& this.board[player_active.x][player_active.y].t.length != 0) {
					path = this.board[player_active.x][player_active.y].t[this.players[p].location.mirrorP()];
					this.players[p].location = new TsuroLocation(player_active.x, player_active.y, path);
					this.players[p].path.push(this.players[p].location);
					player_active = this.players[p].activeLocation();
				}
			}
			if(this.players[p].alive == true && (player_active.x == -1 || player_active.x == this.grid ||
					player_active.y == -1 || player_active.y == this.grid)) {
				this.players[p].alive = false;
				for(h = 0; h < this.players[p].hand.length; h++) {
					if(this.players[p].hand[h] != null && this.players[p].hand[h].t != null && this.players[p].hand[h].length != 0) {
						this.stack.push(this.players[p].hand[h]);
					}
				}
				this.players[p].hand = [];
				this.shuffleStack();
			}
		}
	};
	
	this.getMids = function(start, end) {		
		if(start % 2 == 1) {
			if(end < start)
				end += 8;
			val = end - start;
		} else {
			if(start < end) {
				start += 8;
			}
			val = start - end;
		}
		
		start_px = this.pointToPixel(start);
		end_px = this.pointToPixel(end);
		
		switch(val) {
			case 1:
				weight_x = this.tile_w*this.path_spacing;
				weight_y = this.tile_h*this.path_spacing;
				switch(start%8) {
					case 0:
						return [end_px[0] + weight_x, start_px[1], end_px[0], start_px[1] - weight_y];
						break;
					case 1:
						return [end_px[0] + weight_x, start_px[1], end_px[0], start_px[1] + weight_y];
						break;
					case 2:
						return [start_px[0], end_px[1] + weight_y, start_px[0] + weight_x , end_px[1]];
						break;
					case 3:
						return [start_px[0], end_px[1]+ weight_y, start_px[0] - weight_x , end_px[1]];
						break;
					case 4:
						return [end_px[0] - weight_x, start_px[1], end_px[0], start_px[1] + weight_y];
						break;
					case 5:
						return [end_px[0] - weight_x, start_px[1], end_px[0], start_px[1] - weight_y];
						break;
					case 6:
						return [start_px[0], end_px[1]- weight_y, start_px[0] - weight_x , end_px[1]];
						break;
					case 7:
						return [start_px[0], end_px[1]- weight_y, start_px[0] + weight_x, end_px[1]];
						break;
						
				}
				break;
			case 5:
				weight_x = this.tile_w*2*this.path_spacing;
				weight_y = this.tile_h*2*this.path_spacing;
				switch(start%8) {
					case 0:
						return [end_px[0] + weight_x, start_px[1], end_px[0], start_px[1] + weight_y];
						break;
					case 1:
						return [end_px[0] + weight_x, start_px[1], end_px[0], start_px[1] - weight_y];
						break;
					case 2:
						return [start_px[0], end_px[1] + weight_y, start_px[0] - weight_x , end_px[1]];
						break;
					case 3:
						return [start_px[0], end_px[1] + weight_y, start_px[0] + weight_x , end_px[1]];
						break;
					case 4:
						return [end_px[0] - weight_x, start_px[1], end_px[0], start_px[1] - weight_y];
						break;
					case 5:
						return [end_px[0] - weight_x, start_px[1], end_px[0], start_px[1] + weight_y];
						break;
					case 6:
						return [start_px[0], end_px[1] - weight_y, start_px[0] + weight_x , end_px[1]];
						break;
					case 7:
						return [start_px[0], end_px[1]- weight_y, start_px[0] - weight_x, end_px[1]];
						break;	
				}
				break;
			case 3:
				if(start % 4 == 0 || start % 4 == 1)
					return [end_px[0], start_px[1], end_px[0], start_px[1]];
				return [start_px[0], end_px[1], start_px[0], end_px[1]];
				break;
			case 2:
			case 6:
				pd = 0.2;
				x_dev = pd*(end_px[0] - start_px[0]);
				y_dev = pd*(end_px[1] - start_px[1]);
				switch(start % 4) {
					case 0:
					case 1:
						ret =  [end_px[0] - x_dev, start_px[1], end_px[0], start_px[1] + y_dev];
						break;
					case 2:
					case 3:
						ret =  [start_px[0], end_px[1] - y_dev, start_px[0] + x_dev, end_px[1]];
						break;

				}
				return ret;
				break;
			case 4:
				if(start % 4 == 0 || start % 4 == 1)
					return [this.tile_h/2, start_px[1], this.tile_h/2, end_px[1]];
				return [start_px[0], this.tile_w/2, end_px[0], this.tile_w/2];
			case 7:
				if(start % 4 == 0 || start % 4 == 1) {
					if(Math.floor(start%8/4) > 0)
						return [this.tile_h/4, start_px[1], this.tile_h/4, end_px[1]];
					return [this.tile_h*3/4, start_px[1], this.tile_h*3/4, end_px[1]];
				} else {
					if(Math.floor(start%8/4) == 0)
						return [start_px[0], this.tile_w*3/4, end_px[0], this.tile_w*3/4];
					return [start_px[0], this.tile_w/4, end_px[0], this.tile_w/4];
				}
				break;
		}
		
		return [this.tile_w/2, this.tile_h/2, this.tile_w/2, this.tile_h/2];
	};

	this.pointToPixel = function(p) {		
		var mid = Math.floor(p/2);
		var sign = Math.pow(-1, p);
		var cent_x = this.tile_w*(1 + Math.sin(Math.PI*mid/2)*sign*this.path_spacing*2)*(1 + Math.cos(Math.PI*mid/2))/2;
		var cent_y = this.tile_h*(1 - Math.cos(Math.PI*mid/2)*sign*this.path_spacing*2)*(1 + Math.sin(Math.PI*mid/2))/2;
		
		return [cent_x, cent_y];
	};
	
	this.clickToHand = function(x, y) {
		if(x > this.grid_w && x < this.grid_w + this.tile_w*(1+Math.floor(this.hand_size/this.grid))) {
			if(y > this.margin && y < this.grid_h - this.margin) {
				var sub_x = x - this.grid_w;
				var sub_y = y - this.margin;
				
				h = this.grid*Math.floor(sub_x / this.tile_w) + Math.floor(sub_y / this.tile_h);
				
				if(h < this.hand_size) {
					return h;
				}
			}
		}
		
		return -1;
	};
	
	this.clickToActive = function(x, y) {
		var activeLoc = this.players[this.current_player].location.activeLocation();
		if(x > this.margin + (activeLoc.x)*this.tile_w &&
				x < this.margin + (activeLoc.x + 1)*this.tile_w &&
				y > this.margin + (activeLoc.y)*this.tile_h &&
				y < this.margin + (activeLoc.y + 1)*this.tile_h)
			return true;
		return false;
	};
	
	this.draw = function() {	
		//Checksize
		myState.canvas.width = window.innerWidth;
		myState.canvas.height = window.innerHeight;
		var max_x = window.innerWidth/2;
		var max_y = window.innerHeight;
		var max = max_y;
		
		if(max_x < max_y) {
			max = max_x;
		}
		
		var tile_max = Math.floor(max/(this.grid + 2/3));
		
		this.tile_w = tile_max;
		this.tile_h = tile_max;
		this.margin = Math.floor(tile_max/3);
		this.grid_h = tile_max*this.grid + 2*this.margin;
		this.grid_w = tile_max*this.grid + 2*this.margin;
		myState.clear();
		myState.drawGrid();
		myState.drawBoard();
		myState.drawPaths();
		myState.drawPlayers();
		if(myState.game_started) {
			if(myState.current_player != -1) {
				myState.drawHand(myState.players[myState.current_player]);
			}
		}
		if(typeof myState.debug != 'undefined' && myState.debug) {
			myState.drawDebug();
		}
		if(myState.dragging) {
			myState.drawSelection();
		}
	};
	
	this.clear = function() {
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
	};
	
	this.drawPlayers = function() {
		this.ctx.beginPath();
		if(this.current_player != -1 && this.game_started) {
			activeTile = this.players[this.current_player].activeLocation();
			this.ctx.fillStyle = "rgba(" + this.players[this.current_player].cr + ","+ this.players[this.current_player].cg +
				"," + this.players[this.current_player].cb + ",.25)";
			this.ctx.fillRect(this.margin + activeTile.x*this.tile_w, this.margin + activeTile.y*this.tile_h, this.tile_w, this.tile_h);
			this.ctx.fill();
			this.ctx.stroke();
		}
		
		for(p = 0; p < this.players.length; p++) {
			if(this.players[p] != null) {
				this.players[p].colorMorph();
				tileLoc = this.pointToPixel(this.players[p].location.p);
				img = new Image;
				img.src = "data:image/png;base64,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";
				
				var grd_rad = this.tile_w/8;
				var offset = 3;
				var inner_rad = 4;
				if(grd_rad <= 8) {
					offset = 0;
					inner_rad = 2;
					grd_rad = 8;
				}
				
				var grd =  this.ctx.createRadialGradient(this.margin + this.tile_h * (this.players[p].location.x) + tileLoc[0] - offset, 
						this.margin + this.tile_w * (this.players[p].location.y) + tileLoc[1] - offset,
						inner_rad,
						this.margin + this.tile_h * (this.players[p].location.x) + tileLoc[0], 
						this.margin + this.tile_w * (this.players[p].location.y) + tileLoc[1],
						grd_rad);
				grd.addColorStop(0, "rgba(" + this.players[p].cr + ", "+ this.players[p].cg +
						", " + this.players[p].cb + ", .3)");
				grd.addColorStop(.55, "rgba(" + this.players[p].cr + ", "+ this.players[p].cg +
						", " + this.players[p].cb + ", .45)");
				grd.addColorStop(1, "rgba(0,0,0, 0)");
				this.ctx.drawImage(img, this.margin + this.tile_h * (this.players[p].location.x) + tileLoc[0] - this.ticker_length/2 * this.tile_w, 
						this.margin + this.tile_w * (this.players[p].location.y) + tileLoc[1] - this.ticker_length/2 * this.tile_h, this.tile_w/4, this.tile_h/4);
				//this.ctx.fillStyle = "rgba(" + this.players[p].cr + ", "+ this.players[p].cg +
				//	", " + this.players[p].cb + ", .45)";
				this.ctx.fillStyle = grd;
				this.ctx.beginPath();
				this.ctx.arc(this.margin + this.tile_h * (this.players[p].location.x) + tileLoc[0], 
						this.margin + this.tile_w * (this.players[p].location.y) + tileLoc[1],
						this.tile_w/4, 0, Math.PI*2);
				this.ctx.fill();
			}
		}
	};
	
	this.drawSelection = function() {
		if(this.selection.tile != null)
			this.drawTile(this.mx - this.selection.dx, this.my - this.selection.dy, this.selection.tile);
	};
	
	this.drawHand = function(player) {
		for(h = 0; h < player.hand.length; h++) {
			this.drawTile(this.grid_w + Math.floor(h/this.grid)*this.tile_w, this.margin + (h%this.grid)*this.tile_h, player.hand[h]);
		}
	};
	
	this.drawDebug = function(player) {
		
		text_height = 16;
		debugx = this.grid_w;
		debugy = this.grid_h + text_height;
		this.ctx.fillStyle = 'black';
		this.ctx.font = text_height + "px Arial";
		l = 0;
		this.ctx.fillText("Debug", debugx, debugy + l++*text_height);
		
		this.ctx.fillText("Stack Size: " + this.stack.length, debugx, debugy + l++*text_height);
		for(p = 0; p < this.total_players; p++) {
			this.ctx.fillStyle = this.players[p].color;
			if(this.players[p].alive) {
				this.ctx.font = text_height + "px Arial";
				this.ctx.fillText("Player " + p + " Size: " + this.countHand(this.players[p].hand) + " Path: " + (this.players[p].path.length - 1), debugx, debugy + l++*text_height);
			} else {
				this.ctx.font = "oblique small-caps " + text_height + "px Arial";
				this.ctx.fillText("Player " + p + " Size: " + this.countHand(this.players[p].hand) + " Path: " + (this.players[p].path.length - 1), debugx, debugy + l++*text_height);
			}
		}
		this.ctx.font = text_height + "px Arial";
		this.ctx.fillStyle = 'black';
		
		this.ctx.fillText("Current Player: " + this.current_player, debugx, debugy + l++*text_height);
		this.ctx.fillText("Next Player: " + this.next_player, debugx, debugy + l++*text_height);	
	};
	
	this.drawTile = function(x, y, tile) {
		if(tile != null && tile.t != null && tile.t.length == 8) {
			this.ctx.strokeStyle = "rgba(236,222,201,1)";
			this.ctx.lineWidth = 2;
			
			this.ctx.clearRect(x, y, this.tile_w, this.tile_h);
			this.ctx.fillStyle = "rgba(234, 197, 146,1)";
			this.ctx.fillRect(x, y, this.tile_w, this.tile_h);
			
			this.ctx.strokeRect(x, y, this.tile_w, this.tile_h);
			
			this.ctx.drawImage(tile.img, x, y, this.tile_w, this.tile_h);
			
			for(var p = 0; p < 8; p++) {
				this.ctx.strokeStyle = "rgba(115, 62, 31,1)";
				this.ctx.lineWidth = Math.floor(12*this.tile_w/120);
				if(this.ctx.lineWidth < 3)
					this.ctx.lineWidth = 3;
				this.ctx.beginPath();
				start = this.pointToPixel(p);
				end = this.pointToPixel(tile.t[p]);
				mids = this.getMids(p, tile.t[p]);
				this.ctx.moveTo(x + start[0], y + start[1]);
				this.ctx.bezierCurveTo(x + mids[0], y + mids[1], x + mids[2], y + mids[3], x + end[0], y + end[1]);
				this.ctx.stroke();
				
				this.ctx.strokeStyle = "rgba(236,222,201,1)";
				this.ctx.lineWidth = Math.floor(this.ctx.lineWidth*2/3);
				this.ctx.beginPath();
				start = this.pointToPixel(p);
				end = this.pointToPixel(tile.t[p]);
				mids = this.getMids(p, tile.t[p]);
				this.ctx.moveTo(x + start[0], y + start[1]);
				this.ctx.bezierCurveTo(x + mids[0], y + mids[1], x + mids[2], y + mids[3], x + end[0], y + end[1]);
				this.ctx.stroke();
			}
		}
	};
	
	this.drawPaths = function() {
		for(p = 0; p < this.players.length; p++) {
			if(this.players[p] != null) {
				path = this.players[p].path;
				this.ctx.strokeStyle = "rgba(" + this.players[p].cr + ","+ this.players[p].cg +
					"," + this.players[p].cb + ",.45)";
				this.ctx.lineWidth = Math.floor(10*this.tile_w/120);
				if(this.ctx.lineWidth < 3)
					this.ctx.lineWidth = 3;
				this.ctx.beginPath();
				if(this.players[p].pathProgress < this.players[p].path.length - 1) {
					this.players[p].pathProgress = this.players[p].pathProgress + .02;
				}
				for(pa = 0; pa < this.players[p].path.length - 1; pa++) {
					var progress = this.players[p].pathProgress - pa;
					if(progress > 0) {
						if(this.players[p].pathProgress - pa > 1) {
							progress = 1;
						}
						this.ctx.beginPath();
						start = this.pointToPixel(path[pa].mirrorP());
						end = this.pointToPixel(path[pa + 1].p);
						mids = this.getMids(path[pa].mirrorP(), path[pa + 1].p);
						x = this.margin + path[pa+1].x*this.tile_w;
						y = this.margin + path[pa+1].y*this.tile_h;
						var grd=this.ctx.createLinearGradient(x + start[0],y + start[1],x + end[0], y + end[1]);
						grd.addColorStop(0,"rgba(" + this.players[p].cr + ","+ this.players[p].cg +
								"," + this.players[p].cb + ",.45)");
						grd.addColorStop(progress,"rgba(" + this.players[p].cr + ","+ this.players[p].cg +
								"," + this.players[p].cb + ",.45)");
						if(progress < 1) {
							grd.addColorStop(progress,"rgba(" + this.players[p].cr + ","+ this.players[p].cg +
								"," + this.players[p].cb + ",0)");
							grd.addColorStop("1","rgba(" + this.players[p].cr + ","+ this.players[p].cg +
								"," + this.players[p].cb + ",0)");
						} else {
							grd.addColorStop(progress,"rgba(" + this.players[p].cr + ","+ this.players[p].cg +
								"," + this.players[p].cb + ",.45)");
							grd.addColorStop("1","rgba(" + this.players[p].cr + ","+ this.players[p].cg +
								"," + this.players[p].cb + ",.45)");
						}
						this.ctx.strokeStyle = grd;
						this.ctx.moveTo(x + start[0], y + start[1]);
						this.ctx.bezierCurveTo(x + mids[0], y + mids[1], x + mids[2], y + mids[3], x + end[0], y + end[1]);	
						this.ctx.stroke();
					} else {
						pa = this.players[p].path.length - 1;
					}
				}
			}
		}
	};
	
	this.drawBoard = function() {
		for(x = 0; x < this.grid; x++) {
			for(y = 0; y < this.grid; y++) {
				if(this.board[x][y] != null && this.board[x][y].length != 0) {
					this.drawTile(this.margin + x*this.tile_w, this.margin + y*this.tile_h, this.board[x][y]);
					this.boardAlphas[x][y] += .03*Math.random();
					if(this.boardAlphas[x][y] > 1) {
						this.boardAlphas[x][y] = 1;
					} else if(this.boardAlphas[x][y] < 0) {
						this.boardAlphas[x][y] = 0;
					}
				}
			}
		}
	};
	
	this.drawGrid = function() {
		this.ctx.strokeStyle = "rgba(236,222,201,1)";
		this.ctx.lineWidth = 3;
		for(var x = 0; x < this.grid; x++) {
			for(var y = 0; y < this.grid; y++) {
				this.ctx.strokeRect(this.margin + x * this.tile_w, this.margin + y * this.tile_h, this.tile_w, this.tile_h);
				if(x == 0) {
					this.ctx.beginPath();
					this.ctx.moveTo(x*this.tile_w + (1-this.ticker_length)*this.margin, this.margin + y*this.tile_h + this.tile_h/2 - this.tile_h*this.path_spacing);
					this.ctx.lineTo(x*this.tile_w + this.margin, this.margin + y*this.tile_h + this.tile_h/2 - this.tile_h*this.path_spacing);
					this.ctx.moveTo(x*this.tile_w + (1-this.ticker_length)*this.margin, this.margin + y*this.tile_h + this.tile_h/2 + this.tile_h*this.path_spacing);
					this.ctx.lineTo(x*this.tile_w + this.margin, this.margin + y*this.tile_h + this.tile_h/2 + this.tile_h*this.path_spacing);
					this.ctx.stroke();
				}
				if(x == this.grid - 1) {
					this.ctx.beginPath();
					this.ctx.moveTo((x+1)*this.tile_w + (1+this.ticker_length)*this.margin, this.margin + y*this.tile_h + this.tile_h/2 - this.tile_h*this.path_spacing);
					this.ctx.lineTo((x+1)*this.tile_w + this.margin, this.margin + y*this.tile_h + this.tile_h/2 - this.tile_h*this.path_spacing);
					this.ctx.moveTo((x+1)*this.tile_w + (1+this.ticker_length)*this.margin, this.margin + y*this.tile_h + this.tile_h/2 + this.tile_h*this.path_spacing);
					this.ctx.lineTo((x+1)*this.tile_w + this.margin, this.margin + y*this.tile_h + this.tile_h/2 + this.tile_h*this.path_spacing);
					this.ctx.stroke();
				}
				if(y == 0) {
					this.ctx.beginPath();
					this.ctx.moveTo(this.margin + x*this.tile_w + this.tile_w/2 - this.tile_w*this.path_spacing, y*this.tile_h + (1-this.ticker_length)*this.margin);
					this.ctx.lineTo(this.margin + x*this.tile_w + this.tile_w/2 - this.tile_w*this.path_spacing, y*this.tile_h + this.margin);
					this.ctx.moveTo(this.margin + x*this.tile_w + this.tile_w/2 + this.tile_w*this.path_spacing, y*this.tile_h + (1-this.ticker_length)*this.margin);
					this.ctx.lineTo(this.margin + x*this.tile_w + this.tile_w/2 + this.tile_w*this.path_spacing, y*this.tile_h + this.margin);
					this.ctx.stroke();
				}
				if(y == this.grid - 1) {
					this.ctx.beginPath();
					this.ctx.moveTo(this.margin + x*this.tile_w + this.tile_w/2 - this.tile_w*this.path_spacing, (y+1)*this.tile_h + (1+this.ticker_length)*this.margin);
					this.ctx.lineTo(this.margin + x*this.tile_w + this.tile_w/2 - this.tile_w*this.path_spacing, (y+1)*this.tile_h + this.margin);
					this.ctx.moveTo(this.margin + x*this.tile_w + this.tile_w/2 + this.tile_w*this.path_spacing, (y+1)*this.tile_h + (1+this.ticker_length)*this.margin);
					this.ctx.lineTo(this.margin + x*this.tile_w + this.tile_w/2 + this.tile_w*this.path_spacing, (y+1)*this.tile_h + this.margin);
					this.ctx.stroke();
				}
			}
		}
	};
}

function TsuroLocation(x,y,p) {
	this.x = x;
	this.y = y;
	this.p = p;
	
	this.mirrorP = function() {
		if(this.p % 2 == 0) {
			if(this.p < 4) {
				return this.p + 5;
			} else {
				return this.p - 3;
			}
		} else {
			if(this.p < 4) {
				return this.p + 3;
			} else {
				return this.p - 5;
			}
		}
	};
	
	this.activeLocation = function() {
		switch(Math.floor(this.p/2)) {
			case 0:
				return new TsuroLocation(this.x + 1, this.y, this.mirrorP());
				break;
			case 1:
				return new TsuroLocation(this.x, this.y + 1, this.mirrorP());
				break;
			case 2:
				return new TsuroLocation(this.x - 1, this.y, this.mirrorP());
				break;
			case 3:
				return new TsuroLocation(this.x, this.y - 1, this.mirrorP());
				break;
		}
	};
}

function TsuroTile(t, w, h, hand) {
	this.from_hand = hand;
	this.t = t;
	this.w = w;
	this.h = h;
	this.img = new Image;
	this.img.src = "data:image/png;base64,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";
	//this.img.src = "tile.png";
	
	var buffer = document.createElement('canvas');
	buffer.width = this.w;
	buffer.height = this.h;
	this.bctx = buffer.getContext('2d');
	var rotation = Math.floor(Math.random()*4);
	switch(rotation) {
	case 0:
		break;
	case 1:
		this.bctx.translate(this.w, 0);
		break;
	case 2:
		this.bctx.translate(this.w, this.h);
		break;
	case 3: 
		this.bctx.translate(0, this.h);
		break;
	}
	//this.bctx.rotate(rotation*Math.PI/2);
	this.bctx.drawImage(this.img, 0, 0);
	
	//this.img = buffer;
	
	this.rotate = function() {
		var a = this.t.shift();
		var b = this.t.shift();
		this.t[6] = a;
		this.t[7] = b;
		for(t = 0; t < this.t.length; t++) {
			this.t[t] -= 2;
			if(this.t[t] < 0)
				this.t[t] += 8;
		}
		
		this.bctx.translate(this.w, 0);
		this.bctx.rotate(Math.PI/2);
	};
}

function TsuroPlayer(h, l, cr, cg, cb) {
	this.hand = h;
	this.location = l;
	this.init_cr = cr;
	this.init_cg = cg;
	this.init_cb = cb;
	this.cr = cr;
	this.cg = cg;
	this.cb = cb;
	this.color = "rgba("+cr+","+cg+","+cb+",1)";
	this.path = [];
	this.pathProgress = 0;
	this.alive = true;
	
	this.activeLocation = function() {
		return this.location.activeLocation();
	};
	
	this.colorMorph = function() {
		return true;
		
		max = 45;
		morph = 11;
		
		rnd = Math.floor(morph*Math.random()) - (morph - 1)/2;
		this.cr = this.cr + rnd;
		if(Math.abs(this.cr - this.init_cr) > max) {
			this.cr = this.cr - 2*rnd;
		}
		rnd = Math.floor(morph*Math.random()) - (morph - 1)/2;
		this.cg = this.cg + rnd;
		if(Math.abs(this.cg - this.init_cg) > max) {
			this.cg = this.cg - 2*rnd;
		}
		rnd = Math.floor(morph*Math.random()) - (morph - 1)/2;
		this.cb = this.cb + rnd;
		if(Math.abs(this.cb - this.init_cb) > max) {
			this.cb = this.cb - 2*rnd;
		}
	};
}

TsuroState.prototype.getMouse = function(e) {
	var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
	 
	if (element.offsetParent !== undefined) {
	    do {
	    	offsetX += element.offsetLeft;
	      	offsetY += element.offsetTop;
	    } while ((element = element.offsetParent));
	}
	offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
	 
	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;
	 
	return {x: mx, y: my};
};