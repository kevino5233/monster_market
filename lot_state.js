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
	this.player = game.add.sprite(400, 300, "player");
	this.player.base_velocity = 200;
	this.player.right = true;
	this.player.animations.add("idle_right", [0]);
	this.player.animations.add("idle_left", [8]);
	this.player.animations.add("walk_right", [16, 17, 18, 19], 4, true);
	this.player.animations.add("walk_left", [24, 25, 26, 27], 4, true);
	game.physics.enable(this.player);

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

	var anim_state = "idle_left";
	var player_x_vel = this.player.body.velocity.x;
	var player_y_vel = this.player.body.velocity.y;
	if (player_x_vel || player_y_vel){
	    if ((!player_x_vel && this.player.right) || player_x_vel > 0){
		anim_state = "walk_right";
		this.player.right = true;
	    } else {
		anim_state = "walk_left";
		this.player.right = false;
	    }
	} else {
	    if (this.player.right){
		anim_state = "idle_right";
		this.player.right = true;
	    } else {
		this.player.right = false;
	    }
	}
	this.player.animations.play(anim_state);

	UpdateCamera(game.camera, this.player);
    },

    resize: function(){
    },

    shutdown: function(){
    }
}
