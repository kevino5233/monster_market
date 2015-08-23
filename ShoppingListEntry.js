ShoppingListEntry = function(item, shelf)
{
	this.item = item;
	this.shelf = shelf;
	this.revealed = false;
	this.found = false;
}

ShoppingListEntry.prototype = Object.create(null);
ShoppingListEntry.prototype.constructor = ShoppingListEntry;

ShoppingListEntry.prototype.reveal = function()
{
	this.revealed = true;
}

ShoppingListEntry.prototype.find = function()
{
	this.found = true;
}

ShoppingListEntry.prototype.toString = function(delimiter)
{
	if(this.found)
	{
		return this.item + delimiter + "GET!";
	} else if(this.revealed)
	{
		return this.item + delimiter + this.shelf;
	} else {
		return this.item + delimiter + "???";
	}
}