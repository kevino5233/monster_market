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
	enemy = game.add.sprite(600, 100, "lot_m_enemy");
	enemy.anchor.x = 0.5;
	var idle_anim = enemy.animations.add("idle", [0]);
	idle_anim.onStart.add(
	    function(enemy){
		enemy.body.velocity = {x: 0, y: 0};
	    },
	    enemy);
	var walk_anim = 
	    enemy.animations.add(
		"walk", 
		[8, 9, 10, 11], 
		8, 
		true);
	walk_anim.onStart.add(
	    function(enemy){
		enemy.walking = true;
	    },
	    enemy);
	walk_anim.onComplete.add(
	    function(enemy){
		enemy.walking = false;
	    },
	    enemy);
	charge_anim = 
	    enemy.animations.add(
		"charge", 
		[16, 17, 18, 18], 
		8, 
		false);
	charge_anim.onStart.add(
	    function(enemy){
		enemy.body.velocity = {x: 0, y: 0};
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
		enemy.body.velocity = {x: 0, y: 0};
		enemy.attacking = true;
		//adjust later
		enemy.body.velocity.x = 128 * enemy.scale.x;
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
	enemy.detect_range = 64 * 4;
	enemy.attack_range = 64;
	enemy.walking = false;
	enemy.charging = false;
	enemy.attacking = false;
	game.physics.enable(enemy);
	this.m_enemies.push(enemy);
	this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function(){
	//this.player.body.setZeroVelocity();
	this.UpdateEnemies();
    },

    UpdateEnemies : function(){
	var remove_indexes = [];
	for (var i = 0; i < this.r_enemies.length; i++){
	    /*
	    var enemy = this.r_enemies[i];
	    if (DistanceBetween(this.player, enemy) <= enemy.detect_range && 
		!(enemy.charging || enemy.attacking)){
		if (this.player.x < enemy.x){
		    enemy.scale.x = -1;
		} else {
		    enemy.scale.x = 1;
		}
		enemy.aim = {
		    x: this.player.x,
		    y: this.player.y
		};
		enemy.animations.currentAnim.complete();
		enemy.animations.play("charge");
	    }*/
	}
	//remove stuff from indexes
	remove_indexes = [];
	for (var i = 0; i < this.m_enemies.length; i++){
	    var enemy = this.m_enemies[i];
	    var dist_player = DistanceBetween(this.player, enemy);
	    if (dist_player <= enemy.detect_range && 
		!(enemy.charging || enemy.attacking)){
		console.log("shit");
		if (dist_player <= enemy.attack_range){
		    enemy.animations.currentAnim.complete();
		    enemy.animations.play("charge");
		} else {
		    if (!enemy.walking){
			enemy.animations.currentAnim.complete();
			enemy.animations.play("walk");
		    }
		    var diff_y = this.player.y - enemy.y;
		    var diff_x = this.player.x - enemy.x;
		    if (diff_x < 0){
			enemy.scale.x = -1;
			diff_x += 64;
		    } else {
			enemy.scale.x = 1;
		    }
		    if (Math.abs(diff_y) > Math.abs(diff_x)){
			enemy.body.velocity.y = 128 * (diff_y > 0 ? 1 : -1);
		    } else {
			enemy.body.velocity.x = 128 * enemy.scale.x;
		    }
		}
	    } else if (enemy.walking){
		enemy.animations.currentAnim.complete();
		enemy.animations.play("idle");
	    }
	}
	remove_indexes = [];
    },

    resize: function(){
    },

    shutdown: function(){
    }
}
