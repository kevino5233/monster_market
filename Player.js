Player = function(game, x, y, state)
{
    Phaser.Sprite.call(this, game, x, y, "player");
    this.state = state;
    this.game = game;

    this.base_velocity = 200;
    this.invincible_frames = 60;
    this.invincible_frames_for = 0;

    this.right = true;
    this.health = 4;
    this.anchor.x = this.anchor.y = 0.5;

    this.animations.add("idle", [0]);
    this.animations.add("walk", [8, 9, 10, 11], 4, true);

    this.game.physics.enable(this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.TakeDamage = function(damage){
    console.log("Deng");
    if (!this.Invincible()){
	console.log("Peng");
	this.damage(damage);
	this.invincible_frames_for = this.invincible_frames;
    }
}

Player.prototype.Invincible = function(){
    return this.invincible_frames_for > 0;
}

Player.prototype.update = function()
{
	if (this.state.cursor.up.isDown){
	    this.body.velocity.y = -this.base_velocity;
	} else if (this.state.cursor.down.isDown){
	    this.body.velocity.y = this.base_velocity;
	} else {
	    this.body.velocity.y = 0;
	}
	if (this.state.cursor.left.isDown){
	    this.body.velocity.x = -this.base_velocity;
	} else if (this.state.cursor.right.isDown){
	    this.body.velocity.x = this.base_velocity;
	} else {
	    this.body.velocity.x = 0;
	}

	var anim_state = "idle";
	var player_x_vel = this.body.velocity.x;
	var player_y_vel = this.body.velocity.y;
	if (player_x_vel || player_y_vel){
	    anim_state = "walk";
	    if ((!player_x_vel && this.right) || player_x_vel > 0){
		this.right = true;
	    } else {
		this.right = false;
	    }
	} else {
	    if (this.right){
		this.right = true;
	    } else {
		this.right = false;
	    }
	}
	if (this.right){
	    this.scale.x = 1;
	} else {
	    this.scale.x = -1;
	}
	this.animations.play(anim_state);

	if (this.Invincible()){
	    this.invincible_frames_for -= 1;
	}

	UpdateCamera(game.camera, this);
}
