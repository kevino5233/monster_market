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

	Phaser.Group.call(this, game);
	this.content = new Phaser.Text(game, x, y, "dialogue");
	this.content.anchor.x = this.content.anchor.y = 0.5;
	this.content.font = "Press Start 2P";
	this.content.fontSize = 12;
	this.add(this.content);

	
	this.x = x;
	this.y = y;
}

ShoppingAssistantDialogue.prototype = Object.create(Phaser.Group.prototype);
ShoppingAssistantDialogue.prototype.constructor = ShoppingAssistantDialogue;

ShoppingAssistantDialogue.prototype.show = function(listIndex, index)
{
	var fixedListIndex;
	var fixedIndex;

	if(listIndex < 0) fixedListIndex = 0;
	else if(listIndex >= dialogueList.length) fixedListIndex = dialogueList.length - 1;
	else fixedListIndex = listIndex;

	if(fixedIndex < 0) fixedIndex = 0;
	else if(fixedIndex >= dialogueList[fixedListIndex].length)
		fixedIndex = dialogueList[fixedListIndex].length;
	else fixedIndex = index;

	this.content.text = dialogueList[fixedListIndex][fixedIndex];
}