/**
 * Created by Gabriel on 24/12/2016.
 */
var Player;

var SpeedUpgrade = function(id, displayID, message, cost, upgrade, unit, resource) {
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

SpeedUpgrade.prototype.keysAndLocks = function(locks, keysWon) {
    this.locks = locks;
    this.keysToGive = keysWon;
};

SpeedUpgrade.prototype.writeBoughtArmy = function() {
    $('#' + this.id + '-notBought').html('');
    $('#' + this.id + '-bought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Boost your commander speed by ' +
        percent(this.upgrade) + '<br></td></tr></table>');
};

SpeedUpgrade.prototype.writeNotBoughtArmy = function() {
    $('#' + this.id + '-bought').html('');
    $('#' + this.id + '-notBought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Cost in ' +
        this.resource.displayID + ': <span id="' +
        this.id + '-cost"></span> <br> Boost your commander speed by ' +
        percent(this.upgrade) + '<br> <button id="' +
        this.id + '-cost-btn" class="btn btn-warning" onClick="player.upgrades.' +
        this.id + '.buy()"> Buy </button> </td></tr></table>'
    );
};
SpeedUpgrade.prototype.writeBought = function() {
    $('#' + this.id + '-notBought').html('');
    $('#' + this.id + '-bought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Boost ' +
        this.unit.plural + ' speed by ' +
        percent(this.upgrade) + '<br></td></tr></table>');
};

SpeedUpgrade.prototype.writeNotBought = function() {
    $('#' + this.id + '-bought').html('');
    $('#' + this.id + '-notBought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Cost in ' +
        this.resource.displayID + ': <span id="' +
        this.id + '-cost"></span> <br> Boost ' +
        this.unit.plural + ' speed by ' +
        percent(this.upgrade) + '<br> <button id="' +
        this.id + '-cost-btn" class="btn btn-warning" onClick="player.upgrades.' +
        this.id + '.buy()"> Buy </button> </td></tr></table>'
    );
};

SpeedUpgrade.prototype.refresh = function() {
    if (!this.unlocked) return;
    if(!this.bought) { (this.unit.id === "army") ? this.writeNotBoughtArmy() : this.writeNotBought(); return; }
    this.unit.id === "army" ? this.writeBoughtArmy() : this.writeBought();
    if (!this.unitUpgraded) {
        this.unit.upgradeSpeed(this.upgrade);
        this.unitUpgraded = true;
        for(var i = 0; i < this.keysToGive.length; i++) this.keysToGive[i].giveKey();
    }
};

SpeedUpgrade.prototype.giveKey = function() {
    this.keys++;
    if(this.keys < this.locks) return;
    this.unlocked = true;
    this.refresh();
    this.cost.refresh();
};

SpeedUpgrade.prototype.buy = function() {
    if(this.bought || this.resource < this.cost) return;
    this.resource.add(-1*this.cost);
    this.bought = true;
    this.refresh();
    saveGame();
};

SpeedUpgrade.prototype.refreshButtons = function() {
    if(this.bought) return;
    this.cost.button.set(this.resource >= this.cost);
};

SpeedUpgrade.prototype.load = function(saveData) {
    this.bought = saveData.bought;
};