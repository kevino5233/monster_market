var shoppingListItemNames = [
	"Bread",
	"Cheese",
	"Meat",
	"Milk",
	"Lettuce",
	"Spinach",
	"Didgeridoo",
	"Bananas",
	"Apples",
	"Squash",
	"Zucchini",
	"Vibraphone",
	"Car",
	"Wig",
	"Flowers",
	"Cake",
	"Hat",
	"Ice Cream",
	"Battletoads",
	"Fake Money"
]

ShoppingList = function(state, game)
{
	this.state = state;
	this.game = game;

	this.list = [];
}

ShoppingList.prototype = Object.create(null);
ShoppingList.prototype.constructor = ShoppingList;

ShoppingList.prototype.generate = function(numItems, numShelves)
{
	var availableNames = [];
	for(var i = 0; i < shoppingListItemNames.length; i++)
		availableNames.push(shoppingListItemNames[i]);

	var availableShelves = [];
	for(var i = 1; i <= numShelves; i++)
		availableShelves.push(i);

	for(var i = 0; i < numItems; i++)
	{
		var nameIndex = this.game.rnd.integerInRange(0, availableNames.length - 1);
		var shelfIndex = this.game.rnd.integerInRange(0, availableShelves.length - 1);

		this.add(availableNames[nameIndex], availableShelves[shelfIndex]);
		availableNames.splice(nameIndex, 1);
		availableShelves.splice(shelfIndex, 1);
	}
}

ShoppingList.prototype.addEntry = function(shoppingListEntry)
{
	this.list.push(shoppingListEntry);
}

ShoppingList.prototype.add = function(item, shelf)
{
	this.addEntry(new ShoppingListEntry(item, shelf));
}

ShoppingList.prototype.hasFoundAllItems = function()
{
	for(var i = 0; i < this.list.length; i++)
	{
		if(!this.list[i].found) return false;
	}

	return true;
}

ShoppingList.prototype.revealRandom = function()
{
	var nonrevealed = [];

	var entry;
	for(var i = 0; i < this.list.length; i++)
	{
		entry = this.list[i];
		if(!entry.revealed && !entry.found)
			nonrevealed.push(entry);
	}

	if(nonrevealed.length > 0)
	{
		nonrevealed[game.rnd.integerInRange(0, nonrevealed.length - 1)].reveal();
	}
}

ShoppingList.prototype.getItem = function(item)
{
	var entry;
	for(var i = 0; i < this.list.length; i++)
	{
		entry = this.list[i];
		if(entry.item === item) return entry;
	}
	
	return null;
}

ShoppingList.prototype.getFromShelf = function(shelf)
{
	var entry;
	for(var i = 0; i < this.list.length; i++)
	{
		entry = this.list[i];
		if(entry.shelf == shelf)
		{
			return entry;
		}
	}
	
	return null;
}

ShoppingList.prototype.revealShelf = function(shelf)
{
	var item = this.getFromShelf(shelf);
	if(item !== null) item.reveal();
}

ShoppingList.prototype.findShelf = function(shelf)
{
	var item = this.getFromShelf(shelf);
	if(item != null)
	{
		item.reveal();
		item.find();
	}
}