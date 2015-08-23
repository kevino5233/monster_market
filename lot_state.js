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
	this.background = game.add.group(),
	this.player_layer = game.add.group(),
	this.m_enemy_layer = game.add.group(),
	this.r_enemy_layer = game.add.group(),
	this.envir_layer = game.add.group(),
	this.bottle_layer = game.add.group(),
	this.UI_layer = game.add.group()
	//level config
	game.world.setBounds(0, 0, 2400, 600);
	//this.bg_music = game.add.audio("lot_music", 1, true).play();
	//load sprites
	game.add.sprite(0, 0, "lot_bg");
	//add  and set up player
	this.player_layer.add(new Player(game, 400, 300, this));
	this.player = this.player_layer.children[0];
	game.add.existing(this.player);
	//create ranged enemy
	this.r_enemy_layer.add(new LotRangeEnemy(game, 600, 400, this));
	var r_enemies = this.r_enemy_layer.children;
	for (var i = 0; i < r_enemies.length; i++){
	    game.add.existing(r_enemies[0]);
	}
	//create melee enemy
	this.m_enemy_layer.add(new LotMeleeEnemy(game, 400, 100, this));
	var m_enemies = this.m_enemy_layer.children;
	for (var i = 0; i < m_enemies.length; i++){
	    game.add.existing(m_enemies[0]);
	}
	this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function(){
	game.physics.arcade.overlap(
	    this.player, 
	    this.bottle_layer, 
	    this.take_bottle_damage,
	    null,
	    this);
	game.physics.arcade.overlap(
	    this.player, 
	    this.m_enemy_layer, 
	    this.take_melee_damage,
	    this.check_enemy_attacking,
	    this);
    },

    take_bottle_damage: function(player, bottle){
	this.player.damage(.5);
	this.bottle_layer.remove(bottle, true);
    },

    take_melee_damage: function(player, enemy){
	this.player.damage(1);
    },

    check_enemy_attacking: function(player, enemy){
	return enemy.attacking;
    },

    resize: function(){
    },

    shutdown: function(){
    }
}
