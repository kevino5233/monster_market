ShoppingListUi = function(state, game, sourceList, x, y)
{
	this.state = state;
	this.game = game;
	this.data = sourceList;
	this.list = this.data.list;

	Phaser.Group.call(this, game);

	this.text = new Phaser.Text(game, 0, 0, "");
	this.invalidate();
	this.text.anchor.x = this.text.anchor.y = 0.5;
	this.text.x = game_w - this.text.width/2 - 40;
	this.text.y = this.text.height/2;
	this.text.font = 'Press Start 2P';
	this.text.align = "right";
	this.text.fontSize = 20;

	this.bg = new Phaser.Graphics(game, 0, 0);
	var padding = 10;
	this.bg.beginFill(0xffffff);
	this.bg.drawRect(	this.text.x - this.text.width/2 - padding,
					 	this.text.y - this.text.height/2 - padding,
						this.text.width + padding,
						this.text.height + padding);
	this.bg.alpha = 0.5;

	this.add(this.bg);
	this.add(this.text);
}

ShoppingListUi.prototype = Object.create(Phaser.Group.prototype);
ShoppingListUi.prototype.constructor = ShoppingListUi;

ShoppingListUi.prototype.update = function()
{
	this.invalidate();
}

ShoppingListUi.prototype.invalidate = function()
{
	var toSet = "";
	if(this.list !== null)
	{
		var entry;
		for(var i = 0; i < this.list.length; i++)
		{
			entry = this.list[i];

			toSet += entry.toString(" ");
			if(i != this.list.length - 1) toSet += "\n";
		}
	}
	this.text.text = toSet;
}