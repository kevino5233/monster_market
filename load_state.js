var load_state = {
    preload: function(){
	game.load.image("lot_bg", "assets/parking_lot.png");
	game.load.spritesheet("player", "assets/player.png", 64, 64);
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
