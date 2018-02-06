/**
 * Created by Gabriel on 17/10/2016.
 */
function autoLoad() {
    if(!localStorage['nethergame_save']) {player.refreshRewards(); return;}
    var saveData = JSON.parse(atob(localStorage['nethergame_save']));
    loadGame(saveData);
}

// Carregar o jogo e calcular ganhos offline
function loadObject(saved, object) {
    var properties = Object.getOwnPropertyNames(saved);
    for(var i = 0; i < properties.length; i++) if(object[properties[i]]) object[properties[i]].load(saved[properties[i]])
}

function loadGame(saveData) {
    if (saveData.resources) loadObject(saveData.resources, player.resources);
    if (saveData.units) loadObject(saveData.units, player.units);
    if (saveData.army) loadObject(saveData.army, player.army);
    if (saveData.upgrades) loadObject(saveData.upgrades, player.upgrades);
    player.notFirstTime = saveData.notFirstTime;
    player.refreshRewards();
    var interval = Date.now() - saveData.lastTime;
    player.lastTime = Date.now();
    player.gameLoop(interval);
}

function saveGame() {
    localStorage['nethergame_save'] = btoa(JSON.stringify(player));
}