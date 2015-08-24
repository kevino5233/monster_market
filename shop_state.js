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
	level_data: {
        m_enemies: [
        	{ x: 800, 	y: 250 	},
        	{ x: 1150, 	y: 250 	},
        	{ x: 1550,	y: 250 	},
        	{ x: 2200,	y: 250	},
        	{ x: 2450,	y: 250	},
        	{ x: 2750,	y: 250	},
        	{ x: 3350,	y: 250	}
        ],

        r_enemies: [
        	{ x: 1200, 	y: 350 	},
        	{ x: 1600, 	y: 60 	},

        	{ x: 2500,	y: 60	},
        	{ x: 2900,	y: 350	},

        	{ x: 3750,	y: 200	}
       	],
        environment: [

        ],

        assistants: [
        	{ x: 1300, 	y: 300 	},
        	{ x: 2600, 	y: 300 	}
        ]
	},

	create: function() 
	{
		InitializeLayers(this);
		InitializeEvents(this);
		LoadLevel(this, this.level_data);

		game.world.setBounds(0, 0, 4000, 600);

		this.background.add(new Phaser.Sprite(game, 0, 0, "shop_bg"));

		this.player = new Player(game, 400, 300, this);
		game.physics.enable(this.player, Phaser.Physics.ARCADE);
		game.physics.arcade.enableBody(this.player);
		this.player_layer.add(this.player);

		this.generateShelves();

		this.shoppingList = new ShoppingList(this, game);
		this.shoppingList.generate(5, 18);

		this.shoppingListUi = new ShoppingListUi(this, game, this.shoppingList, 0, 0);
		this.UI_layer.add(this.shoppingListUi);

		this.cursor = game.input.keyboard.createCursorKeys();

		this.timer = new Phaser.Time(game);
		this.timer.advancedTiming = true;
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

	    game.physics.arcade.collide(this.m_enemy_layer, this.envir_layer);
	    game.physics.arcade.collide(this.player, this.envir_layer);

	    this.checkWin();
	},

	checkWin: function()
	{
		if(this.player.x >= this.game.world.bounds.x + this.game.world.bounds.width - 200)
		{
			if(this.shoppingList.hasFoundAllItems())
			{
				this.onWin();
			}
		}
	},

	onWin: function()
	{
		// LOAD NEXT STATE HERE
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
		this.shelves = [];

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

			this.shelves.push(shelf);
			this.envir_layer.add(shelf);
		}

		for(var i = 0; i < 10; i++)
		{
			shelf = new Shelf(this, game, (i + 1)*2, padding + halfWidth + i*shelfBase.width + i*spacing, game_h - halfHeight);
			shelf.onInteract.add(this.onShelfInteract, this);
			shelf.onSearchComplete.add(this.onShelfSearchComplete, this);
			shelf.scale.y = -1;
	
			this.shelves.push(shelf);
			this.envir_layer.add(shelf);
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
