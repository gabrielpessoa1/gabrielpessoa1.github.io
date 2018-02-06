/**
 * Created by Gabriel on 21/12/2016.
 */
var Player;

var ProductionUpgrade = function(id, displayID, message, cost, upgrade, unit, resource) {
    this.id = id;
    this.displayID = displayID;
    this.message = message;
    this.cost = new UIDouble(id + '-cost', cost, false);
    this.unit = unit;
    this.resource = resource;
    this.upgrade = upgrade;
    this.bought = false;
    this.unlocked = false;
    this.unitUpgraded = false;
    this.locks = 0;
    this.keys = 0;
    this.keysToGive = [];
    $('#upgrades-bought').append('<span id=' + this.id + '-bought></span>');
    $('#upgrades-notBought').append('<span id=' + this.id + '-notBought></span>');
};

ProductionUpgrade.prototype.keysAndLocks = function(locks, keysWon) {
    this.locks = locks;
    this.keysToGive = keysWon;
};

ProductionUpgrade.prototype.writeBought = function() {
    $('#' + this.id + '-notBought').html('');
    $('#' + this.id + '-bought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Boost ' +
        this.unit.plural + ' production by ' +
        percent(this.upgrade) + '<br></td></tr></table>');
};

ProductionUpgrade.prototype.writeNotBought = function() {
    $('#' + this.id + '-bought').html('');
    $('#' + this.id + '-notBought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Cost in ' +
        this.resource.displayID + ': <span id="' +
        this.id + '-cost"></span> <br> Boost ' +
        this.unit.plural + ' production by ' +
        percent(this.upgrade) + '<br> <button id="' +
        this.id + '-cost-btn" class="btn btn-warning" onClick="player.upgrades.' +
        this.id + '.buy()"> Buy </button> </td></tr></table>'
    );
};

ProductionUpgrade.prototype.refresh = function() {
    if (!this.unlocked) return;
    if(!this.bought) { this.writeNotBought(); return; }
    this.writeBought();
    if (!this.unitUpgraded) {
        this.unit.upgradeProduction(this.upgrade);
        this.unitUpgraded = true;
        for(var i = 0; i < this.keysToGive.length; i++) this.keysToGive[i].giveKey();
    }
};

ProductionUpgrade.prototype.giveKey = function() {
    this.keys++;
    if(this.keys < this.locks) return;
    this.unlocked = true;
    this.refresh();
    this.cost.refresh();
};

ProductionUpgrade.prototype.buy = function() {
    if(this.bought || this.resource < this.cost) return;
    this.resource.add(-1*this.cost);
    this.bought = true;
    this.refresh();
    saveGame();
};

ProductionUpgrade.prototype.refreshButtons = function() {
    if(this.bought) return;
    this.cost.button.set(this.resource >= this.cost);
};

ProductionUpgrade.prototype.load = function(saveData) {
    this.bought = saveData.bought;
};