/**
 * Created by Gabriel on 16/10/2016.
 */

function percent(num, addPlus) {
    if (!addPlus) return (((num - 1)*100) + '%');
    if (num === 1) return "No Changes";
    return (num > 1) ? ('+' + ((num - 1)*100) + '%') : (((num - 1)*100) + '%');
}
// a função originalmente só arredondava, por isso o nome roundNumber que é assim até hoje
function roundNumber(num, isTime, noRound) {
    return (isTime) ? roundNumberTime(num) : roundNumberCommon(num, noRound);
}

// Coloca um tempo na versão hh:mm:ss:mmm

function roundNumberTime(num) {
    if (num < 1000) return (num < 10) ? "00:00:00:00" + num : (num < 100) ? "00:00:00:0" + num : "00:00:00:" + num;
    var milliseconds = num % 1000;
    var seconds = Math.floor(num / 1000);
    var minutes;
    var hours;
    if(seconds < 10) return (milliseconds < 10) ? "00:00:0" + seconds + ":00" + milliseconds : (milliseconds < 100) ? "00:00:0" + seconds + ":0" + milliseconds : "00:00:0" + seconds + ":" + milliseconds;
    if(seconds < 60) return (milliseconds < 10) ? "00:00:" + seconds + ":00" + milliseconds : (milliseconds < 100) ? "00:00:" + seconds + ":0" + milliseconds : "00:00:" + seconds + ":" + milliseconds;
    minutes = Math.floor(seconds/60);
    seconds %= 60;
    if(minutes < 10) {
        if(seconds < 10) return (milliseconds < 10) ? "00:0" + minutes + ":0" + seconds + ":00" + milliseconds : (milliseconds < 100) ? "00:0" + minutes + ":0" + seconds + ":0" + milliseconds : "00:0" + minutes + ":0" + seconds + ":" + milliseconds;
        if(seconds < 60) return (milliseconds < 10) ? "00:0" + minutes + ":" + seconds + ":00" + milliseconds : (milliseconds < 100) ? "00:0" + minutes + ":" + seconds + ":0" + milliseconds : "00:0" + minutes + ":" + seconds + ":" + milliseconds;
    }
    if(minutes < 60) {
        if(seconds < 10) return (milliseconds < 10) ? "00:" + minutes + ":0" + seconds + ":00" + milliseconds : (milliseconds < 100) ? "00:" + minutes + ":0" + seconds + ":0" + milliseconds : "00:" + minutes + ":0" + seconds + ":" + milliseconds;
        if(seconds < 60) return (milliseconds < 10) ? "00:" + minutes + ":" + seconds + ":00" + milliseconds : (milliseconds < 100) ? "00:" + minutes + ":" + seconds + ":0" + milliseconds : "00:" + minutes + ":" + seconds + ":" + milliseconds;
    }
    hours = Math.floor(minutes/60);
    minutes %= 60;
    if(hours < 10) {
        if(minutes < 10) {
            if(seconds < 10) return (milliseconds < 10) ? "0" + hours + ":0" + minutes + ":0" + seconds + ":00" + milliseconds : (milliseconds < 100) ? "0" + hours + ":0" + minutes + ":0" + seconds + ":0" + milliseconds : "0" + hours + ":0" + minutes + ":0" + seconds + ":" + milliseconds;
            if(seconds < 60) return (milliseconds < 10) ? "0" + hours + ":0" + minutes + ":" + seconds + ":00" + milliseconds : (milliseconds < 100) ? "0" + hours + ":0" + minutes + ":" + seconds + ":0" + milliseconds : "0" + hours + ":0" + minutes + ":" + seconds + ":" + milliseconds;
        }
        if(minutes < 60) {
            if(seconds < 10) return (milliseconds < 10) ? "0" + hours + ":" + minutes + ":0" + seconds + ":00" + milliseconds : (milliseconds < 100) ? "0" + hours + ":" + minutes + ":0" + seconds + ":0" + milliseconds : "0" + hours + ":" + minutes + ":0" + seconds + ":" + milliseconds;
            if(seconds < 60) return (milliseconds < 10) ? "0" + hours + ":" + minutes + ":" + seconds + ":00" + milliseconds : (milliseconds < 100) ? "0" + hours + ":" + minutes + ":" + seconds + ":0" + milliseconds : "0" + hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
        }
    }
    if(minutes < 10) {
        if(seconds < 10) return (milliseconds < 10) ? hours + ":0" + minutes + ":0" + seconds + ":00" + milliseconds : (milliseconds < 100) ? hours + ":0" + minutes + ":0" + seconds + ":0" + milliseconds : hours + ":0" + minutes + ":0" + seconds + ":" + milliseconds;
        if(seconds < 60) return (milliseconds < 10) ? hours + ":0" + minutes + ":" + seconds + ":00" + milliseconds : (milliseconds < 100) ? hours + ":0" + minutes + ":" + seconds + ":0" + milliseconds : hours + ":0" + minutes + ":" + seconds + ":" + milliseconds;
    }
    if(minutes < 60) {
        if(seconds < 10) return (milliseconds < 10) ? hours + ":" + minutes + ":0" + seconds + ":00" + milliseconds : (milliseconds < 100) ? hours + ":" + minutes + ":0" + seconds + ":0" + milliseconds : hours + ":" + minutes + ":0" + seconds + ":" + milliseconds;
        if(seconds < 60) return (milliseconds < 10) ? hours + ":" + minutes + ":" + seconds + ":00" + milliseconds : (milliseconds < 100) ? hours + ":" + minutes + ":" + seconds + ":0" + milliseconds : hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
    }
}

// Coloca um numero na notação com letras, arredondando ou não(para valores baixos) dependendo do valor de noRound
function roundNumberCommon(num, noRound) {
    var suffixes = ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "Nn", "Dc", "UDc", "DDc", "TDc", "QaDc", "QtDc", "SxDc", "SpDc", "ODc", "NDc", "Vi",
        "UVi", "DVi", "TVi", "QaVi", "QtVi", "SxVi", "SpVi", "OcVi", "NnVi", "Tg", "UTg", "DTg", "TTg", "QaTg", "QtTg", "SxTg", "SpTg", "OcTg", "NnTg", "Qd",
        "UQd", "DQd", "TQd", "QaQd", "QtQd", "SxQd", "SpQd", "OcQd", "NnQd", "Qq", "UQq", "DQq", "TQq", "QaQq", "QtQq", "SxQq", "SpQq", "OcQq", "NnQq", "Sg"];
    for(var i = suffixes.length - 1; i >= 0; i--) {
        if (num >= Math.pow(10, 3 * i + 3) * 0.99999) {
            var temp = Math.floor(num / Math.pow(10, 3 * i + 1)) / 100;
            if(temp >= 100) return Math.floor(temp) + suffixes[i];
            return (temp >=10) ? Math.floor(temp * 10)/10 + suffixes[i] : temp + suffixes[i];
        }
    }
    if(noRound) return Math.floor(num * 100)/100;
    return Math.floor(num);
}