var lot_state = {
    preload: function(){
    },

    loadUpdate: function(){
    },

    loadRender: function(){
    },

    create: function(){
	//level config
	game.world.setBounds(0, 0, 2400, 600);

	//load sprites
	game.add.sprite(0, 0, "lot_bg");
	//add  and set up player
	this.player = game.add.sprite(400, 300, "player");
	this.player.base_velocity = 200;
	this.player.right = true;
	this.player.anchor.x = 0.5;
	this.player.animations.add("idle", [0]);
	this.player.animations.add("walk", [8, 9, 10, 11], 4, true);
	game.physics.enable(this.player);
	//add and setup a basic enemy
	this.r_enemies = [];
	var enemy = game.add.sprite(600, 400, "lot_r_enemy");
	enemy.animations.add("idle", [0]);
	enemy.animations.add("charge", [1], 1, false).onComplete.add(
	    function(enemy){
		enemy.animations.play("throw");
		enemy.charging = true;
	    },
	    enemy);
	enemy.animations.add("throw", [2], 1, false).onComplete.add(
	    function(enemy){
		enemy.animations.play("idle");
		enemy.charging = false;
	    },
	    enemy);
	enemy.detect_range = 64 * 3;
	enemy.charging = false;
	this.r_enemies.push(enemy);
	this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function(){
	//this.player.body.setZeroVelocity();

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

	this.UpdateEnemies();

	UpdateCamera(game.camera, this.player);
    },

    UpdateEnemies : function(){
	var remove_indexes = [];
	for (var i = 0; i < this.r_enemies.length; i++){
	    var enemy = this.r_enemies[i];
	    if (DistanceBetween(this.player, enemy) <= enemy.detect_range && !enemy.charging){
		enemy.animations.play("charge");
	    }
	}
    },

    resize: function(){
    },

    shutdown: function(){
    }
}
