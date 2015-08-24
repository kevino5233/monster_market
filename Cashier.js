Cashier = function(game, x, y, state){
    this.state = state; 
    Phaser.Sprite.call(this, game, x, y, "cashier", 0);
    this.anchor.x = 0.5;
    var idle_anim = this.animations.add("idle", [0]);
    var pickup_anim = this.animations.add("pickup", [8, 9, 10, 11, 11, 10, 9, 8], 8, false);
    pickup_anim.onComplete.add(
        function(cashier){
            cashier.animations.play("ready");
        }, this);
    var ready_anim = this.animations.add("ready", [16, 16, 16, 16], 8, false);
    ready_anim.onComplete.add(
        function(cashier){
            cashier.animations.play("walking");
        }, this);
    var walk_anim = this.animations.add("walking", [24, 25, 26, 27], 6, true);
    walk_anim.onStart.add(
        function(cashier) {
            cashier.walking = true;
        }, this);
    this.base_velocity = 160;
    this.bullet_velocity = 1024;
    this.walking = false;
    game.physics.enable(this);
    this.frames_reload = 30;
    this.frames_reloaded = this.frames_reload;
    this.attack_range = 64 * 2;
    this.precision = 64;
    this.body.setSize(40, 80, 24, 36);
    this.animations.play("idle");

    return this;
};

Cashier.prototype = Object.create(Phaser.Sprite.prototype);
Cashier.prototype.constructor = Cashier;

Cashier.prototype.update = function(){
    if (this.walking){
        var dist_player = DistanceBetween(this.state.player, this);
        var diff_y = this.state.player.y - this.y;
        var diff_x = this.state.player.x - this.x;
        if (diff_x < 0){
            this.scale.x = -1;
            diff_x += 64;
        } else {
            this.scale.x = 1;
        }
        if ((Math.abs(diff_y) <= this.precision || dist_player <= this.attack_range) &&
            this.frames_reloaded >= this.frames_reload){
            var bullet = this.state.bottle_layer.create(
                this.x, 
                this.y + this.height / 2, 
                "bullet");
            bullet.scale.x = this.scale.x;
            game.physics.enable(bullet);
            bullet.body.velocity.x = this.bullet_velocity * this.scale.x;
            this.frames_reloaded = 0;
        } else {
            this.frames_reloaded++;
        }
        if (Math.abs(diff_y) > Math.abs(diff_x)){
            this.body.velocity.y = this.base_velocity * (diff_y > 0 ? 1 : -1);
        } else {
            this.body.velocity.x = this.base_velocity * this.scale.x;
        }
    }
}
