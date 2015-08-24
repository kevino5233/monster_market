var dialogueList = [
	[
		"I'm sort of busy with the riots going on right now...",
		"THANKS TO YOU.",
		"I'm losing business fast.",
		"Do you even have money?",
		"...",
		"Wow, that's a lot of money.",
		"You stole it, didn't you?",
		"Well... guess it's not my problem.",
		"What are you looking for?",
		"Oh yeah, I know where that is."
	],

	[
		"Yeah?",
		"You really can't find it yourself?",
		"There's signs that tell you, you know.",
		"Can you even read?",
		"...",
		"Sorry to have offended you, sir.",
		"Please don't talk to the manager.",
		"No, don't! I'll lose my job!",
		"Alright, I'll tell you where it is.",
		"Blackmail sucks."
	],

	[
		"Not you again...",
		"You should really shop somewhere else.",
		"Seriously, there are BOTTLES EVERYWHERE.",
		"This is gonna take ages to clean up.",
		"You shouldn't be here.",
		"You're driving away all my business.",
		"Look, if I tell you where it is...",
		"Will you shop somewhere else?",
		"Please?",
		"Deal!"
	],

	[
		"Wanna see a magic trick?",
		"No? Ok.",
		"Wanna see me dance?",
		"No? Ok.",
		"Wanna see my wife?",
		"Haha, gotcha, I don't have a wife!",
		"HAHAHAHAHAAAAAAAAAAAAAA",
		"...",
		"...",
		"i'm lonely"
	],

	[
		"Let me guess.",
		"You're looking for something.",
		"This is the fifth time, man.",
		"The FIFTH time!",
		"Why can't people just leave me alone?",
		"I'm supposed to be stocking shelves.",
		"But monsters like you go prancing up to me",
		"like I'm the king of the swamp or something.",
		"Well you know what?",
		"I'm DONE helping you."
	]
]

ShoppingAssistantDialogue = function(state, game, x, y)
{
	this.state = state;
	this.game = game;

	Phaser.Group.call(this, game);

	this.dialogueLimit = 5;
	this.dialogues = [];
	this.interactable = true;
	
	this.x = x;
	this.y = y;
}

ShoppingAssistantDialogue.prototype = Object.create(Phaser.Group.prototype);
ShoppingAssistantDialogue.prototype.constructor = ShoppingAssistantDialogue;

ShoppingAssistantDialogue.prototype.onTweenComplete = function(target, tween)
{
	if(target.index >= this.dialogueLimit - 1) this.remove(target);
}

ShoppingAssistantDialogue.prototype.push = function(text, color)
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

ShoppingAssistantDialogue.prototype.shiftAll = function()
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

ShoppingAssistantDialogue.prototype.show = function(listIndex, index, color)
{
	if(!this.interactable)
	{
		this.showUninteractableDialogue();
		return;
	}

	var fixedListIndex;
	var fixedIndex;

	if(listIndex < 0) fixedListIndex = 0;
	else if(listIndex >= dialogueList.length) fixedListIndex = dialogueList.length - 1;
	else fixedListIndex = listIndex;

	if(fixedIndex < 0) fixedIndex = 0;
	else if(fixedIndex >= dialogueList[fixedListIndex].length)
		fixedIndex = dialogueList[fixedListIndex].length;
	else fixedIndex = index;

	this.push(dialogueList[fixedListIndex][fixedIndex], color);
}

ShoppingAssistantDialogue.prototype.showUninteractableDialogue = function()
{
	/*
	var dialogue = this.push("Leave me alone.");
	dialogue.index = this.dialogueLimit;

	var tween = this.game.add.tween(dialogue).to({ alpha: 0 }, 2000, "Linear");
	tween.onComplete.add(this.onTweenComplete);
	*/
}