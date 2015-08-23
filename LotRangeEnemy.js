LotRangeEnemy = function(game, x, y, state){
    this.state = state;
    Phaser.Sprite.call(this, game, x, y, "lot_r_enemy", 0);
    this.anchor.x = 0.5;
    this.animations.add("idle", [0]);
    var charge_anim = this.animations.add("charge", [8, 9, 10, 10], 8, false);
    charge_anim.onStart.add(this.ToggleCharging, this);
    charge_anim.onComplete.add(this.ToggleCharging, this);
    var throw_anim = this.animations.add("throw", [16, 17, 18, 19], 8, false)
    throw_anim.onStart.add(this.ToggleAttacking, this);
    throw_anim.onComplete.add(this.ToggleAttacking, this);
    this.detect_range = 64 * 4;
    this.charging = false;
    this.attacking = false;

    return this;
};

LotRangeEnemy.prototype = Object.create(Phaser.Sprite.prototype);
LotRangeEnemy.prototype.constructor = LotRangeEnemy;

LotRangeEnemy.prototype.ToggleCharging = function(enemy){
    enemy.charging = !enemy.charging;
    if (!enemy.charging){
	enemy.animations.play("throw");
    }
};

LotRangeEnemy.prototype.ToggleAttacking = function(enemy){
    enemy.attacking = !enemy.attacking;
    if (!enemy.attacking){
	enemy.animations.play("idle");
    } else {
	enemy.ThrowBottle();
    }
};

LotRangeEnemy.prototype.ThrowBottle = function(){
    var diff_x = this.aim.x - this.x;
    var diff_y = this.aim.y - this.y;
    var diff_base = Math.abs(diff_x) + Math.abs(diff_y);
    var x_diff_ratio = diff_x / diff_base;
    var y_diff_ratio = diff_y / diff_base;
    var bottle_v = {
	x: 256 * x_diff_ratio,
	y: 256 * y_diff_ratio
    }
    var bottle = game.add.sprite(
	this.x,
	this.y + this.height / 2,
	"bottle");
    bottle.animations.add("projectile", [0, 1, 2, 3], 8, true);
    bottle.animations.play("projectile");
    game.physics.enable(bottle);
    bottle.body.velocity = bottle_v;
    this.state.bottle_layer.add(bottle);
};

LotRangeEnemy.prototype.update = function(){
    if (DistanceBetween(this.state.player, this) <= this.detect_range && 
	!(this.charging || this.attacking)){
	if (this.state.player.x < this.x){
	    this.scale.x = -1;
	} else {
	    this.scale.x = 1;
	}
	this.aim = {
	    x: this.state.player.x,
	    y: this.state.player.y
	};
	this.animations.currentAnim.complete();
	this.animations.play("charge");
    }
};
