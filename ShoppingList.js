var shoppingListItemNames = [
	"Bread",
	"Cheese",
	"Meat",
	"Milk",
	"Lettuce",
	"Spinach",
	"Didgeridoo",
	"Bananas",
	"Apples"
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
	var filledShelves = [];
	for(var i = 0; i < numItems; i++)
	{
		var name;
		if(numItems < shoppingListItemNames)
		{
			name = shoppingListItemNames[this.game.rnd.integerInRange(0, shoppingListItemNames.length - 1)];
		} else {
			do {
				name = shoppingListItemNames[this.game.rnd.integerInRange(0, shoppingListItemNames.length - 1)];
			} while(this.getItem(name) !== null);
		}
		
		if(i < numShelves)
		{
			var shelfId;
			do {
				shelfId = this.game.rnd.integerInRange(1, numShelves);
			} while(filledShelves.indexOf(shelfId) >= 0);
			filledShelves.push(shelfId);

			this.add(name, shelfId);
		}
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