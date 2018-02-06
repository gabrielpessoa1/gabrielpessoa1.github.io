/**
 * Created by Gabriel on 16/10/2016.
 */
var Player;

var Unit = function(id, displayID, plural, action, baseCost, costGrowth, baseReward, baseTime, resource, currency) {
    this.id = id;
    this.displayID = displayID;
    this.plural = plural;
    this.action = action;
    this.baseCost = baseCost;
    this.costGrowth = costGrowth;
    this.amount = new UINumber(id + "-amount", 1);
    this.resource = resource; // Recurso coletado pela unidade
    this.currency = currency; // Recurso utilizado para compra da unidade
    this.baseReward = baseReward;
    this.upgradeBonus = 1;
    this.baseTime = baseTime;
    this.timeMultiplier = 1;
    this.totalTime = this.baseTime * this.timeMultiplier;
    this.reward = new UINumber(id + "-reward", this.baseReward * this.upgradeBonus);
    this.totalReward = new UINumber(id + "-totalReward", this.reward * this.amount);
    this.rewardPerSecond = new UINumber(id + "-rewardPerSecond", this.reward * 1000 / this.totalTime, 'n');
    this.totalRewardPerSecond = new UINumber(id + "-totalRewardPerSecond", this.rewardPerSecond * this.amount, 'n');
    this.actualTime = 0;
    this.timeLeft = new UINumber(this.id + "-timeLeft", this.totalTime - this.actualTime, 't');
    this.progressBar = new UIBar(this.id + "-progressBar", this.actualTime / this.totalTime);
    this.auto = false;
    this.loading = false;
    this.startButton = new UIButton(this.id + "-button", !this.loading);
    this.costs = {
        cost: new UIDouble(id + "-cost", baseCost, false),
        cost10: new UIDouble(id + "-cost10", this.calculateCost(10), false),
        cost25: new UIDouble(id + "-cost25", this.calculateCost(25), false),
        cost100: new UIDouble(id + "-cost100", this.calculateCost(100), false),
        costMax: new UIButton(id+"-costMax-btn", false)
    };
    this.maxAmount = 0;
    this.unlocked = false;
    $('#units').append('<div id="' + this.id + '"></div>');
};

Unit.prototype.newName = function(id, name, plural, action) {
    $("#" + this.id + "-displayID").html(name);
    $("#" + this.id + "-button").html(action);
    $('#' + this.id + "-imageID").attr("src", "icons/" + id + ".svg");
    this.displayID = name;
    this.plural = plural;
    this.action = action;
};

// Calcular custo de qualquer quantidade
Unit.prototype.calculateCost = function(amount) {
    if (amount < 0) { // Utilizo -1 para comprar max, ele calcula a quantidade maxima e armazena na propriedade maxAmount e entao calcula o custo dessa quantidade
        this.maxAmount = Math.floor(Math.log(((this.currency.valueOf() * (this.costGrowth - 1))/ Math.floor(this.baseCost * Math.pow(this.costGrowth, this.amount.valueOf()))) + 1)/Math.log(this.costGrowth));
        return (this.calculateCost(this.maxAmount));
    } else {
        return Math.floor(this.baseCost * Math.pow(this.costGrowth, this.amount.valueOf()) * (Math.pow(this.costGrowth, amount) - 1) / (this.costGrowth - 1));
    }
};

// Função chamada para comprar unidades

Unit.prototype.buy = function(amount) {
    var totalCost = this.calculateCost(amount);
    if (this.currency < totalCost) return;
    if (amount < 0) {
        this.amount.add(this.maxAmount);
    } else {
        this.amount.add(amount);
    }
    this.currency.add(-1 * totalCost);
    this.refreshCosts();
    this.refreshRewards();
    saveGame();
};

Unit.prototype.upgradeProduction = function(upgrade) {
    this.upgradeBonus *= upgrade;
    this.refreshRewards();
};

Unit.prototype.upgradeSpeed = function(upgrade) {
    this.timeMultiplier /= upgrade;
    this.refreshRewards();
};

// Função usada quando se compra a unidade para recalcular os custos que aparecem na tela
Unit.prototype.refreshCosts = function() {
    this.costs.cost.set(this.calculateCost(1));
    this.costs.cost10.set(this.calculateCost(10));
    this.costs.cost25.set(this.calculateCost(25));
    this.costs.cost100.set(this.calculateCost(100));
    this.refreshButtons();
};

//  Função usada a cada frame para atualizar os botões ( se voce tem ou não recursos suficientes pra comprar a unidade
Unit.prototype.refreshButtons = function() {
    this.costs.cost.button.set(this.currency >= this.costs.cost);
    this.costs.cost10.button.set(this.currency >= this.costs.cost10);
    this.costs.cost25.button.set(this.currency >= this.costs.cost25);
    this.costs.cost100.button.set(this.currency >= this.costs.cost100);
    this.costs.costMax.set(this.currency >= this.costs.cost);
};

//  Função usada quando se carrega o jogo para recuperar a quantidade de recursos que voce tinha
Unit.prototype.load = function(saveData) {
    this.amount.set(saveData.amount.value);
    this.buttonSet(saveData.loading);
    this.actualTime = saveData.actualTime;
    this.refreshCosts();
};

// Função que calcula a recompensa em gold que cada unidade da com os upgrades da Unidade e envia para o recurso
Unit.prototype.refreshRewards = function() {
    this.reward.set(this.baseReward * this.upgradeBonus * Math.pow(2, Math.floor(this.amount.valueOf()/25)) * Math.pow(2, Math.floor(this.amount.valueOf()/100))* Math.pow(2.5, Math.floor(this.amount.valueOf()/1000)));
    this.totalReward.set(this.reward * this.amount);
    this.totalTime = this.baseTime * this.timeMultiplier;
    this.rewardPerSecond.set(this.reward * 1000 / this.totalTime);
    this.totalRewardPerSecond.set(this.rewardPerSecond * this.amount);
};

Unit.prototype.progressUpdate = function(time) {
    this.progressBar.set(time/this.totalTime);
    this.timeLeft.set(this.totalTime - time);
};

Unit.prototype.buttonSet = function(loading) {
    var text;
    if(loading) text = '<span id="'
        + this.id + '-timeLeft"> </span>';
    if(!loading) text = this.action;
    $('#'+this.id+"-button").html(text);
    this.loading = loading;
    this.startButton.set(!loading);
};

Unit.prototype.gameLoop = function(interval) {
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
            this.resource.add(resourcesWon);
            this.progressUpdate(this.totalTime);
            return
        }
    } else if (this.actualTime >= this.totalTime) {
        this.actualTime = 0;
        this.resource.add(this.totalReward);
        this.buttonSet(false);
        this.progressUpdate(this.totalTime);
        saveGame();
        return
    }
    this.progressUpdate(this.actualTime);
};

Unit.prototype.click = function() {
    if (!this.loading) this.loading = true;
    this.buttonSet(true);
};

// Função que coloca na tela o recurso
Unit.prototype.giveKey = function() {
    if (this.unlocked) return;
    $('#' + this.id).html('<div class="row"><div class="col-sm-4"> <img id="'
        + this.id + '-imageID" src="icons/'
        + this.id + '.svg" height="120px" width="120px"></div><div class="col-sm-4"><b id="'
        + this.id + '-displayID">'
        + this.displayID + '</b><br> <br> Amount: <span id ="'
        + this.id + '-amount"></span><br>'
        + this.resource.displayID + ' per Unit: <span id="'
        + this.id + '-reward"></span> (<span id="'
        + this.id + '-rewardPerSecond"></span> / second)<br> Total '
        + this.resource.displayID + ': <span id="'
        + this.id + '-totalReward"></span> (<span id="'
        + this.id + '-totalRewardPerSecond"></span> / second)</div><div class="col-sm-4"> <br> Cost in '
        + this.currency.displayID + '<br> <i> x1: <span id="'
        + this.id + '-cost"></span><br> x10: <span id="'
        + this.id + '-cost10"></span><br>x25: <span id="'
        + this.id + '-cost25"></span><br>x100: <span id="'
        + this.id + '-cost100"></span> </i> </div></div><div style="padding-top: 2em" class="btn-group-justified"><div class="btn-group"><button id="'
        + this.id + '-cost-btn" onclick="player.units.'
        + this.id + '.buy(1)" class="btn btn-warning">x1</button></div><div class="btn-group"><button id="'
        + this.id + '-cost10-btn" onclick="player.units.'
        + this.id + '.buy(10)" class="btn btn-warning">x10</button></div><div class="btn-group"><button id="'
        + this.id + '-cost25-btn" onclick="player.units.'
        + this.id + '.buy(25)" class="btn btn-warning">x25</button></div><div class="btn-group"><button id="'
        + this.id + '-cost100-btn" onclick="player.units.'
        + this.id + '.buy(100)" class="btn btn-warning">x100</button></div><div class="btn-group"><button id="'
        + this.id + '-costMax-btn" onclick="player.units.'
        + this.id + '.buy(-1)" class="btn btn-warning">Max</button></div></div><br><button id="'
        + this.id + '-button" class="btn btn-block btn-success" onClick="player.units.'
        + this.id + '.click()"> '
        + this.action + '</button><div id="'
        + this.id + '-progress" class="progress"><div id="'
        + this.id + '-progressBar" class="progress-bar progress-bar-striped progress-bar-success" aria-valuemax="10000" style="width: 0"> </div></div>');
    this.unlocked = true;
    this.refreshCosts();
    this.buttonSet(this.loading);
    this.startButton.refresh();
    this.amount.refresh();
    this.reward.refresh();
    this.rewardPerSecond.refresh();
    this.totalRewardPerSecond.refresh();
    this.totalReward.refresh();
    this.costs.cost.button.refresh();
    this.costs.cost10.button.refresh();
    this.costs.cost25.button.refresh();
    this.costs.cost100.button.refresh();
    this.costs.costMax.refresh();
};