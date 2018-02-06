/**
 * Created by Gabriel on 26/10/2016.
 */
var ManagerUpgrade = function(id, displayID, message, cost, unit, resource) {
    this.id = id;
    this.displayID = displayID;
    this.message = message;
    this.cost = new UIDouble(id + '-cost', cost, false);
    this.unit = unit;
    this.resource = resource;
    this.bought = false;
    this.unlocked = false;
    this.unitUpgraded = false;
    this.locks = 0;
    this.keys = 0;
    this.keysToGive = [];
    $('#upgrades-bought').append('<span id=' + this.id + '-bought></span>');
    $('#upgrades-notBought').append('<span id=' + this.id + '-notBought></span>');
};

ManagerUpgrade.prototype.keysAndLocks = function(locks, keysWon) {
    this.locks = locks;
    this.keysToGive = keysWon;
};

ManagerUpgrade.prototype.writeBoughtArmy = function() {
    $('#' + this.id + '-notBought').html('');
    $('#' + this.id + '-bought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Command your army for you <br></td></tr></table>');
};

ManagerUpgrade.prototype.writeNotBoughtArmy = function() {
    $('#' + this.id + '-bought').html('');
    $('#' + this.id + '-notBought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Cost in ' +
        this.resource.displayID + ': <span id="' +
        this.id + '-cost"></span> <br> Command your army for you <br> <button id="' +
        this.id + '-cost-btn" class="btn btn-warning" onClick="player.upgrades.' +
        this.id + '.buy()"> Buy </button> </td></tr></table>');
};

ManagerUpgrade.prototype.writeBought = function() {
    $('#' + this.id + '-notBought').html('');
    $('#' + this.id + '-bought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Run the ' +
        this.unit.plural + ' for you <br></td></tr></table>');
};

ManagerUpgrade.prototype.writeNotBought = function() {
    $('#' + this.id + '-bought').html('');
    $('#' + this.id + '-notBought').html('<table class="table"><tr><td><b>' +
        this.displayID + ':</b> <br> <i>' +
        this.message + '</i> <br> Cost in ' +
        this.resource.displayID + ': <span id="' +
        this.id + '-cost"></span> <br> Run the ' +
        this.unit.plural + ' for you <br> <button id="' +
        this.id + '-cost-btn" class="btn btn-warning" onClick="player.upgrades.' +
        this.id + '.buy()"> Buy </button> </td></tr></table>');
};

ManagerUpgrade.prototype.refresh = function() {
    if (!this.unlocked) return;
    if(!this.bought) { (this.unit.id === "army") ? this.writeNotBoughtArmy() : this.writeNotBought(); return; }
    this.unit.id === "army" ? this.writeBoughtArmy() : this.writeBought();
    if (!this.unitUpgraded) {
        this.unit.auto = true;
        this.unitUpgraded = true;
        for(var i = 0; i < this.keysToGive.length; i++) this.keysToGive[i].giveKey();
    }
};

ManagerUpgrade.prototype.giveKey = function() {
    this.keys++;
    if(this.keys < this.locks) return;
    this.unlocked = true;
    this.refresh();
    this.cost.refresh();
};

ManagerUpgrade.prototype.buy = function() {
    if(this.bought || this.resource < this.cost) return;
    this.resource.add(-1*this.cost);
    this.bought = true;
    this.refresh();
    saveGame();
};

ManagerUpgrade.prototype.refreshButtons = function() {
    if(this.bought) return;
    this.cost.button.set(this.resource >= this.cost);
};

ManagerUpgrade.prototype.load = function(saveData) {
    this.bought = saveData.bought;
};