var shop_state = {
        dialogueList : [
            [
                "I'm sort of busy with the riots going on right now...",
                "THANKS TO YOU.",
                "I'm losing business fast.",
                "Do you even have money?",
                "...",
                "Wow, that's a lot of money.",
                "You stole it, didn't you?",
                "Well... guess it's not my problem.",
                "What are you looking for?",
                "Oh yeah, I know where that is."
            ],

            [
                "Yeah?",
                "You really can't find it yourself?",
                "There's signs that tell you, you know.",
                "Can you even read?",
                "...",
                "Sorry to have offended you, sir.",
                "Please don't talk to the manager.",
                "No, don't! I'll lose my job!",
                "Alright, I'll tell you where it is.",
                "Blackmail sucks."
            ],

            [
                "Not you again...",
                "You should really shop somewhere else.",
                "Seriously, there are BOTTLES EVERYWHERE.",
                "This is gonna take ages to clean up.",
                "You shouldn't be here.",
                "You're driving away all my business.",
                "Look, if I tell you where it is...",
                "Will you shop somewhere else?",
                "Please?",
                "Deal!"
            ],

            [
                "Wanna see a magic trick?",
                "No? Ok.",
                "Wanna see me dance?",
                "No? Ok.",
                "Wanna see my wife?",
                "Haha, gotcha, I don't have a wife!",
                "HAHAHAHAHAAAAAAAAAAAAAA",
                "...",
                "...",
                "i'm lonely"
            ],

            [
                "Let me guess.",
                "You're looking for something.",
                "This is the fifth time, man.",
                "The FIFTH time!",
                "Why can't people just leave me alone?",
                "I'm supposed to be stocking shelves.",
                "But monsters like you go prancing up to me",
                "like I'm the king of the swamp or something.",
                "Well you know what?",
                "I'm DONE helping you."
            ]
    ],

	create: function() 
	{
		//StateUtil.InitializeLayers(this);
		this.background = game.add.group(),
        this.player_layer = game.add.group(),
        this.m_enemy_layer = game.add.group(),
        this.r_enemy_layer = game.add.group(),
        this.shelves = game.add.group(),
        this.envir_layer = game.add.group(),
        this.bottle_layer = game.add.group(),
        this.UI_layer = game.add.group()

		var level_data = {
			m_enemies: [

			]
		}
		
		game.world.setBounds(0, 0, 4000, 600);

		this.background.add(new Phaser.Sprite(game, 0, 0, "shop_bg"));

		this.player = new Player(game, 400, 300, this);
		game.physics.enable(this.player, Phaser.Physics.ARCADE);
		game.physics.arcade.enableBody(this.player);
		this.player_layer.add(this.player);

		this.generateShelves();

		//this.r_enemy_layer.add(new LotRangeEnemy(game, 600, 400, this));
		//this.m_enemy_layer.add(new LotMeleeEnemy(game, 600, 200, this));

		this.shoppingList = new ShoppingList(this, game);
		this.shoppingList.generate(5, 20);

		this.shoppingListUi = new ShoppingListUi(this, game, this.shoppingList, 0, 0);
		this.UI_layer.add(this.shoppingListUi);

		this.shoppingAssistant = new ShoppingAssistant(this, game, 500, 300, this.dialogueList);
		this.shoppingAssistant.onDialogueComplete.add(this.onDialogueComplete, this);
		this.envir_layer.add(this.shoppingAssistant);

		this.cursor = game.input.keyboard.createCursorKeys();

		this.timer = new Phaser.Time(game);
		this.timer.advancedTiming = true;
	},

	take_bottle_damage: function(player, bottle){
		this.player.TakeDamage(.5);
		this.bottle_layer.remove(bottle, true);
    },

    take_melee_damage: function(player, enemy){
		this.player.TakeDamage(1);
    },

	update: function()
	{
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

	    game.physics.arcade.collide(this.m_enemy_layer, this.shelves);
	},

	preRender: function()
	{
		this.UI_layer.x = game.camera.x;
		this.UI_layer.y = game.camera.y;
	},

	onDialogueComplete: function(assistant)
	{
		assistant.endDialogue();

		this.shoppingList.revealRandom();
		var entry;
		for(var i = 0; i < this.shoppingList.list.length; i++)
		{
			entry = this.shoppingList.list[i];
			if(!entry.revealed) return;
		}
		assistant.enabled = false;
	},

	generateShelves: function()
	{
		var shelfBase = new Shelf(this, game, 0, 0);
		var halfWidth = shelfBase.width / 2;
		var halfHeight = shelfBase.height / 2;
		var padding = 5;
		var spacing = 20;

		var shelf;
		for(var i = 0; i < 10; i++)
		{
			shelf = new Shelf(this, game, i*2 + 1, padding + halfWidth + i*shelfBase.width + i*spacing, halfHeight)
			shelf.onInteract.add(this.onShelfInteract, this);
			shelf.onSearchComplete.add(this.onShelfSearchComplete, this);

			this.shelves.add(shelf);
		}

		for(var i = 0; i < 10; i++)
		{
			shelf = new Shelf(this, game, (i + 1)*2, padding + halfWidth + i*shelfBase.width + i*spacing, game_h - halfHeight);
			shelf.onInteract.add(this.onShelfInteract, this);
			shelf.onSearchComplete.add(this.onShelfSearchComplete, this);
			shelf.scale.y = -1;
	
			this.shelves.add(shelf);
		}
	},

	onShelfInteract: function(shelf)
	{
		shelf.search(game.time.elapsedMS / 1000);
	},

	onShelfSearchComplete: function(shelf)
	{
		shelf.interactable = false;
		this.shoppingList.findShelf(shelf.id);
	}
}
