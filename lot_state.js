var lot_state = {
    level_data: {
        m_enemies: [
        { x: 400, y: 100 },
        { x: 800, y: 50 },
        { x: 1600, y: 150 },
        { x: 1800, y: 400 },
        { x: 2000, y: 0 },
        { x: 2200, y: 200}],
        r_enemies: [
        { x: 500, y: 400 },
        { x: 900, y: 500 },
        { x: 950, y: 500 },
        { x: 1300, y: 200 },
        { x: 1700, y: 500 },
        { x: 1800, y: 200},
        { x: 2000, y: 200},
        { x: 2000, y: 480}],
        environment: [
        { x: 830, y: 400, key: "car_1" },
        { x: 550, y: 270, key: "car_2" },
        { x: 1110, y: 510, key: "car_3" },
        { x: 1370, y: 130, key: "car_1" },
        { x: 1550, y: 130, key: "car_1" },
        { x: 1880, y: 130, key: "car_2" },
        { x: 1780, y: 510, key: "car_3" }]
    },
    preload: function(){
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
        //create ranged enemies
        var r_enemy_data = this.level_data.r_enemies;
        for (var i = 0; i < r_enemy_data.length; i++){
            var r_enemy_dat = r_enemy_data[i];
            this.r_enemy_layer.add(
                new LotRangeEnemy(game, r_enemy_dat.x, r_enemy_dat.y, this));
        }
        //create melee enemies
        var m_enemy_data = this.level_data.m_enemies;
        for (var i = 0; i < m_enemy_data.length; i++){
            var m_enemy_dat = m_enemy_data[i];
            var m_enemy_obj = this.m_enemy_layer.add(
                new LotMeleeEnemy(game, m_enemy_dat.x, m_enemy_dat.y, this));
        }
        //create environment
        var envir_data = this.level_data.environment;
        for (var i = 0; i < envir_data.length; i++){
            var envir_dat = envir_data[i];
            var envir_obj = this.envir_layer.create(
                envir_dat.x, 
                envir_dat.y, 
                envir_dat.key);
            game.physics.enable(envir_obj);
            envir_obj.body.immovable = true;
        }
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
            function(body1, body2){
                console.log("sup");
            },
            this);
        game.physics.arcade.collide(this.m_enemy_layer, this.envir_layer);
        game.physics.arcade.collide(this.player, this.envir_layer);
        this.UI_layer.x = game.camera.x;
        this.UI_layer.y = game.camera.y;
        if (!(this.end_checkpoint.x || this.end_checkpoint.y)){
            console.log("lmao");
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
