/**
 * Created by Gabriel on 28/12/2016.
 */
var Player;

var ArmyUpgrade = function(id, displayID, message, newID, newName, newPlural, newAction, cost, productionUpgrade, unit, resource) {
    this.id = id;
    this.displayID = displayID;
    this.message = message;
    this.newID = newID;
    this.newName = newName;
    this.newPlural = newPlural;
    this.newAction = newAction;
    this.cost = new UIDouble(id + '-cost', cost, false);
    this.unit = unit;
    this.resource = resource;
    this.productionUpgrade = productionUpgrade;
    this.bought = false;
    this.unlocked = false;
    this.unitUpgraded = false;
    this.locks = 0;
    this.keys = 0;
    this.keysToGive = [];
    $('#upgrades-bought').append('<span id=' + this.id + '-bought></span>');
    $('#upgrades-notBought').append('<span id=' + this.id + '-notBought></span>');
};

ArmyUpgrade.prototype.keysAndLocks = function(locks, keysWon) {
    this.locks = locks;
    this.keysToGive = keysWon;
};

ArmyUpgrade.prototype.writeBought = function() {
    $('#' + this.id + '-notBought').html('');
    $('#' + this.id + '-bought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Upgrade your ' +
        this.unit.plural + ' to ' +
        this.newPlural + ' (Strength: ' +
        percent(this.productionUpgrade, true) + ')<br></td></tr></table>');
};

ArmyUpgrade.prototype.writeNotBought = function() {
    $('#' + this.id + '-bought').html('');
    $('#' + this.id + '-notBought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Cost in ' +
        this.resource.displayID + ': <span id="' +
        this.id + '-cost"></span> <br> Upgrade your ' +
        this.unit.plural + ' to ' +
        this.newPlural + ' (Strength: ' +
        percent(this.productionUpgrade, true) + ')<br> <button id="' +
        this.id + '-cost-btn" class="btn btn-warning" onClick="player.upgrades.' +
        this.id + '.buy()"> Buy </button> </td></tr></table>'
    );
};

ArmyUpgrade.prototype.refresh = function() {
    if (!this.unlocked) return;
    if(!this.bought) { this.writeNotBought(); return; }
    this.writeBought();
    if (!this.unitUpgraded) {
        this.unit.upgradeProduction(this.productionUpgrade);
        this.unit.newName(this.newID, this.newName, this.newPlural, this.newAction);
        this.unit.auto = false;
        this.unitUpgraded = true;
        for(var i = 0; i < this.keysToGive.length; i++) this.keysToGive[i].giveKey();
    }
};

ArmyUpgrade.prototype.giveKey = function() {
    this.keys++;
    if(this.keys < this.locks) return;
    this.unlocked = true;
    this.refresh();
    this.cost.refresh();
};

ArmyUpgrade.prototype.buy = function() {
    if(this.bought || this.resource < this.cost) return;
    this.resource.add(-1*this.cost);
    this.bought = true;
    this.refresh();
    saveGame();
};

ArmyUpgrade.prototype.refreshButtons = function() {
    if(this.bought) return;
    this.cost.button.set(this.resource >= this.cost);
};

ArmyUpgrade.prototype.load = function(saveData) {
    this.bought = saveData.bought;
};