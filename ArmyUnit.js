/**
 * Created by Gabriel on 27/12/2016.
 */
var Player;

var ArmyUnit = function(id, displayID, plural, baseCost, costGrowth, baseStrength, resource, currency) {
    this.id = id;
    this.displayID = displayID;
    this.plural = plural;
    this.baseCost = baseCost;
    this.costGrowth = costGrowth;
    this.amount = new UINumber(id + "-amount", 1);
    this.resource = resource; // Recurso coletado pela unidade
    this.currency = currency; // Recurso utilizado para compra da unidade
    this.baseStrength = baseStrength;
    this.upgradeBonus = 1;
    this.strength = new UINumber(id + "-strength", 0);
    this.totalStrength = new UINumber(id + "-totalStrength", 0);
    this.costs = {
        cost: new UIDouble(id + "-cost", baseCost, false),
        cost10: new UIDouble(id + "-cost10", this.calculateCost(10), false),
        cost25: new UIDouble(id + "-cost25", this.calculateCost(25), false),
        cost100: new UIDouble(id + "-cost100", this.calculateCost(100), false),
        costMax: new UIButton(id+"-costMax-btn", false)
    };
    this.maxAmount = 0;
    this.unlocked = false;
    $('#armyUnits').append('<div id=' + this.id + '></div>');
};

ArmyUnit.prototype.newName = function(id, name, plural) {
    console.log(id);
    $("#" + this.id + "-displayID").html(name);
    console.log('#' + this.id + '-imageID');
    $('#' + this.id + "-imageID").attr("src", "icons/" + id + ".svg");
    this.displayID = name;
    this.plural = plural;
};

// Calcular custo de qualquer quantidade
ArmyUnit.prototype.calculateCost = function(amount) {
    if (amount < 0) { // Utilizo -1 para comprar max, ele calcula a quantidade maxima e armazena na propriedade maxAmount e entao calcula o custo dessa quantidade
        this.maxAmount = Math.floor(Math.log(((this.currency.valueOf() * (this.costGrowth - 1))/ Math.floor(this.baseCost * Math.pow(this.costGrowth, this.amount.valueOf()))) + 1)/Math.log(this.costGrowth));
        return (this.calculateCost(this.maxAmount));
    } else {
        return Math.floor(this.baseCost * Math.pow(this.costGrowth, this.amount.valueOf()) * (Math.pow(this.costGrowth, amount) - 1) / (this.costGrowth - 1));
    }
};

// Função chamada para comprar unidades

ArmyUnit.prototype.buy = function(amount) {
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

ArmyUnit.prototype.upgradeProduction = function(upgrade) {
    this.upgradeBonus *= upgrade;
    this.refreshRewards();
};

// Função usada quando se compra a unidade para recalcular os custos que aparecem na tela
ArmyUnit.prototype.refreshCosts = function() {
    this.costs.cost.set(this.calculateCost(1));
    this.costs.cost10.set(this.calculateCost(10));
    this.costs.cost25.set(this.calculateCost(25));
    this.costs.cost100.set(this.calculateCost(100));
    this.refreshButtons();
};

//  Função usada a cada frame para atualizar os botões ( se voce tem ou não recursos suficientes pra comprar a unidade
ArmyUnit.prototype.refreshButtons = function() {
    this.costs.cost.button.set(this.currency >= this.costs.cost);
    this.costs.cost10.button.set(this.currency >= this.costs.cost10);
    this.costs.cost25.button.set(this.currency >= this.costs.cost25);
    this.costs.cost100.button.set(this.currency >= this.costs.cost100);
    this.costs.costMax.set(this.currency >= this.costs.cost);
};

//  Função usada quando se carrega o jogo para recuperar a quantidade de recursos que voce tinha
ArmyUnit.prototype.load = function(saveData) {
    this.amount.set(saveData.amount.value);
    this.refreshCosts();
};

// Função que calcula a recompensa em gold que cada unidade da com os upgrades da Unidade e envia para o recurso
ArmyUnit.prototype.refreshRewards = function() {
    var oldStrength = this.totalStrength.valueOf();
    this.strength.set(this.baseStrength * this.upgradeBonus * Math.pow(2, Math.floor(this.amount.valueOf()/25)) * Math.pow(2, Math.floor(this.amount.valueOf()/100))* Math.pow(2.5, Math.floor(this.amount.valueOf()/1000)));
    this.totalStrength.set(this.strength * this.amount);
    this.resource.addStrength(this.totalStrength.valueOf() - oldStrength);
};

// Função que coloca na tela o recurso
ArmyUnit.prototype.giveKey = function() {
    if (this.unlocked) return;
    $('#' + this.id).html('<div class="row"><div class="col-sm-4"> <img id="'
        + this.id + '-imageID" src="icons/'
        + this.id + '.svg" height="120px" width="120px"></div><div class="col-sm-4"><b id="'
        + this.id + '-displayID">'
        + this.displayID + '</b><br> <br> Amount: <span id ="'
        + this.id + '-amount"></span><br>'
        + this.resource.displayID + ' per Unit: <span id="'
        + this.id + '-strength"></span> <br> Total '
        + this.resource.displayID + ': <span id="'
        + this.id + '-totalStrength"></span> </div><div class="col-sm-4"> <br> Cost in '
        + this.currency.displayID + '<br> <i> x1: <span id="'
        + this.id + '-cost"></span><br> x10: <span id="'
        + this.id + '-cost10"></span><br>x25: <span id="'
        + this.id + '-cost25"></span><br>x100: <span id="'
        + this.id + '-cost100"></span> </i> </div></div><div style="padding-top: 2em" class="btn-group-justified"><div class="btn-group"><button id="'
        + this.id + '-cost-btn" onclick="player.army.'
        + this.id + '.buy(1)" class="btn btn-warning">x1</button></div><div class="btn-group"><button id="'
        + this.id + '-cost10-btn" onclick="player.army.'
        + this.id + '.buy(10)" class="btn btn-warning">x10</button></div><div class="btn-group"><button id="'
        + this.id + '-cost25-btn" onclick="player.army.'
        + this.id + '.buy(25)" class="btn btn-warning">x25</button></div><div class="btn-group"><button id="'
        + this.id + '-cost100-btn" onclick="player.army.'
        + this.id + '.buy(100)" class="btn btn-warning">x100</button></div><div class="btn-group"><button id="'
        + this.id + '-costMax-btn" onclick="player.army.'
        + this.id + '.buy(-1)" class="btn btn-warning">Max</button></div></div><br>');
    this.unlocked = true;
    this.refreshCosts();
    this.amount.refresh();
    this.strength.refresh();
    this.totalStrength.refresh();
    this.costs.cost.button.refresh();
    this.costs.cost10.button.refresh();
    this.costs.cost25.button.refresh();
    this.costs.cost100.button.refresh();
    this.costs.costMax.refresh();
    this.refreshRewards();
};