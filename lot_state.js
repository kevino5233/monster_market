var lot_state = {
    preload: function(){
    },

    loadUpdate: function(){
    },

    loadRender: function(){
    },

    create: function(){
	this.background = game.add.group(),
	this.bottle_layer = game.add.group(),
	this.player_layer = game.add.group(),
	this.m_enemy_layer = game.add.group(),
	this.r_enemy_layer = game.add.group(),
	this.envir_layer = game.add.group(),
	this.UI_layer = game.add.group()
	//level config
	game.world.setBounds(0, 0, 2400, 600);
	this.background.create(0, 0, "lot_bg");
	//this.bg_music = game.add.audio("lot_music", 1, true).play();
	//load sprites
	//add  and set up player
	this.player_layer.add(new Player(game, 400, 300, this));
	this.player = this.player_layer.children[0];
	this.hearts = [];
	for (var i = 0; i < this.player.health; i++){
	    var UI_x = 16 + 48 * i;
	    var UI_y = 16;
	    var heart = game.add.sprite(UI_x, UI_y, "heart", 0);
	    heart.animations.add("full", [0]);
	    heart.animations.add("half", [1]);
	    heart.animations.play("full");
	    heart.UI_x = UI_x;
	    heart.UI_y = UI_y;
	    this.hearts.push(heart);
	    this.UI_layer.add(heart);
	}
	//create ranged enemy
	this.r_enemy_layer.add(new LotRangeEnemy(game, 600, 400, this));
	//create melee enemy
	this.m_enemy_layer.add(new LotMeleeEnemy(game, 400, 100, this));
	this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function(){
	game.physics.arcade.overlap(
	    this.player, 
	    this.bottle_layer, 
	    this.take_bottle_damage,
	    !this.player.Invincible,
	    this);
	game.physics.arcade.overlap(
	    this.player, 
	    this.m_enemy_layer, 
	    function(player, enemy){
		return !player.Invincible() && enemy.attacking;
	    },
	    this.check_enemy_attacking,
	    this);
	if (this.player.health < this.hearts.length){
	    if (Math.ceil(this.player.health) == this.hearts.length){
		this.hearts[this.hearts.length - 1].animations.play("half");
	    } else {
		var heart = this.hearts.pop();
		this.UI_layer.remove(heart, true);
	    }
	}
	this.UI_layer.x = game.camera.x;
	this.UI_layer.y = game.camera.y;
    },

    take_bottle_damage: function(player, bottle){
	this.player.TakeDamage(.5);
	this.bottle_layer.remove(bottle, true);
    },

    take_melee_damage: function(player, enemy){
	this.player.TakeDamage(1);
    },

    resize: function(){
    },

    shutdown: function(){
    }
}
