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
	this.player.animations.add("idle", [0]);
	this.player.animations.add("walk", [9, 10, 11, 12], 4, true);
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

	if (this.player.body.velocity.x || this.player.body.velocity.y){
	    this.player.animations.play("walk");
	} else {
	    this.player.animations.play("idle");
	}

	UpdateCamera(game.camera, this.player);
    },

    resize: function(){
    },

    shutdown: function(){
    }
}
