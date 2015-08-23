Test = function(){};
Test.prototype.inc = function(){
    this.test();
}
Test.prototype.test = function(){
    console.log("test successful");
}
var lot_state = {
    preload: function(){
	this.test = new Test();
	this.test.inc();
    },

    loadUpdate: function(){
    },

    loadRender: function(){
    },

    create: function(){
	//level config
	game.world.setBounds(0, 0, 2400, 600);
	//this.bg_music = game.add.audio("lot_music", 1, true).play();

	//load sprites
	game.add.sprite(0, 0, "lot_bg");
	//add  and set up player
	this.player = new Player(this, game, 400, 300);
	game.add.existing(this.player);
	//create enemies
	this.r_enemies = [];
	this.m_enemies = [];
	//create ranged enemy
	this.r_enemies.push(new LotRangeEnemy(game, 600, 400, this));
	game.add.existing(this.r_enemies[0]);
	//create melee enemy
	this.m_enemies.push(new LotMeleeEnemy(game, 400, 100, this));
	game.add.existing(this.m_enemies[0]);
	this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function(){
	var base_vel = this.player.base_velocity;

	if (this.cursor.up.isDown){
	    this.player.body.velocity.y = -base_vel;
	} else if (this.cursor.down.isDown){
	    this.player.body.velocity.y = base_vel;
	} else {
	    this.player.body.velocity.y = 0;
	}
	if (this.cursor.left.isDown){
	    this.player.body.velocity.x = -base_vel;
	} else if (this.cursor.right.isDown){
	    this.player.body.velocity.x = base_vel;
	} else {
	    this.player.body.velocity.x = 0;
	}

	var anim_state = "idle";
	var player_x_vel = this.player.body.velocity.x;
	var player_y_vel = this.player.body.velocity.y;
	if (player_x_vel || player_y_vel){
	    anim_state = "walk";
	    if ((!player_x_vel && this.player.right) || player_x_vel > 0){
		this.player.right = true;
	    } else {
		this.player.right = false;
	    }
	} else {
	    if (this.player.right){
		this.player.right = true;
	    } else {
		this.player.right = false;
	    }
	}
	if (this.player.right){
	    this.player.scale.x = 1;
	} else {
	    this.player.scale.x = -1;
	}
	this.player.animations.play(anim_state);

	UpdateCamera(game.camera, this.player);
    },

    resize: function(){
    },

    shutdown: function(){
    }
}
