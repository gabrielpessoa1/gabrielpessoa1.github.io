/**
 * Created by Gabriel on 17/10/2016.
 */

var Resource = function(id) {
    this.id = id;
    this.displayID = '<img src="icons/' + id + '.svg" height="35px" width="35px">';
    this.amount = new UINumber(this.id+"-amount", 0);
    this.unlocked = false;
    $('#resources').append('<li id=' + this.id + '></li>');
};

Resource.prototype.add = function(value) {
    this.amount.addNoRefresh(value);
};

Resource.prototype.valueOf = function() {
    return this.amount.valueOf();
};

Resource.prototype.load = function(saveData) {
    this.amount.set(saveData.amount.value);
};

Resource.prototype.giveKey = function() {
    if (this.unlocked) return;
    $('#' + this.id).html('<a style="padding-left:5em">'
        + this.displayID + ' <b style="padding-left:1em" id="'
        + this.id + '-amount"> </b></a>');
    this.unlocked = true;
    this.amount.refresh();
};

Resource.prototype.refresh = function() {
    this.amount.refresh();
};