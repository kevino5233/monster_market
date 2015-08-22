var boot_state = {
    preload: function(){
    },

    loadUpdate: function(){
    },

    loadRender: function(){
    },

    create: function(){
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.state.start("load");
    },

    update: function(){
    },

    resize: function(){
    },

    shutdown: function(){
    }
}

