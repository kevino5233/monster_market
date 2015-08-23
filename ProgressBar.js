ProgressBar = function(state, game, x, y, w, h, color)
{
	this.state = state;
	this.game = game;
	this.barWidth = w;
	this.barHeight = h;
	this.barColor = color;

	this.progress = 0.0;

	Phaser.Graphics.call(this, game, x, y);

	this.invalidate();
}

ProgressBar.prototype = Object.create(Phaser.Graphics.prototype);
ProgressBar.prototype.constructor = ProgressBar;

ProgressBar.prototype.update = function()
{
	this.invalidate();
}

ProgressBar.prototype.invalidate = function()
{
	if(this.progress < 0) this.progress = 0;
	if(this.progress > 1) this.progress = 1;

	this.clear();

	this.beginFill(this.barColor);
	this.drawRect(0, 0, this.barWidth*this.progress, this.barHeight);
	this.endFill();
}