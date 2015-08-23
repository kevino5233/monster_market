Shelf = function(state, game, id, x, y)
{
	this.added = false;

	this.state = state;
	this.game = game;
	this.id = id;

	Phaser.Sprite.call(this, game, x, y, "shelf");
	this.anchor.x = this.anchor.y = 0.5;

	this.onInteract = new Phaser.Signal();
	this.interactDistanceMax = 20 + this.height/2 + state.player.height/2;
	this.interactable = true;

	this.onSearchComplete = new Phaser.Signal();
	this.onSearchProgress = new Phaser.Signal();
	this.searchTime = 1.5;
	this.searchTimer = 0.0;

	this.searchDecayTime = 0.3;
	this.searchComplete = false;

	this.shakeTime = 0.05;
	this.shakeTimer = 0.0;

	this.originalX = this.x;

	this.colliding = false;

	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.game.physics.arcade.enableBody(this);

	this.searchBar = new ProgressBar(state, game, x - this.width/2, y, this.width, this.height/8, 0x00ff00);
	this.searchBar.alpha = 0.5;

	this.body.immovable = true;
};

Shelf.prototype = Object.create(Phaser.Sprite.prototype);
Shelf.prototype.constructor = Shelf;

Shelf.prototype.create = function()
{
	this.added = true;
	this.game.add.existing(this.searchBar);
};

Shelf.prototype.update = function()
{
	if(!this.added)
	{
		this.added = true;
		this.create();
	}

	this.colliding = false;
	this.game.physics.arcade.collide(this, this.state.player, this.onCollide, null);

	if(!this.searchComplete)
	{
		this.searchTimer -= this.searchDecayTime*(this.game.time.elapsedMS/1000);
		if(this.searchTimer < 0) this.searchTimer = 0;
	}
	
	if(this.interactable) this.checkInteraction()

	this.updateSearchBar();
};

Shelf.prototype.checkInteraction = function()
{
	if(this.colliding || this.isWithinInteractionRange(this.state.player))
	{
		if(this.game.input.keyboard.isDown(k_interact))
		{
			this.onInteract.dispatch(this);
		}
	}
}

Shelf.prototype.search = function(time)
{
	this.searchTimer += time;
	this.onSearchProgress.dispatch(time, this.searchTimer);

	this.shakeTimer += time;
	if(this.shakeTimer > this.shakeTime)
	{
		this.shakeTimer -= this.shakeTime;
		this.x = this.originalX;
		this.x += this.game.rnd.between(-3, 3);
	}

	this.searchTimer += this.searchDecayTime*(this.game.time.elapsedMS/1000);

	if(this.searchTimer > this.searchTime)
	{
		this.searchTimer = this.searchTime;
		this.game.add.tween(this.searchBar).
			to( { height: this.height, y: this.y - this.height/2, alpha: this.searchBar.alpha/3 },
			500, Phaser.Easing.Cubic.Out, true);
		this.x = this.originalX;

		this.searchComplete = true;
		this.onSearchComplete.dispatch(this);
	}

	this.updateSearchBar();
}

Shelf.prototype.updateSearchBar = function()
{
	this.searchBar.progress = this.searchTimer / this.searchTime;
	this.searchBar.invalidate();
}

Shelf.prototype.isWithinInteractionRange = function(sprite)
{
	return (Math.abs(this.state.player.y - this.y) < this.interactDistanceMax) &&
		(Math.abs(this.state.player.x - this.x) < (this.width) / 2);
}

Shelf.prototype.onCollide = function(shelf, player)
{
	isColliding = true;
};