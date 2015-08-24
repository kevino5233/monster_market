ShoppingListUi = function(state, game, sourceList, x, y)
{
	this.state = state;
	this.game = game;
	this.data = sourceList;
	this.list = this.data.list;

	var padding = 10;

	Phaser.Group.call(this, game);

	this.text = new Phaser.Text(game, 0, 0, "");
	this.invalidate();
	this.text.anchor.x = 1;
	this.text.anchor.y = 0;
	this.text.x = game_w - padding;
	this.text.y = padding;
	this.text.font = 'Press Start 2P';
	this.text.align = "right";
	this.text.fontSize = 16;

	this.bg = new Phaser.Graphics(game, 0, 0);
	
	this.bg.beginFill(0xffffff);
	this.bg.drawRect(	this.text.x - this.text.width - padding - 10,
					 	this.text.y - padding,
						this.text.width + padding*2 + 20,
						this.text.height + padding*2);
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