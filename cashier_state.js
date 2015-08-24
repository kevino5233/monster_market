var cashier_state = {
    dialogueList: [[
        "Did you find everything, okay?",
        "No?",
        "Good. We hate your kind",
        "That'll be $27 please",
        "Two twenties is all you have?",
        "TOO BAD",
        "We only accept exact change."]],
    first_bad_change_dialogue: [[
        "What did I say?",
        "I want exact change damnit!",
        "Try again, bud.",
        "Just kidding.",
        "You're not my bud."]],
    first_correct_change: [[
        "Oh, looks like you got it right...",
        "Must've been a fluke!",
        "Try again and maybe I'll be convinced",
        "You monster."]],
    second_bad_change_dialogue: [[
        "So it was a fluke?",
        "Ha, stupid monster!"]],
    second_correct_change: [[
        "Oh man, you actually can count change.",
        "Well I guess you're not that dumb",
        "for a monster.",
        "But I still don't like you",
        "So get the hell out of my store."]],
    level_data: {
        m_enemies: [],
        r_enemies: [],
        environment: [
        { x: 150, y: 0, key: "shelf" },
        { x: 150, y: 600, key: "shelf", scale: {x: 1, y: -1}},
        { x: 200, y: 240, key: "large_shelf" },
        { x: 700, y: 100, key: "large_v_shelf" },
        { x: 1000, y: 320, key: "cashier_counter" }
        ],
        assistants: [
        { x: 1000, y: 320 }]
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
        game.world.setBounds(0, 0, 1400, 600);
        this.background.create(0, 0, "cashier_bg");
        this.player_layer.add(new Player(game, 400, 200, this));
        this.player = this.player_layer.children[0];
        this.cursor = game.input.keyboard.createCursorKeys();
        this.cost = 28;
        this.money_paid = 0;
        this.num_times_correct_pay = 0;
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
            this.pickup_money,
            game.input.keyboard.isDown(k_interact),
            this);
        game.physics.arcade.collide(this.m_enemy_layer, this.envir_layer);
        game.physics.arcade.collide(this.player, this.envir_layer);
        this.UI_layer.x = game.camera.x;
        this.UI_layer.y = game.camera.y;
    },
    onDialogueComplete: function(assistant)
    {
        if (this.num_times_correct_pay == 0){
            assistant.loadDialogue(this.first_bad_change_dialogue);
        } else if (this.num_times_correct_pay == 1){
            assistant.loadDialogue(this.second_bad_change_dialogue);
        } else if (this.num_times_correct_pay == 2){
            //shit happens
        } else {
            assistant.enabled = false;
        }
    },
    pickup_money: function(player, money){
        this.money += money.value;
        if (this.money == this.cost){
            if (this.num_times_correct_pay == 0){
                assistant.loadDialogue(this.first_correct_dialogue);
            } else if (this.num_times_correct_pay == 1){
                assistant.loadDialogue(this.second_correct_dialogue);
            }        
        } else {
            if (this.num_times_correct_pay == 0){
                assistant.loadDialogue(this.first_bad_change_dialogue);
            } else if (this.num_times_correct_pay == 1){
                assistant.loadDialogue(this.second_bad_change_dialogue);
            }
        }
        money.destroy();
    },
    resize: function(){
    },

    shutdown: function(){
    }
}

