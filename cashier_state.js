var cashier_state = {
    level_data: {
        m_enemies: [],
        r_enemies: [],
        environment: [
        { x: 150, y: 0, key: "shelf" },
        { x: 150, y: 600, key: "shelf", scale: {x: 1, y: -1}},
        { x: 200, y: 240, key: "large_shelf" },
        { x: 700, y: 100, key: "large_v_shelf" },
        { x: 1000, y: 320, key: "cashier" }
        ]
    },

    preload: function(){
    },

    loadUpdate: function(){
    },

    loadRender: function(){
    },

    create: function(){
        this.background = game.add.group(),
        this.envir_layer = game.add.group(),
        this.player_layer = game.add.group(),
        this.m_enemy_layer = game.add.group(),
        this.r_enemy_layer = game.add.group(),
        this.bottle_layer = game.add.group(),
        this.UI_layer = game.add.group()
        //level config
        game.world.setBounds(0, 0, 1400, 600);
        this.background.create(0, 0, "cashier_bg");
        this.player_layer.add(new Player(game, 400, 300, this));
        this.player = this.player_layer.children[0];
        //create ranged enemies
        var r_enemy_data = this.level_data.r_enemies;
        for (var i = 0; i < r_enemy_data.length; i++){
            var r_enemy_dat = r_enemy_data[i];
            var r_enemy_obj = this.r_enemy_layer.add(
                new LotRangeEnemy(game, r_enemy_dat.x, r_enemy_dat.y, this));
            if (r_enemy_dat.scale){
                r_enemy_obj.scale = r_enemy_dat.scale;
            }
        }
        //create melee enemies
        var m_enemy_data = this.level_data.m_enemies;
        for (var i = 0; i < m_enemy_data.length; i++){
            var m_enemy_dat = m_enemy_data[i];
            var m_enemy_obj = this.m_enemy_layer.add(
                new LotMeleeEnemy(game, m_enemy_dat.x, m_enemy_dat.y, this));
            if (m_enemy_dat.scale){
                m_enemy_obj.scale = m_enemy_dat.scale;
            }
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
            if (envir_dat.scale){
                envir_obj.scale = envir_dat.scale;
            }
        }
        this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function(){
        this.UI_layer.x = game.camera.x;
        this.UI_layer.y = game.camera.y;
    },

    resize: function(){
    },

    shutdown: function(){
    }
}

