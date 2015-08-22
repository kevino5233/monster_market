//vital dimensions

var game_w = 800;
var game_h = 600;
var deadzone_w = 200;
var deadzone_h = 150;
var deadzone_trig_w = (game_w - deadzone_w) / 2;
var deadzone_trig_h = (game_h - deadzone_h) / 2;

//utility functions

//checks if the camera position needs to be updated from the deadzone
function UpdateCamera(camera, player) {
    var cam_diff_x = player.x - camera.x;
    var cam_diff_y = player.y - camera.y;
    if (cam_diff_x < deadzone_trig_w ||
	cam_diff_x - deadzone_w > deadzone_trig_w){
	camera.x = player.x;
    }
    if (cam_diff_y < deadzone_trig_h ||
	cam_diff_y - deadzone_h > deadzone_trig_h){
	camera.y = player.y;
    }
}

//create the game object
var game = new Phaser.Game(800, 600, Phaser.AUTO);

game.state.add("boot", boot_state);
game.state.add("load", load_state);
game.state.add("lot", lot_state);

game.state.start("boot");
