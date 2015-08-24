ShoppingListUi = function(state, game, sourceList, x, y)
{
	this.state = state;
	this.game = game;
	this.data = sourceList;
	this.list = this.data.list;

	Phaser.Text.call(this, game, x, y, "ASD");
	this.anchor.x = 1;
	this.font = 'Press Start 2P';
	this.align = "right";
	this.fontSize = 24;
}

ShoppingListUi.prototype = Object.create(Phaser.Text.prototype);
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
	this.text = toSet;
}