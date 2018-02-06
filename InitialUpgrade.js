/**
 * Created by Gabriel on 26/12/2016.
 */
var InitialUpgrade = function(id, displayID, message, displayUnlock) {
    this.id = id;
    this.displayID = displayID;
    this.displayUnlock = displayUnlock;
    this.message = message;
    this.bought = false;
    this.unlocked = false;
    this.unitUpgraded = false;
    this.locks = 0;
    this.keys = 0;
    this.keysToGive = [];
    $('#upgrades-bought').append('<span id=' + this.id + '-bought></span>');
    $('#gameStart').append('<span id=' + this.id + '-notBought></span>')
};

InitialUpgrade.prototype.keysAndLocks = function(locks, keysWon) {
    this.locks = locks;
    this.keysToGive = keysWon;
};

InitialUpgrade.prototype.writeBought = function() {
    $('#' + this.id + '-notBought').html('');
    $('#' + this.id + '-bought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Unlock ' +
        this.displayUnlock + '<br></td></tr></table>');
};

InitialUpgrade.prototype.writeNotBought = function() {
    $('#' + this.id + '-bought').html('');
    $('#' + this.id + '-notBought').html('<div class="well"><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Unlock ' +
        this.displayUnlock + '<br> <button id="' +
        this.id + '-cost" class="btn btn-warning" onClick="player.upgrades.' +
        this.id + '.buy()"> Unlock </button> </div>'
    );
};

InitialUpgrade.prototype.refresh = function() {
    if (!this.unlocked) return;
    if(!this.bought) { this.writeNotBought(); return; }
    this.writeBought();
    if (!this.unitUpgraded) {
        this.unitUpgraded = true;
        for(var i = 0; i < this.keysToGive.length; i++) this.keysToGive[i].giveKey();
    }
};

InitialUpgrade.prototype.giveKey = function() {
    this.keys++;
    if(this.keys < this.locks) return;
    this.unlocked = true;
    this.refresh();
};

InitialUpgrade.prototype.buy = function() {
    if(this.bought) return;
    this.bought = true;
    this.refresh();
    saveGame();
};

InitialUpgrade.prototype.load = function(saveData) {
    this.bought = saveData.bought;
};

InitialUpgrade.prototype.refreshButtons = function() {};