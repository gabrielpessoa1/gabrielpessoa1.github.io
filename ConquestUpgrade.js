/**
 * Created by Gabriel on 25/12/2016.
 */
var ConquestUpgrade = function(id, displayID, message, cost, displayUnlock, resource) {
    this.id = id;
    this.displayID = displayID;
    this.message = message;
    this.resource = resource;
    this.currentArmy = new UINumber(id + '-currentArmy', this.resource.valueOf());
    this.cost = new UIDouble(id + '-cost', cost, false);
    this.displayUnlock = displayUnlock;
    this.bought = false;
    this.unlocked = false;
    this.unitUpgraded = false;
    this.locks = 0;
    this.keys = 0;
    this.keysToGive = [];
    $('#conquests-bought').append('<span id=' + this.id + '-bought></span>');
    $('#conquests-notBought').append('<span id=' + this.id + '-notBought></span>');
};

ConquestUpgrade.prototype.keysAndLocks = function(locks, keysWon) {
    this.locks = locks;
    this.keysToGive = keysWon;
};

ConquestUpgrade.prototype.writeBought = function() {
    $('#' + this.id + '-notBought').html('');
    $('#' + this.id + '-bought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Unlock ' +
        this.displayUnlock + '<br></td></tr></table>');
};

ConquestUpgrade.prototype.writeNotBought = function() {
    $('#' + this.id + '-bought').html('');
    $('#' + this.id + '-notBought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> <span id="' +
        this.id + '-currentArmy"></span> / <span id="' +
        this.id + '-cost"></span> <br> Unlock ' +
        this.displayUnlock + '<br> <button id="' +
        this.id + '-cost-btn" class="btn btn-warning" onClick="player.upgrades.' +
        this.id + '.buy()"> Buy </button> </td></tr></table>'
    );
};

ConquestUpgrade.prototype.refresh = function() {
    if (!this.unlocked) return;
    if(!this.bought) { this.writeNotBought(); return; }
    this.writeBought();
    if (!this.unitUpgraded) {
        this.unitUpgraded = true;
        this.resource.nextConquest(0);
        for(var i = 0; i < this.keysToGive.length; i++) this.keysToGive[i].giveKey();
    }
};

ConquestUpgrade.prototype.giveKey = function() {
    this.keys++;
    if(this.keys < this.locks) return;
    this.unlocked = true;
    this.resource.nextConquest(this.cost.valueOf());
    this.refresh();
    this.cost.refresh();
};

ConquestUpgrade.prototype.buy = function() {
    if(this.bought || this.resource < this.cost) return;
    this.resource.add(-1*this.cost);
    this.bought = true;
    this.refresh();
    saveGame();
};

ConquestUpgrade.prototype.refreshButtons = function() {
    if(this.bought) return;
    this.currentArmy.set(this.resource.valueOf());
    this.cost.button.set(this.resource >= this.cost);
};

ConquestUpgrade.prototype.load = function(saveData) {
    this.bought = saveData.bought;
};