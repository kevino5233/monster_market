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
	//create enemies
	this.r_enemies = [];
	this.m_enemies = [];
	//create ranged enemy
	var enemy = game.add.sprite(600, 400, "lot_r_enemy");
	enemy.anchor.x = 0.5;
	enemy.animations.add("idle", [0]);
	var charge_anim = enemy.animations.add("charge", [1], 1, false);
	charge_anim.onStart.add(
	    function(enemy){
		enemy.charging = true;
	    },
	    enemy);
	charge_anim.onComplete.add(
	    function(enemy){
		enemy.animations.play("throw");
		enemy.charging = false;
	    },
	    enemy);
	var throw_anim = enemy.animations.add("throw", [2], 1, false)
	throw_anim.onStart.add(
	    function(enemy){
		enemy.attacking = true;
		//generate projectile
	    },
	    enemy);
	throw_anim.onComplete.add(
	    function(enemy){
		enemy.animations.play("idle");
		enemy.attacking = false;
	    },
	    enemy);
	enemy.detect_range = 64 * 4;
	enemy.charging = false;
	enemy.attacking = false;
	this.r_enemies.push(enemy);
	//create melee enemy
	enemy = game.add.sprite(600, 100, "lot_m_enemy");
	enemy.anchor.x = 0.5;
	enemy.animations.add("idle", [0]);
	enemy.animations.add("walk", [8, 9, 10, 11], 8, true);
	charge_anim = 
	    enemy.animations.add(
		"charge", 
		[16, 17, 18, 18], 
		4, 
		false);
	charge_anim.onStart.add(
	    function(enemy){
		enemy.charging = true;
	    },
	    enemy);
	charge_anim.onComplete.add(
	    function(enemy){
		enemy.animations.play("punch");
		enemy.charging = false;
	    },
	    enemy);
	var punch_anim = 
	    enemy.animations.add(
		"punch", 
		[24, 25, 26, 27], 
		6, 
		false);
	punch_anim.onStart.add(
	    function(enemy){
		enemy.attacking = true;
		//adjust later
		enemy.body.velocity.x = 16 * enemy.scale.x;
		//add some down time to the enemy?
	    },
	    enemy);
	punch_anim.onComplete.add(
	    function(enemy){
		enemy.attacking = false;
		enemy.body.velocity.x = 0;
		enemy.animations.play("idle");
		//add some down time to the enemy?
	    },
	    enemy);
	enemy.detect_range = 64 * 2;
	enemy.charging = false;
	enemy.attacking = false;
	game.physics.enable(enemy);
	this.m_enemies.push(enemy);
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
	    if (DistanceBetween(this.player, enemy) <= enemy.detect_range && 
		!(enemy.charging || enemy.attacking)){
		enemy.animations.play("charge");
	    }
	}
	//remove stuff from indexes
	remove_indexes = [];
	for (var i = 0; i < this.m_enemies.length; i++){
	    var enemy = this.m_enemies[i];
	    if (DistanceBetween(this.player, enemy) <= enemy.detect_range && 
		!(enemy.charging || enemy.attacking)){
		if (this.player.x < enemy.x){
		    enemy.scale.x = -1;
		} else {
		    enemy.scale.x = 1;
		}
		enemy.animations.play("charge");
	    }
	}
    },

    resize: function(){
    },

    shutdown: function(){
    }
}
