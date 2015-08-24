var shop_state = {
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
		LoadLevel(this, this.level_data);

		game.world.setBounds(0, 0, 4000, 600);

		this.background.add(new Phaser.Sprite(game, 0, 0, "shop_bg"));

		this.player = new Player(game, 400, 300, this);
		game.physics.enable(this.player, Phaser.Physics.ARCADE);
		game.physics.arcade.enableBody(this.player);
		this.player_layer.add(this.player);

		this.generateShelves();

		this.shoppingList = new ShoppingList(this, game);
		this.shoppingList.generate(5, 20);

		this.shoppingListUi = new ShoppingListUi(this, game, this.shoppingList, 0, 0);
		this.UI_layer.add(this.shoppingListUi);

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

	    game.physics.arcade.collide(this.m_enemy_layer, this.envir_layer);
	    game.physics.arcade.collide(this.player, this.envir_layer);
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