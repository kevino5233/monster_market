var shop_state = {
	create: function() 
	{
		StateUtil.InitializeLayers(this);
		
		game.world.setBounds(0, 0, 4000, 600);

		game.add.sprite(0, 0, "shop_bg");

		this.player = new Player(game, 400, 300, this);
		game.physics.enable(this.player, Phaser.Physics.ARCADE);
		game.physics.arcade.enableBody(this.player);
		game.add.existing(this.player);

		this.generateShelves();

		game.add.existing(new LotRangeEnemy(game, 600, 400, this));
		game.add.existing(new LotMeleeEnemy(game, 600, 200, this));

		this.shoppingList = new ShoppingList(this, game);
		this.shoppingList.generate(5, 20);

		this.shoppingListUi = new ShoppingListUi(this, game, this.shoppingList, 0, 0);
		//this.UI_layer.add(this.shoppingListUi);
		game.add.existing(this.shoppingListUi);

		this.cursor = game.input.keyboard.createCursorKeys();

		this.timer = new Phaser.Time(game);
		this.timer.advancedTiming = true;
	},

	update: function()
	{
		this.UI_layer.x = game.camera.x;
		this.UI_layer.y = game.camera.y;
	},

	preRender: function()
	{

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
			game.add.existing(shelf);
		}

		for(var i = 0; i < 10; i++)
		{
			shelf = new Shelf(this, game, (i + 1)*2, padding + halfWidth + i*shelfBase.width + i*spacing, game_h - halfHeight);
			shelf.onInteract.add(this.onShelfInteract, this);
			shelf.onSearchComplete.add(this.onShelfSearchComplete, this);
			shelf.scale.y = -1;
			
			game.add.existing(shelf);
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