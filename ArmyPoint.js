/**
 * Created by Gabriel on 25/12/2016.
 */

var ArmyPoint = function(id, action, baseTime) {
    this.id = id;
    this.action = action;
    this.displayID = '<img src="icons/' + id + '.svg" height="35px" width="35px">';
    this.amount = new UINumber(this.id+"-amount", 0);
    this.amountTotal = new UINumber(this.id+"-amountTotal", 0);
    this.unlocked = false;
    this.completed = false;
    this.baseTime = baseTime;
    this.timeMultiplier = 1;
    this.totalTime = this.baseTime;
    this.totalReward = new UINumber(id + "-totalReward", 0);
    this.totalRewardPerSecond = new UINumber(id + "-totalRewardPerSecond", 0, 'n');
    this.actualTime = 0;
    this.timeLeft = new UINumber(this.id + "-timeLeft", this.totalTime - this.actualTime, 't');
    this.progressBar = new UIBar(this.id + "-progressBar", this.actualTime / this.totalTime);
    this.auto = false;
    this.loading = false;
    this.startButton = new UIButton(this.id + "-button", !this.loading);
    $('#resources').append('<li id=' + this.id + '></li>');
    $('#armyUnits').append('<div id=' + this.id + '-bars></div>');
};

ArmyPoint.prototype.add = function(value) {
    if(this.completed) return;
    this.amount.addNoRefresh(value);
    if(this.amount < this.amountTotal) return;
    this.amount.setNoRefresh(this.amountTotal.valueOf());
    this.completed = true;
};

ArmyPoint.prototype.valueOf = function() {
    return this.amount.valueOf();
};

ArmyPoint.prototype.load = function(saveData) {
    this.amount.set(saveData.amount.value);
    this.buttonSet(saveData.loading);
    this.actualTime = saveData.actualTime;
};

ArmyPoint.prototype.refresh = function() {
    this.amount.refresh();
};

ArmyPoint.prototype.nextConquest = function(value) {
    this.completed = false;
    this.amount.set(0);
    this.amountTotal.set(value);
};

ArmyPoint.prototype.addStrength = function(value) {
    this.totalReward.add(value);
    this.refreshRewards();
};

ArmyPoint.prototype.refreshRewards = function() {
    this.totalRewardPerSecond.set(this.totalReward * 1000 / this.totalTime);
};

ArmyPoint.prototype.upgradeSpeed = function(upgrade) {
    this.timeMultiplier /= upgrade;
    this.totalTime = this.baseTime * this.timeMultiplier;
    this.refreshRewards();
};

ArmyPoint.prototype.progressUpdate = function(time) {
    this.progressBar.set(time/this.totalTime);
    this.timeLeft.set(this.totalTime - time);
};

ArmyPoint.prototype.buttonSet = function(loading) {
    var text;
    if(loading) text = '<span id="'
        + this.id + '-timeLeft"> </span>';
    if(!loading) text = this.action;
    $('#'+this.id+"-button").html(text);
    this.loading = loading;
    this.startButton.set(!loading);
};

ArmyPoint.prototype.gameLoop = function(interval) {
    if (!this.loading) {
        if(!this.auto) {
            this.progressUpdate(this.actualTime);
            return;
        }
        this.buttonSet(this.auto);
    }
    this.actualTime += interval;
    if (this.auto) {
        var resourcesWon = 0;
        var completed = this.actualTime >= this.totalTime;
        while(this.actualTime >= this.totalTime) {
            this.actualTime -= this.totalTime;
            resourcesWon += this.totalReward;
        }
        if (completed) {
            this.add(resourcesWon);
            this.progressUpdate(this.totalTime);
            return
        }
    } else if (this.actualTime >= this.totalTime) {
        this.actualTime = 0;
        this.add(this.totalReward);
        this.buttonSet(false);
        this.progressUpdate(this.totalTime);
        saveGame();
        return
    }
    this.progressUpdate(this.actualTime);
};

ArmyPoint.prototype.click = function() {
    if (!this.loading) this.loading = true;
    this.buttonSet(true);
};

ArmyPoint.prototype.giveKey = function() {
    if (this.unlocked) return;
    $('#' + this.id).html('<a style="padding-left:5em">'
        + this.displayID + '<b><span style="padding-left:1em" id="'
        + this.id + '-amount"> </span> / <span id="'
        + this.id + '-amountTotal"></span></b></a>');
    $('#' + this.id + '-bars').html('<div class="row"><div class="col-sm-4"> <img id="'
        + this.id + '-imageID" src="icons/fight.svg" height="120px" width="120px"></div><div class="col-sm-8"> <b> Army </b> <br> <br> Total '
        + this.displayID + ': <span id="'
        + this.id + '-totalReward"></span> (<span id="'
        + this.id + '-totalRewardPerSecond"></span> / second) </div></div><br><button id="'
        + this.id + '-button" class="btn btn-block btn-success" onClick="player.resources.'
        + this.id + '.click()"> '
        + this.action + '</button><div id="'
        + this.id + '-progress" class="progress"><div id="'
        + this.id + '-progressBar" class="progress-bar progress-bar-striped progress-bar-success" aria-valuemax="10000" style="width: 0"> </div></div>');
    this.unlocked = true;
    this.nextConquest(0);
    this.amount.refresh();
    this.buttonSet(this.loading);
    this.startButton.refresh();
    this.totalRewardPerSecond.refresh();
    this.totalReward.refresh();
};