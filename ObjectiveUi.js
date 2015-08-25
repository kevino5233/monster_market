
ObjectiveUi = function(state, game, text)
{
	this.state = state;
	this.game = game;

	this.objective = "";

	var padding = 10;

	Phaser.Group.call(this, game);

	this.text = new Phaser.Text(game, 0, 0, text);
	this.text.anchor.x = 0.5;
	this.text.anchor.y = 1;
	this.text.x = game_w / 2;
	this.text.y = game_h - padding;
	this.text.font = 'Press Start 2P';
	this.text.align = "center";
	this.text.fontSize = 16;

	this.bg = new Phaser.Graphics(game, 0, 0);
	this.bg.beginFill(0xffffff);
	this.bg.drawRect(	0,
						this.text.y - this.text.height - padding,
						game_w,
						this.text.height + padding*2);
	this.bg.alpha = 0.5;

	this.add(this.bg);
	this.add(this.text);
}

ObjectiveUi.prototype = Object.create(Phaser.Group.prototype);
ObjectiveUi.prototype.constructor = ObjectiveUi;

ObjectiveUi.prototype.setObjective = function(text)
{
	this.objective = text;
	this.invalidate();
}

ObjectiveUi.prototype.invalidate = function()
{
	this.text.text = this.objective;
}