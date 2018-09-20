$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({
        container : 'body'
    })

    function game_character (name, health_points, attack_power, counter_attack_power) {
        this.name = name;
        this.health_points = health_points;
        this.attack_power = attack_power;
        this.base_attack_power = attack_power;
        this.counter_attack_power = counter_attack_power;
        this.defending = false; // whether or not the character is in the defending area not sure if I need this
    
        this.toString = function() {
            return "Health Points: " + this.health_points + " Attack Power: "+ this.base_attack_power+ " Counter Attack Power: " + this.counter_attack_power;
        };
    }

    var obi = new game_character("Obi-Wan Kenobi", 120, 8, 10);
    var luke  = new game_character("Luke Skywalker", 180, 6, 5);
    var darth_sid = new game_character("Darth Sidious", 150, 8, 20);
    var darth_maul = new game_character("Darth Maul", 180, 9, 25);

    var all_players = [obi, luke, darth_sid, darth_maul];
    
    const SCENE1 = "Scene 1"; // Chosing the player to play
    const SCENE2 = "Scene 2"; // Chosing the Defender
    const SCENE3 = "Scene 3"; // Fighting
    const SCENE4 = "Game Over";

    var current_scene = SCENE1;
    var current_character = null;
    var defending_character = null;
    
    var player_panel = $(".player_panel");

    all_players.forEach(function(player) {
       
        // Create the List of Players to Choose
        var div = $("<div>");  
        div.addClass("player_card col-xs-3  " + player.name.replace(/\s/g, ""));
        div.attr("id", player.name.replace(/\s/g, ""));
        div.text(player.name);
        div.attr("data-toggle","tooltip"); 
        div.attr("data-placement","bottom");
        div.attr("title", player.toString())
        div.attr("data-html", true);
        div.append("<img src=\"assets\\images\\" + player.name.replace(/\s/g, "") + ".png\"" + " height=\"96px\" width=\"96px\">");
        div.append("<p id=" + "HP" + player.name.replace(/\s/g, "") + ">" + player.health_points + "</p>");
        $("#player_row").append(div);
        
        // Select the Current Player
        div.click( function(event) {
            console.log("DIV CLICK");
            current_character = lookUpPlayer(player.name);
            var cc_div = $("." + player.name.replace(/\s/g, ""));
            cc_div.addClass("player"); // mark the chosen player with class "player"
            //logResults("You selected player " + player.name);
            setCurrentScene(SCENE2);

            // Mark the remaining players as enemy, move them all and add new listener
            $('.player_card:not(.player)').addClass("enemy"); // add class "enemy" to all non-players
            var enemies = $('.enemy');
            enemies.remove();
            enemies.each(function() {
                console.log(this);
                $("#enemy_row").append(this);

                // If an enemy is clicked, it becomes a defender
                $(this).click( function(event) {
                    console.log("CLICK ******* " + current_scene);
                    if (current_scene === SCENE2) {
                        var selected = $(this).attr("id");
                        setDefender(selected);
                        $('#selectenemy').text("");
                        var querystring = ".player_card." + selected.replace(/\s/g, "");
                        var defender = $(querystring).remove();
                        defender.removeClass("enemy");
                        defender.removeClass("col-xs-3");
                        defender.addClass("defender");
                        $("#defender_row").append(defender);
                        setCurrentScene(SCENE3);
                    }

                });
            })
            $('.player').off();         
        });
        
    });
    
    
    $(".attack_button").click(function(evt) {
        console.log("attack button pressed");
        logResults("You attack " + defending_character.name + " for " + current_character.attack_power + " points damage");
        current_character.attack_power += current_character.base_attack_power;
        current_character.health_points -= defending_character.counter_attack_power;
        logResults(defending_character.name + " attacks you back for " + defending_character.counter_attack_power + " points");
        defending_character.health_points -=  current_character.attack_power;  
        var cpid = "#HP" + current_character.name.replace(/\s/g, "");
        var dpid = "#HP" + defending_character.name.replace(/\s/g, "");
        $(cpid).text(current_character.health_points);
        $(dpid).text(defending_character.health_points);

        if(current_character.health_points<=0) {
            console.log("You are dead, you lose");
            logResults("YOU ARE DEAD!!!!! GAME OVER!!!")
            setCurrentScene(SCENE4);
        }

        if (defending_character.health_points <= 0) {
            console.log(defending_character.name + " is dead.");
            logResults(defending_character.name + " is dead.");
            var query = "." + defending_character.name.replace(/\s/g, "");
            $(query).remove();
            defending_character = null;
            if ($(".enemy").length > 0) {
                console.log("still " + $(".enemy").length + " enemies.");
                logResults("There are still enemies to fight. Select one");
                setCurrentScene(SCENE2);
            } else {
                logResults("YOU WON!!!")
                setCurrentScene(SCENE4);
            }
        }
    });
     
    $(".reset_button").click(function(evt) {
        console.log("reset");
        document.location.reload(true);
    });


    function setDefender(name) {
        //console.log("setDefender(" + name + ")");
        if (name == null) {
            defending_character = null;
            setCurrentScene(SCENE2);
            $(".attack_button").addClass("disabled");
        } else {
            defending_character = lookUpPlayer(name);
            //logResults("Defending Character is " + defending_character.name);
            setCurrentScene(SCENE3);
            $(".attack_button").removeClass("disabled");
        }
        
    }
    
    function lookUpPlayer(name) {
        console.log("looking up name " + name);
        for (var i = 0; i < all_players.length;i++) {
            console.log("is it " + all_players[i].name + "?");
            if (all_players[i].name === name || all_players[i].name.replace(/\s/g, "") === name) {
                console.log("Found player " + all_players[i]);
                return all_players[i];
            }
        }
        console.log("did not find a character with name " + name);
        return null;
    };

    function logPlayer(player) {
        console.log(JSON.stringify(player));
    }

    function setCurrentScene(scene) {
        current_scene = scene;
        console.log("Setting Current Scene to " + scene);
       

        if (scene === SCENE1) {
            $('#selectchar').text("(Select One)");
            $('#selectenemy').text("");
            //$('#selectattack').text("");
        }
        
        if (scene === SCENE2) {
            $('#selectchar').text("");
            $('#selectenemy').text("(Select One)");
            //$('#selectattack').text("");
        }

        if (scene === SCENE3) {
            $('#selectchar').text("");
            $('#selectenemy').text("");
            //$('#selectattack').text("<=== Click Button to Attack");
        }

        $("#scene").text(scene);
        if (scene === SCENE4) {
            $(".attack_button").addClass("disabled");
        }
    }

    function logResults(results, color) {
        console.log("log results " + results + " color? " + color);
        var result_div = $(".results");
        console.log(result_div);
        if (color === "red") {
            result_div.append($("<h5 id=\"results_label\" color=\"red\">" + results + "</h5>"));
        } else result_div.append($("<h5 id=\"results_label\">" + results + "</h5>"));
    }

    
});