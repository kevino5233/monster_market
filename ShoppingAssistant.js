ShoppingAssistant = function(state, game, x, y, dialogueList)
{
    this.state = state;
    this.game = game;

    this.interactionRange = 100;
    this.talking = false;

    this.dialogueList = dialogueList;
    this.onDialogueComplete = new Phaser.Signal();
    this.dialogueTime = 0.35;
    this.dialogueTimer = 0;
    this.dialogueLength = dialogueList[0].length;
    this.currentDialogueIndex = 0;
    this.canAdvanceDialogue = false;
    this.currentDialogueListIndex = 0;

    Phaser.Group.call(this, game);
    this.x = x;
    this.y = y;

    this.sprite = new Phaser.Sprite(game, 0, 0, "assistant");
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
    this.add(this.sprite);

    this.dialogueUi = new Dialogue(
        this.state, 
        this.game, 
        0, 
        -this.sprite.height/2, 
        dialogueList);
    this.dialogueUi.visible = false;
    this.add(this.dialogueUi);

    this.enabled = true;

    state.assistant_layer.add(this);
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
	if(this.isWithinInteractionRange() &&
		this.game.input.keyboard.isDown(k_interact))
	{
		if(this.enabled)
		{
			if(this.talking && this.canAdvanceDialogue)
			{
				this.advanceDialogue();
			} else if(!this.talking)
			{
				this.beginDialogue();
			}
		} else {
			this.dialogueTimer = 0;
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
			if(this.currentDialogueIndex < this.dialogueLength - 1)
				this.dialogueUi.show(this.currentDialogueListIndex,
			 		this.currentDialogueIndex, "#000000");
			else
				this.dialogueUi.show(this.currentDialogueListIndex,
			 		this.currentDialogueIndex, "#55ff55");
		}

		this.dialogueTimer = 0;
	}
}

ShoppingAssistant.prototype.endDialogue = function()
{
	this.talking = false;
	this.currentDialogueListIndex++;
	if(this.currentDialogueListIndex >= this.dialogueUi.dialogueList.length)
	{
		this.currentDialogueListIndex = 0;
	}
}
ShoppingAssistant.prototype.reset = function(){
    var dialogueList = this.dialogueList;
    this.dialogueUi.destroy();
    this.dialogueUi = new Dialogue(
        this.state, 
        this.game, 
        0, 
        -this.sprite.height/2, 
        dialogueList);
    this.dialogueLength = dialogueList[0].length;
    this.currentDialogueIndex = 0;
    this.canAdvanceDialogue = false;
    this.currentDialogueListIndex = 0;

    this.dialogueUi.visible = false;
    this.add(this.dialogueUi);

    this.enabled = true;
    this.talking = false;
}
ShoppingAssistant.prototype.loadDialogue = function(dialogueList){
    this.dialogueList = dialogueList;
    this.reset();
}
