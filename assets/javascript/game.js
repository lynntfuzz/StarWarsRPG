$(document).ready(function() {

    function game_character (name, health_points, attack_power, counter_attack_power) {
        this.name = name;
        this.health_points = health_points;
        this.attack_power = attack_power;
        this.counter_attack_power = counter_attack_power;
        this.defending = false; // whether or not the character is in the defending area not sure if I need this
    }

    var obi = new game_character("Obi-Wan Kenobi", 120, 8, 10);
    var luke  = new game_character("Luke Skywalker", 180, 6, 5);
    var darth_sid = new game_character("Darth Sidious", 150, 8, 20);
    var darth_maul = new game_character("Darth Maul", 180, 9, 25);

    var all_players = [obi, luke, darth_sid, darth_maul];

    function attack(character1, character2) {

    }
   
    function setDefender(name) {
        console.log("Setting defender = " + name);
        defending_character = lookUpPlayer(name);

    }
    
    var current_character = null;
    var defending_character = null;
    
    var player_panel = $(".player_panel");
    var row = $("<div>");
    row.addClass("row");
    row.addClass("player_row");
   
    player_panel.append(row);

    all_players.forEach(function(player) {
        var div = $("<div class=\"col-xs-3\">");  
        div.text(player.name);
        div.addClass("player_card " + player.name.replace(/\s/g, ""));
        div.attr("value", player.name);
        div.append("<img src=\"assets\\images\\" + player.name.replace(/\s/g, "") + ".png\"" + " height=\"96px\" width=\"96px\">");
        div.append("<p id=" + "HP" + player.name.replace(/\s/g, "") + ">" + player.health_points + "</p>");
        row.append(div);
        
        div.click( function(event) {
            current_character = lookUpPlayer(player.name);
            var cc_div = $("." + player.name.replace(/\s/g, ""));
            cc_div.addClass("player"); // mark the chosen player with class "player"
        
            var enemy_panel = $(".enemy_panel");
            var row = $("<div>");
            row.addClass("row enemy_row");
            enemy_panel.append(row);

            $('.player_card:not(.player)').addClass("enemy"); // add class "enemy" to all non-players

            var enemies = $('.enemy');
            enemies.remove();
            enemies.each(function() {
                console.log($(this).attr("value"));
                enemy_panel.append($(this));
                $(this).click( function(event) {
                    var selected = $(this).attr("value")
                    console.log("*************Defender selected = " + selected);
                    setDefender(selected);
                    var querystring = ".player_card." + selected.replace(/\s/g, "");
                    console.log("looking up " + querystring)
                    var defender = $(querystring).remove();
                    defender.removeClass("enemy");
                    defender.addClass("defender");
                    $(".defender_panel").append(defender);

                });
            })
            $('.player').off();         
        });
        
    });
    
    
    $("#attack_button").click(function(evt) {
        console.log(current_character.name + " attacks " + defending_character.name);
        logPlayer(current_character);
        logPlayer(defending_character);
        current_character.attack_power += current_character.attack_power;
        current_character.health_points -= defending_character.counter_attack_power;
        console.log("after fight " + current_character.name + " has " + current_character.health_points); 
        defending_character.health_points = defending_character.health_points - current_character.attack_power;  
        console.log("after fight " + defending_character.name + " has " + defending_character.health_points); 
        var cpid = "#HP" + current_character.name.replace(/\s/g, "");
        var dpid = "#HP" + defending_character.name.replace(/\s/g, "");
        $(cpid).text(current_character.health_points);
        $(dpid).text(defending_character.health_points);
        logPlayer(current_character);
        logPlayer(defending_character);
        if(current_character.health_points<=0) {
            console.log(current_character.name + "is dead, you lose");
        }
        if (defending_character.health_points <= 0) {
            console.log(defending_character.name + " is dead.");
            var query = "." + defending_character.name.replace(/\s/g, "");
            $(query).remove();
            defending_character = null;
        }
    });

    
    function lookUpPlayer(name) {
        console.log("looking up name " + name);
        for (var i = 0; i < all_players.length;i++) {
            console.log("is it " + all_players[i].name + "?");
            if (all_players[i].name === name) {
                return all_players[i];
            }
        }
        return null;
    };

    function logPlayer(player) {
        console.log(JSON.stringify(player));
    }

    
});