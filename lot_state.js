var lot_state = {
    level_data: {
        m_enemies: [
        { x: 700, y: 100 },
        { x: 800, y: 50 },
        { x: 1350, y: 250 },
        { x: 1600, y: 150 },
        { x: 1800, y: 400 },
        { x: 2000, y: 0 },
        { x: 2200, y: 200}],
        r_enemies: [
        { x: 700, y: 400 },
        { x: 900, y: 500 },
        { x: 950, y: 500 },
        { x: 1300, y: 200 },
        { x: 1700, y: 300 },
        { x: 1800, y: 200},
        { x: 2000, y: 200},
        { x: 2000, y: 510}],
        environment: [
        { x: 830, y: 400, key: "car_1" },
        { x: 550, y: 270, key: "car_2" },
        { x: 1110, y: 510, key: "car_3" },
        { x: 1370, y: 160, key: "car_1" },
        { x: 1550, y: 260, key: "car_1" },
        { x: 1880, y: 200, key: "car_2" },
        { x: 1780, y: 500, key: "car_3" }]
    },
    preload: function(){
    },

    loadUpdate: function(){
    },

    loadRender: function(){
    },

    create: function(){
        //level config
        InitializeLayers(this);
        InitializeEvents(this);
        LoadLevel(this, this.level_data);
        game.world.setBounds(0, 0, 2400, 600);
        this.background.create(0, 0, "lot_bg");
        //this.bg_music = game.add.audio("lot_music", 1, true).play();
        //load sprites
        //add  and set up player
        this.player_layer.add(new Player(game, 400, 300, this));
        this.player = this.player_layer.children[0];
        this.end_player_tween = game.add.tween(this.player);
        this.end_player_tween.to({x: 2500, y: 300}, 1999);
        this.end_player_tween.onStart.add(
            function(player){
                player.tween_active = false;
            },
            this.player);
        this.end_checkpoint = game.add.sprite(2150, 300, "black");
        this.end_checkpoint.scale = {x: 100, y: 100};
        this.end_checkpoint.alpha = 0;
        game.physics.enable(this.end_checkpoint);
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
            this.take_melee_damage,
            function(player, enemy){
                return !player.Invincible() && enemy.attacking;
            },
            this);
        game.physics.arcade.overlap(
            this.player,
            this.end_checkpoint,
            this.begin_exit,
            null,
            this);
        game.physics.arcade.collide(this.m_enemy_layer, this.envir_layer);
        game.physics.arcade.collide(this.player, this.envir_layer);
        if (!(this.end_checkpoint.x || this.end_checkpoint.y)){
            if (this.end_checkpoint.alpha >= 1){
                game.state.start("shop");
            } else {
                this.end_checkpoint.alpha += 1/120;
            }
        }
    },

    take_bottle_damage: function(player, bottle){
        this.player.TakeDamage(.5);
        bottle.destroy();
    },

    take_melee_damage: function(player, enemy){
        this.player.TakeDamage(1);
    },

    preRender: function(){
        this.UI_layer.x = game.camera.x;
        this.UI_layer.y = game.camera.y;
    },

    begin_exit: function(){
        this.UI_layer.add(this.end_checkpoint);
        this.end_checkpoint.x = 0;
        this.end_checkpoint.y = 0;
        this.end_checkpoint.scale = {x: game_w, y: game_h};
        this.end_player_tween.start();
    },
    resize: function(){
    },

    shutdown: function(){
    }
}
