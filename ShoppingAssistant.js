ShoppingAssistant = function(state, game, x, y)
{
	this.state = state;
	this.game = game;

	this.interactionRange = 100;
	this.talking = false;

	this.onDialogueComplete = new Phaser.Signal();
	this.dialogueTime = 0.5;
	this.dialogueTimer = 0;
	this.dialogueLength = 10;
	this.currentDialogueIndex = 0;
	this.canAdvanceDialogue = false;
	this.currentDialogueListIndex = 0;

	Phaser.Group.call(this, game);
	this.x = x;
	this.y = y;

	this.sprite = new Phaser.Sprite(game, 0, 0, "assistant");
	this.add(this.sprite);

	this.dialogueUi = new ShoppingAssistantDialogue(this.state, this.game, 0, 0);
	this.dialogueUi.visible = false;
	this.add(this.dialogueUi);

	this.enabled = true;
}

ShoppingAssistant.prototype = Object.create(Phaser.Group.prototype);
ShoppingAssistant.prototype.constructor = ShoppingAssistant;

ShoppingAssistant.prototype.update = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}

	if(this.talking)
	{
		this.dialogueTimer += this.game.time.elapsedMS / 1000;

		if(this.dialogueTimer > this.dialogueTime)
		{
			this.dialogueTimer = this.dialogueTime;
			this.canAdvanceDialogue = true;
		} else {
			this.canAdvanceDialogue = false;
		}
	}

	this.checkInteraction();
}

ShoppingAssistant.prototype.checkInteraction = function()
{
	if(this.enabled && this.isWithinInteractionRange() &&
		this.game.input.keyboard.isDown(k_interact))
	{
		if(this.talking && this.canAdvanceDialogue)
		{
			this.advanceDialogue();
		} else if(!this.talking)
		{
			this.beginDialogue();
		}
	}
}

ShoppingAssistant.prototype.isWithinInteractionRange = function()
{
	return (Math.sqrt(Math.pow(this.state.player.x - this.x, 2) + 
						Math.pow(this.state.player.y - this.y, 2))
		<= this.interactionRange);
}

ShoppingAssistant.prototype.beginDialogue = function()
{
	this.talking = true;
	this.currentDialogueIndex = 0;
	this.dialogueUi.visible = true;
	this.dialogueUi.show(this.currentDialogueListIndex, this.currentDialogueIndex);
}

ShoppingAssistant.prototype.advanceDialogue = function()
{
	if(this.talking)
	{
		this.currentDialogueIndex++;

		if(this.currentDialogueIndex >= this.dialogueLength)
		{
			this.currentDialogueIndex = this.dialogueLength - 1;
			this.onDialogueComplete.dispatch(this);
		} else {
			this.dialogueUi.show(this.currentDialogueListIndex,
			 this.currentDialogueIndex);
		}

		this.dialogueTimer = 0;
	}
}

ShoppingAssistant.prototype.endDialogue = function()
{
	this.talking = false;
	this.currentDialogueListIndex++;
	if(this.currentDialogueListIndex >= dialogueList.length)
	{
		this.currentDialogueListIndex = 0;
	}

	this.dialogueUi.visible = false;
}