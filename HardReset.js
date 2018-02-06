/**
 * Created by Gabriel on 17/10/2016.
 */

// Função simples para resetar seus dados e começar o jogo de novo
function hardReset() {
    if (window.confirm("Are you sure? YOU WILL LOSE ALL YOUR PROGRESS")) {
        localStorage.removeItem('nethergame_save');
        player = new Player();
        location.reload();
    }
}