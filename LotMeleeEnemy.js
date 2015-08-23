LotMeleeEnemy = function(game, x, y, state){
    this.state = state; 
    Phaser.Sprite.call(this, game, x, y, "lot_m_enemy", 0);
    this.anchor.x = 0.5;
    var idle_anim = this.animations.add("idle", [0]);
    idle_anim.onStart.add(this.SetZeroVelocity, this);
    var walk_anim = this.animations.add("walk", [8, 9, 10, 11], 8, true);
    walk_anim.onStart.add(this.ToggleWalking, this);
    walk_anim.onComplete.add(this.ToggleWalking, this);
    charge_anim = this.animations.add("charge", [16, 17, 18, 18], 8, false);
    charge_anim.onStart.add(this.ToggleCharging, this);
    charge_anim.onComplete.add(this.ToggleCharging, this);
    var punch_anim = this.animations.add("punch", [24, 25, 26, 27], 6, false);
    punch_anim.onStart.add(this.ToggleAttacking, this);
    punch_anim.onComplete.add(this.ToggleAttacking, this);
    this.detect_range = 64 * 4;
    this.attack_range = 64;
    this.walking = false;
    this.charging = false;
    this.attacking = false;
    game.physics.enable(this);
    this.animations.play("idle");

    return this;
};

LotMeleeEnemy.prototype = Object.create(Phaser.Sprite.prototype);
LotMeleeEnemy.prototype.constructor = LotMeleeEnemy;

LotMeleeEnemy.prototype.SetZeroVelocity = function(){
    console.log(this);
    this.body.velocity = {x: 0, y: 0};
};

LotMeleeEnemy.prototype.ToggleWalking = function(enemy){
    enemy.walking = !enemy.walking;
};

LotMeleeEnemy.prototype.ToggleCharging = function(enemy){
    enemy.charging = !enemy.charging;
    if (enemy.charging){
	enemy.SetZeroVelocity();
    } else {
	enemy.animations.play("punch");
    }
};

LotMeleeEnemy.prototype.ToggleAttacking = function(enemy){
    console.log("shiieeeet");
    enemy.attacking = !enemy.attacking;
    if (enemy.attacking){
	enemy.body.velocity.x = 128 * enemy.scale.x;
    } else {
	enemy.SetZeroVelocity(enemy);
	enemy.animations.play("idle");
    }
};

LotMeleeEnemy.prototype.update = function(){
    var dist_player = DistanceBetween(this.state.player, this);
    if (dist_player <= this.detect_range && 
	!(this.charging || this.attacking)){
	console.log(this.animations.currentAnim);
	console.log("stuff");
	if (dist_player <= this.attack_range){
	    this.animations.currentAnim.complete();
	    this.animations.play("charge");
	} else {
	    console.log("stuff more");
	    if (!this.walking){
		this.animations.currentAnim.complete();
		console.log("holy stuff more");
		this.animations.play("walk");
	    }
	    var diff_y = this.state.player.y - this.y;
	    var diff_x = this.state.player.x - this.x;
	    if (diff_x < 0){
		this.scale.x = -1;
		diff_x += 64;
	    } else {
		this.scale.x = 1;
	    }
	    if (Math.abs(diff_y) > Math.abs(diff_x)){
		this.body.velocity.y = 128 * (diff_y > 0 ? 1 : -1);
	    } else {
		this.body.velocity.x = 128 * this.scale.x;
	    }
	}
    } else if (this.walking){
	this.animations.currentAnim.complete();
	this.animations.play("idle");
    }
}
