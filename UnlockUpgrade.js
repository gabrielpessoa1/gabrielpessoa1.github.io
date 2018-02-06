/**
 * Created by Gabriel on 25/12/2016.
 */
var UnlockUpgrade = function(id, displayID, message, cost, displayUnlock, resource) {
    this.id = id;
    this.displayID = displayID;
    this.message = message;
    this.cost = new UIDouble(id + '-cost', cost, false);
    this.displayUnlock = displayUnlock;
    this.resource = resource;
    this.bought = false;
    this.unlocked = false;
    this.unitUpgraded = false;
    this.locks = 0;
    this.keys = 0;
    this.keysToGive = [];
    $('#upgrades-bought').append('<span id=' + this.id + '-bought></span>');
    $('#upgrades-notBought').append('<span id=' + this.id + '-notBought></span>')
};

UnlockUpgrade.prototype.keysAndLocks = function(locks, keysWon) {
    this.locks = locks;
    this.keysToGive = keysWon;
};

UnlockUpgrade.prototype.writeBought = function() {
    $('#' + this.id + '-notBought').html('');
    $('#' + this.id + '-bought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Unlock ' +
        this.displayUnlock + '<br></td></tr></table>');
};

UnlockUpgrade.prototype.writeNotBought = function() {
    $('#' + this.id + '-bought').html('');
    $('#' + this.id + '-notBought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Cost in ' +
        this.resource.displayID + ': <span id="' +
        this.id + '-cost"></span> <br> Unlock ' +
        this.displayUnlock + '<br> <button id="' +
        this.id + '-cost-btn" class="btn btn-warning" onClick="player.upgrades.' +
        this.id + '.buy()"> Buy </button></td></tr></table>'
    );
};

UnlockUpgrade.prototype.refresh = function() {
    if (!this.unlocked) return;
    if(!this.bought) { this.writeNotBought(); return; }
    this.writeBought();
    if (!this.unitUpgraded) {
        this.unitUpgraded = true;
        for(var i = 0; i < this.keysToGive.length; i++) this.keysToGive[i].giveKey();
    }
};

UnlockUpgrade.prototype.giveKey = function() {
    this.keys++;
    if(this.keys < this.locks) return;
    this.unlocked = true;
    this.refresh();
    this.cost.refresh();
};

UnlockUpgrade.prototype.buy = function() {
    if(this.bought || this.resource < this.cost) return;
    this.resource.add(-1*this.cost);
    this.bought = true;
    this.refresh();
    saveGame();
};

UnlockUpgrade.prototype.refreshButtons = function() {
    if(this.bought) return;
    this.cost.button.set(this.resource >= this.cost);
};

UnlockUpgrade.prototype.load = function(saveData) {
    this.bought = saveData.bought;
};