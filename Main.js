/**
 * Created by Gabriel on 17/10/2016.
 */
// Cria o player. carrega um save antigo e inicia o jogo

var player = new Player();
player.keysAndLocks();
autoLoad();
player.upgrades.hunterUnlock.giveKey();

setInterval(function () {
    var interval = Date.now() - player.lastTime;
    player.lastTime = Date.now();
    player.gameLoop(interval);
}, 1);

window.onbeforeunload = function() {
    saveGame();
};