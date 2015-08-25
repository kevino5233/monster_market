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
        "",
        "What did I say?",
        "I want exact change damnit!",
        "Try again, bud.",
        "Just kidding.",
        "You're not my bud."]],
    first_correct_change: [[
        "",
        "Oh, looks like you got it right...",
        "Must've been a fluke!",
        "Do it again",
        "maybe I'll be convinced",
        "$28",
        "You monster."]],
    second_bad_change_dialogue: [[
        "",
        "So it was a fluke?",
        "Can't even pick up $28...",
        "Ha, stupid monster!"]],
    second_correct_change: [[
        "",
        "Oh man",
        "you actually can count change.",
        "Well I guess you're not that dumb",
        "for a monster.",
        "But I still don't like you",
        "So get the hell out of my store."]],
    level_data: {
        m_enemies: [],
        r_enemies: [
        { x: 600, y: 60 },
        { x: 180, y: 200 },
        { x: 700, y: 0 },
        { x: 1075, y: 20 },
        { x: 1150, y: 200 }
        ],
        environment: [
        { x: 150, y: 0, key: "shelf" },
        { x: 150, y: 496, key: "shelf-v" },
        { x: 200, y: 240, key: "large_shelf" },
        { x: 700, y: 100, key: "large_v_shelf" },
        { x: 1050, y: 450, key: "cashier_counter" }
        ],
        assistants: [
        { x: 1000, y: 450 }]
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
        this.end_player_tween = game.add.tween(this.player);
        this.end_player_tween.to({x: -100, y: 300}, 1999);
        this.end_player_tween.onStart.add(
            function(player){
                player.tween_active = false;
            },
            this.player);
        this.assistant = this.assistant_layer.children[0];
        this.assistant.sprite.visible = false;
        this.cursor = game.input.keyboard.createCursorKeys();
        
        this.gunman = this.m_enemy_layer.add(
            new Cashier(game, this.assistant.x, this.assistant.y, this));
        this.gunman.scale.x = -1;

        this.cost = 28;
        this.money_thrown = 40;
        this.money_paid = 40;
        this.num_times_correct_pay = 0;

	var padding = 32;
        this.money_ui_text = new Phaser.Text(game, 0, 0, "$" + this.money_paid);
	this.money_ui_text.anchor.x = 1;
	this.money_ui_text.anchor.y = 1;
	this.money_ui_text.x = game_w - padding;
	this.money_ui_text.y = padding * 2;
	this.money_ui_text.font = 'Press Start 2P';
	this.money_ui_text.align = "right";
	this.money_ui_text.fontSize = 32;

        this.money_ui_bg = new Phaser.Graphics(game, 0, 0);
	this.money_ui_bg.beginFill(0xffffff);
	this.money_ui_bg.drawRect(this.money_ui_text.x - this.money_ui_text.width - 10,
        this.money_ui_text.y - this.money_ui_text.height - 10,
        this.money_ui_text.width + 20,
        this.money_ui_text.height + 20);
	this.money_ui_bg.alpha = 0.5;
        this.UI_layer.add(this.money_ui_text);
        this.UI_layer.add(this.money_ui_bg);

        this.bill_ui_text = new Phaser.Text(game, 0, 0, "$0");
	this.bill_ui_text.anchor.x = 1;
	this.bill_ui_text.anchor.y = 1;
	this.bill_ui_text.x = game_w - padding * 5;
	this.bill_ui_text.y = padding * 2;
	this.bill_ui_text.font = 'Press Start 2P';
	this.bill_ui_text.align = "right";
	this.bill_ui_text.fontSize = 32;

        this.bill_ui_bg = new Phaser.Graphics(game, 0, 0);
	this.bill_ui_bg.beginFill(0xffffff);
	this.bill_ui_bg.drawRect(this.bill_ui_text.x - this.money_ui_text.width - 10,
        this.bill_ui_text.y - this.money_ui_text.height - 10,
        this.money_ui_text.width + 20,
        this.money_ui_text.height + 20);
	this.bill_ui_bg.alpha = 0.5;
        this.UI_layer.add(this.bill_ui_text);
        this.UI_layer.add(this.bill_ui_bg);

        this.end_checkpoint = game.add.sprite(2150, 300, "black");
        this.end_checkpoint.scale = {x: 100, y: 100};
        this.end_checkpoint.alpha = 0;
        game.physics.enable(this.end_checkpoint);
    },
    update: function(){
        game.physics.arcade.overlap(
            this.player,
            this.end_checkpoint,
            this.begin_exit,
            null,
            this);
        game.physics.arcade.overlap(
            this.player, 
            this.bottle_layer, 
            this.take_bullet_damage,
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
            this.money_layer,
            this.pickup_money,
            null,
            this);
        game.physics.arcade.collide(this.m_enemy_layer, this.envir_layer);
        game.physics.arcade.collide(this.money_layer, this.r_enemy_layer);
        game.physics.arcade.collide(this.money_layer, this.m_enemy_layer);
        game.physics.arcade.collide(this.money_layer, this.envir_layer);
        game.physics.arcade.collide(this.player, this.envir_layer);
        if (!(this.end_checkpoint.x || this.end_checkpoint.y)){
            if (this.end_checkpoint.alpha >= 1){
            } else {
                this.end_checkpoint.alpha += 1/120;
            }
        }
    },
    onDialogueComplete: function(assistant)
    {
        if (this.num_times_correct_pay == 0){
            assistant.loadDialogue(this.first_bad_change_dialogue);
            this.throw_money(assistant.x, assistant.y);
        } else if (this.num_times_correct_pay == 1){
            assistant.loadDialogue(this.second_bad_change_dialogue);
            this.throw_money(assistant.x, assistant.y);
        } else {
            if (this.num_times_correct_pay == 2){
                this.gunman.scale.x = -1;
                this.gunman.animations.play("pickup");
            }
            assistant.enabled = false;
        }
    },
    pickup_money: function(player, money){
        this.bill_ui_text.text = "$" + money.value;
        if (game.input.keyboard.isDown(k_interact) && !money.tween_active){
            this.money_paid += money.value;
            this.money_layer.remove(money, true);
            if (this.money_paid == this.cost){
                console.log("EEEEZZ$$$$$");
                if (this.num_times_correct_pay == 0){
                    this.assistant.loadDialogue(this.first_correct_change);
                } else if (this.num_times_correct_pay == 1){
                    this.assistant.loadDialogue(this.second_correct_change);
                }
                this.num_times_correct_pay++;
            } else {
                if (this.num_times_correct_pay == 0){
                    this.assistant.loadDialogue(this.first_bad_change_dialogue);
                } else if (this.num_times_correct_pay == 1){
                    this.assistant.loadDialogue(this.second_bad_change_dialogue);
                }
            }
        }
    },
    throw_money: function(orig_x, orig_y){
        var money_thrown = 0;
        while (money_thrown < this.money_thrown){
            var money_can_throw = [];
            var money_left = this.money_thrown - money_thrown;
            if (money_left >= 10){
                money_can_throw.push(10);
            }
            if (money_left >= 5){
                money_can_throw.push(5);
            }
            if (money_left >= 1){
                money_can_throw.push(1);
                money_can_throw.push(1);
                money_can_throw.push(1);
            }
            var money_cost = game.rnd.weightedPick(money_can_throw);
            var money_obj = this.money_layer.create(orig_x, orig_y, "money");
            money_obj.value = money_cost;
            var throw_x = game.rnd.integerInRange(-128, 128);
            var throw_y = game.rnd.integerInRange(-384, -128);
            var new_x = orig_x + throw_x;
            var new_y = orig_y + throw_y;

            var money_obj_tween = game.add.tween(money_obj)
            money_obj_tween.to({x: new_x, y: new_y}, 500);
            money_obj_tween.start();
            money_obj.tween_active = true;
            money_obj_tween.onComplete.add(function(money, money_tween){
                money.tween_active = false;
            });
            game.physics.enable(money_obj);
            money_thrown += money_cost;
        }
        this.money_paid = 0;
    },
    preRender: function()
    {
            this.money_ui_text.text = "$" + this.money_paid;
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
