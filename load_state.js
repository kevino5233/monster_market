var load_state = {
    preload: function(){
	game.load.image("lot_bg", "assets/parking_lot.png");
	game.load.spritesheet("player", "assets/player.png", 64, 64);
	game.load.spritesheet("lot_m_enemy", "assets/lot_m_enemy.png", 64, 128);
	game.load.spritesheet("lot_r_enemy", "assets/lot_r_enemy.png", 64, 128);
	game.load.audio("lot_music", "assets/parking.mp3");
	game.load.audio("shop_music", "assets/shopping.mp3");
    },

    loadUpdate: function(){
    },

    loadRender: function(){
    },

    create: function(){
	game.state.start("lot");
    },

    update: function(){
    },

    resize: function(){
    },

    shutdown: function(){
    }
}
