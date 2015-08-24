Dialogue = function(state, game, x, y, dialogueList)
{
	this.state = state;
	this.game = game;

	Phaser.Group.call(this, game);

        this.dialogueList = dialogueList;
	this.dialogueLimit = 5;
	this.dialogues = [];
	
	this.x = x;
	this.y = y;
}

Dialogue.prototype = Object.create(Phaser.Group.prototype);
Dialogue.prototype.constructor = Dialogue;

Dialogue.prototype.onTweenComplete = function(target, tween)
{
	if(target.index >= this.dialogueLimit - 1) this.remove(target);
}

Dialogue.prototype.push = function(text, color)
{
	var dialogue = new Phaser.Text(game, 0, 0, text);
	dialogue.anchor.x = dialogue.anchor.y = 0.5;
	dialogue.font = "Press Start 2P";
	dialogue.addColor(color, 0);
	dialogue.fontSize = 12;

	dialogue.y += dialogue.height;
	dialogue.alpha = 0;
	this.game.add.tween(dialogue).to(
		{y:dialogue.y - dialogue.height, alpha:1}, 500, Phaser.Easing.Cubic.Out, true);

	this.shiftAll();
	this.dialogues[0] = dialogue;
	this.add(dialogue);

	return dialogue;
}

Dialogue.prototype.shiftAll = function()
{
	var amount = Math.min(this.dialogueLimit, this.dialogues.length);
	var dialogue;
	for(var i = amount - 1; i >= 0; i--)
	{
		dialogue = this.dialogues[i];
		dialogue.index = i;

		var tween = this.game.add.tween(dialogue).to(
		{
			y: dialogue.y - dialogue.height,
			alpha: 1 - Math.min(i + 1, this.dialogueLimit)/this.dialogueLimit
		}, 500, Phaser.Easing.Cubic.Out, true);
		tween.onComplete.add(this.onTweenComplete);

		if(i < this.dialogueLimit - 1)
		{
			this.dialogues[i + 1] = dialogue;
			dialogue.index = i + 1;
		}

		this.dialogues[i] = null;
	}
}

Dialogue.prototype.show = function(listIndex, index, color)
{
	var fixedListIndex;
	var fixedIndex;

	if(listIndex < 0) fixedListIndex = 0;
	else if(listIndex >= this.dialogueList.length) fixedListIndex = this.dialogueList.length - 1;
	else fixedListIndex = listIndex;

	if(fixedIndex < 0) fixedIndex = 0;
	else if(fixedIndex >= this.dialogueList[fixedListIndex].length)
		fixedIndex = this.dialogueList[fixedListIndex].length;
	else fixedIndex = index;

	this.push(this.dialogueList[fixedListIndex][fixedIndex], color);
}
