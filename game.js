//==============================================================================
//vital dimensions
//==============================================================================

var game_w = 800;
var game_h = 600;
var deadzone_w = 200;
var deadzone_h = 150;
var deadzone_trig_w = (game_w - deadzone_w) / 2;
var deadzone_trig_h = (game_h - deadzone_h) / 2;

//==============================================================================
//utility functions
//==============================================================================

//checks if the camera position needs to be updated from the deadzone
function UpdateCamera(camera, player) {
    //get camera distance from player
    var cam_diff_x = player.x - camera.x;
    var cam_diff_y = player.y - camera.y;
    //determine whether player is outside deadzone
    var outside_deadzone_left = cam_diff_x < deadzone_trig_w;
    var outside_deadzone_right = cam_diff_x - deadzone_w > deadzone_trig_w;
    var outside_deadzone_up = cam_diff_y < deadzone_trig_h;
    var outside_deadzone_down = cam_diff_y - deadzone_h > deadzone_trig_h;
    //adjusts camer accordingly
    if (outside_deadzone_left || outside_deadzone_right){
	camera.x = player.x - deadzone_trig_w;
	if (outside_deadzone_right){
	    camera.x -= deadzone_w;
	}
    }
    if (outside_deadzone_up || outside_deadzone_down){
	camera.y = player.y - deadzone_trig_h;
	if (outside_deadzone_up){
	    camera.y -= deadzone_h;
	}
    }
}

//gets the distance between two sprites or images
function DistanceBetween(obj_a, obj_b){
    var diff_x = obj_a.x - obj_b.x;
    var diff_y = obj_a.y - obj_b.y;
    var dist_squared = diff_x * diff_x + diff_y * diff_y;
    return Math.sqrt(dist_squared);
}

//==============================================================================
//game start
//==============================================================================

//create the game object
var game = new Phaser.Game(800, 600, Phaser.AUTO);

game.state.add("boot", boot_state);
game.state.add("load", load_state);
game.state.add("lot", lot_state);

game.state.start("boot");
