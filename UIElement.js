/**
 * Created by Gabriel on 16/10/2016.
 */

var Nav = function (id, name) {
    this.id = id;
    this.name = name;
    if(id === "units") $('#navsHere').append('<li class="active" id="' + this.id + 'Nav"></li>');
    if(!(id === "units")) $('#navsHere').append('<li id="' + this.id + 'Nav"></li>')
};

Nav.prototype.giveKey = function() {
    $('#' + this.id + 'Nav').html('<a data-toggle="pill" href="#' + this.id + '">' + this.name + '</a>');
};

// Elemento que tem um valor e um ID q é colocado na tela
var UINumber = function (id, value, extra) {
    this.id = id;
    this.value = value;
    this.refresh();
    this.isTime = (extra === 't');
    this.noRound = (extra === 'n');
};

// Elemento que tem um valor verdadeiro ou falso para habilitar ou desabilitar um botão
var UIButton = function (id, value) {
    this.id = id;
    this.value = value;
    this.refresh();
};

// Funções que colocam o valor salvo na tela
UINumber.prototype.refresh = function() {
    $("#" + this.id).html(roundNumber(this.value, this.isTime, this.noRound));
};

UIButton.prototype.refresh = function() {
    $("#" + this.id).prop("disabled", !this.value)
};


// Função que retorna o valor
UINumber.prototype.valueOf = function() {
    return this.value;
};

UIButton.prototype.valueOf = function() {
    return this.value;
};

// Função que define um valor novo e da refresh
UINumber.prototype.set = function(value) {
    this.value = value;
    this.refresh();
};

UIButton.prototype.set = function(value) {
    if(this.value === value) return;
    this.value = value;
    this.refresh();
};

// Define um valor novo sem refresh
UINumber.prototype.setNoRefresh = function(value) {
    this.value = value;
};

UIButton.prototype.setNoRefresh = function(value) {
    this.value = value;
};

// Soma um valor ao valor atual sem refresh
UINumber.prototype.addNoRefresh = function(value) {
    this.setNoRefresh(this.valueOf() + value);
};

// Multiplica o valor atual sem refresh
//noinspection JSUnusedGlobalSymbols
UINumber.prototype.productNoRefresh = function(value) {
    this.setNoRefresh(this.valueOf() * value);
};

// Soma o valor com refresh
UINumber.prototype.add = function(value) {
    this.set(this.valueOf() + value);
};

// Elemento que contem um botão e um valor numérico
var UIDouble = function (id, numberValue, buttonValue) {
    this.number = new UINumber(id, numberValue);
    this.button = new UIButton(id+"-btn", buttonValue);
    this.refresh();
};

// Elemento que da refresh tanto no custo quanto no botão
UIDouble.prototype.refresh = function() {
    this.number.refresh();
    this.button.refresh();
};

UIDouble.prototype.valueOf = function() {
    return this.number.valueOf();
};

UIDouble.prototype.set = function(numberValue, buttonValue) {
    this.number.set(numberValue);
    if(arguments.length > 1) {
        this.button.set(buttonValue);
    }
};

// Barra de progresso

var UIBar = function(id, value) {
    this.id = id;
    this.value = Math.floor(value * 10000);
    this.refresh();
};

UIBar.prototype.refresh = function() {
    $("#" + this.id).css('width',this.value / 10 + "%").attr('aria-valuenow', this.value);
};

UIBar.prototype.set = function(value) {
    this.value = Math.floor(value * 1000);
    this.refresh();
};