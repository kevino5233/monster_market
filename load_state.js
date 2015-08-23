var load_state = {
    preload: function(){
	game.load.image("lot_bg", "assets/parking_lot.png");
    game.load.image("shelf", "assets/shelf.png");
    game.load.image("shop_bg", "assets/shop.png")
	game.load.image("car_1", "assets/car_1.png");
	game.load.image("car_2", "assets/car_2.png");
	game.load.image("car_3", "assets/car_3.png");
	game.load.spritesheet("heart", "assets/heart.png", 32, 32);
	game.load.spritesheet("player", "assets/player.png", 64, 64);
	game.load.spritesheet("lot_m_enemy", "assets/lot_m_enemy.png", 64, 128);
	game.load.spritesheet("lot_r_enemy", "assets/lot_r_enemy.png", 64, 128);
	game.load.spritesheet("bottle", "assets/bottle.png", 32, 32);
	game.load.audio("lot_music", "assets/parking.mp3");
	game.load.audio("shop_music", "assets/shopping.mp3");
    },

    loadUpdate: function(){
    },

    loadRender: function(){
    },

    create: function(){
        game.state.start("lot");
        //game.state.start("shop");
    },

    update: function(){
    },

    resize: function(){
    },

    shutdown: function(){
    }
}
