WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Press Start 2P']
    }

};


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
//Key bindings
//==============================================================================

var k_interact = Phaser.Keyboard.E;

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
    //adjusts camera accordingly
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

//gets the distance between two sprites or images. 
//Uses the center of objects for a better in-game feel
function DistanceBetween(obj_a, obj_b){
    var a = {
        x: obj_a.x + obj_a.width / 2, 
        y: obj_a.y + obj_a.height / 2
    };
    var b = {
        x: obj_b.x + obj_b.width / 2, 
        y: obj_b.y + obj_b.height / 2
    };
    var diff_x = a.x - b.x;
    var diff_y = a.y - b.y;
    var dist_squared = diff_x * diff_x + diff_y * diff_y;
    return Math.sqrt(dist_squared);
}

function InitializeLayers(state)
{
    state.background = state.game.add.group(),
    state.envir_layer = state.game.add.group(),
    state.money_layer = state.game.add.group(),
    state.player_layer = state.game.add.group(),
    state.m_enemy_layer = state.game.add.group(),
    state.r_enemy_layer = state.game.add.group(),
    state.assistant_layer = state.game.add.group(),
    state.bottle_layer = state.game.add.group(),
    state.UI_layer = state.game.add.group()
}

function InitializeEvents(state)
{
    state.take_bottle_damage = function(player, bottle){
        this.player.TakeDamage(.5);
        this.bottle_layer.remove(bottle, true);
    };

    state.take_bullet_damage = function(player, bullet){
        this.player.TakeDamage(1);
        this.bottle_layer.remove(bullet, true);
    };

    state.take_melee_damage = function(player, enemy){
        this.player.TakeDamage(1);
    };
}

function LoadLevel(state, levelData)
{
    //create ranged enemies
    var r_enemy_data = state.level_data.r_enemies;
    for (var i = 0; i < r_enemy_data.length; i++){
        var r_enemy_dat = r_enemy_data[i];
        var r_enemy_obj = state.r_enemy_layer.add(
            new LotRangeEnemy(state.game, r_enemy_dat.x, r_enemy_dat.y, state));
        if (r_enemy_dat.scale){
            r_enemy_obj.scale = r_enemy_dat.scale;
        }
    }
    //create melee enemies
    var m_enemy_data = state.level_data.m_enemies;
    for (var i = 0; i < m_enemy_data.length; i++){
        var m_enemy_dat = m_enemy_data[i];
        var m_enemy_obj = state.m_enemy_layer.add(
            new LotMeleeEnemy(state.game, m_enemy_dat.x, m_enemy_dat.y, state));
        if (m_enemy_dat.scale){
            m_enemy_obj.scale = m_enemy_dat.scale;
        }
    }
    //create environment
    var envir_data = state.level_data.environment;
    for (var i = 0; i < envir_data.length; i++){
        var envir_dat = envir_data[i];
        var envir_obj = state.envir_layer.create(
            envir_dat.x, 
            envir_dat.y, 
            envir_dat.key);

        state.game.physics.enable(envir_obj);
        if(envir_dat.key === "car_1" || envir_dat.key === "car_3")
        {
            envir_obj.body.setSize(187, 87, 2, 5);
        } else if(envir_dat.key === "car_2")
        {
            envir_obj.body.setSize(82, 180, 6, 6);
        }

        envir_obj.body.immovable = true;
        if (envir_dat.scale){
            envir_obj.scale = envir_dat.scale;
        }
    }

    if(state.level_data.assistants != null)
    {
        for(var i = 0; i < state.level_data.assistants.length; i++)
        {
            var assistant_dat = state.level_data.assistants[i];

            var assistant_obj  = new ShoppingAssistant(
                state, 
                game, 
                assistant_dat.x, 
                assistant_dat.y, 
                state.dialogueList);
            assistant_obj.onDialogueComplete.add(state.onDialogueComplete, state);
            if (assistant_dat.scale){
                state.shoppingAssistant.scale = assistant_dat.scale;
            }
        }
    }
	var padding = 10;
	var obj_text = new Phaser.Text(game, 64, game_h - 64, state.objective);
	obj_text.text.font = 'Press Start 2P';
	obj_text.text.align = "right";
	obj_text.text.fontSize = 16;
	var obj_bg = new Phaser.Graphics(game, 0, 0);
	obj_bg.beginFill(0xffffff);
	obj_bg.drawRect(	obj_text.x - padding - 10,
					 	obj_text.y - padding,
						obj_text.width + padding*2 + 20,
						obj_text.height + padding*2);
	obj_bg.alpha = 0.5;
	state.UI_layer.add(obj_text);
	state.UI_layer.add(obj_bg);
}
//==============================================================================
//game start
//==============================================================================

//create the game object
var game = new Phaser.Game(800, 600, Phaser.AUTO);

game.state.add("boot", boot_state);
game.state.add("load", load_state);
game.state.add("lot", lot_state);
game.state.add("shop", shop_state);
game.state.add("cashier", cashier_state);

game.state.start("boot");
