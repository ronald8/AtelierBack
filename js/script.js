'use strict'

window.addEventListener('DOMContentLoaded', function(){
    var webSocketclient=io('http://localhost:8080');webSocketclient.emit('bonjour',{
        pseudo:document.getElementById('pseudo').innerHTML
    });

// recherche le numéro de l'avatar
var avatarP1 = document.getElementById('avatarPlayer1');
var avatarP2 = document.getElementById('avatarPlayer2');
var rechAvatarPseudo = document.getElementById('pseudo').innerHTML;
var rechAvatarPseudo2 = parseFloat(rechAvatarPseudo);

var lol = './img/avatar' + rechAvatarPseudo2 + '.png';

var mettreAvatar1 = function() {
    avatarP1.style.backgroundImage = "url(" + lol + ")";
}

var mettreAvatar2 = function() {
    console.log(rechAvatarAdversaire);
    console.log(rechAvatarAdversaire2);
    var rechAvatarAdversaire = document.getElementById('adversaire').innerHTML;
    var rechAvatarAdversaire2 = parseFloat(rechAvatarAdversaire);
    var lol1 = './img/avatar' + rechAvatarAdversaire2 + '.png';
    avatarP2.style.backgroundImage = "url(" + lol1 +")";
}

////////////////////////////////
/*
var iconeSkills = ['angular.png', 'boostrap.png', 'css3.png', 'expressJS.png', 'html5.png', 'jquery.png', 'js.png', 'meteorJS.png', 'mongoDB.png', 'nodeJS.png'];
*/
var imagesCases = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];

var positionsCases = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var casesVisible = [];

var ImgDouble = 0;

var iconesCases = document.getElementById('cases').getElementsByTagName('img');

for(var i = 0; i < iconesCases.length; i++){
    iconesCases[i].numeroCase = i;
    iconesCases[i].onclick = function(){
        game(this.numeroCase)
    }
}

initGame();
/* Maj affichage des cartes */

var affichageCases = function(numeroCase){
    switch(positionsCases[numeroCase]){
        //cartes de dos
        case 0:
            iconesCases[numeroCase].src ="./img/javascript.png";
            break;
        //cartes retournées 
        case 1:
            iconesCases[numeroCase].src = "./img/image" + imagesCases[numeroCase] + ".png";
            break;
        //cartes trouvées donc cachées
        case -1:
            iconesCases[numeroCase].style.visibility = "hidden";
        break;
    }
}

/*
var replay = function(){
    alert("Bravo !");
    loaction.reload();
}
*/
/* Melange les cartes */
function initGame(){
    for (var position=imagesCases.length-1; position>=1; position--){
        var aleatoire = Math.floor(Math.random() * (position+1));
        var sauvegarde = imagesCases[position];
        imagesCases[position] = imagesCases[aleatoire];
        imagesCases[aleatoire]= sauvegarde;
    }
}

/* */
var game = function(numeroCase){
//verif : pas + de 2cartes retournéees en même temps   
    if(casesVisible.length < 2){
        if(positionsCases[numeroCase] == 0){
            positionsCases[numeroCase] = 1;
            casesVisible.push(numeroCase);
            affichageCases(numeroCase);
        }
        //cartes
        if(casesVisible.length == 2){
            var nouveauStatut = 0;
            if(imagesCases[casesVisible[0]] == imagesCases[casesVisible[1]]){
                nouveauStatut = -1;
                ImgDouble++;
            }

            positionsCases[casesVisible[0]] = nouveauStatut;
            positionsCases[casesVisible[1]] = nouveauStatut;
        
        //Points pour paire trouvées
           if(nouveauStatut == -1){
               var toto = document.getElementById('score1').innerText
               document.getElementById('score1').innerHTML = parseInt(toto) + parseInt(1); 
           } 
            if (casesVisible.length==2 && nouveauStatut == -1) {
                var titi = document.getElementById('score2').innerText
                document.getElementById('score2').innerHTML = parseInt(titi) + parseInt(1);
            } 


            var tempsAffichage = window.setTimeout(function(){
                affichageCases(casesVisible[0]);
                affichageCases(casesVisible[1]);
                casesVisible=[];
                if(ImgDouble == 10){
                    replay();
                }
            },400);
        }
    }
}


webSocketclient.on('adversaire', function (data) {
    console.log(data);
    document.getElementById('adversaire').innerText = data.adversaire;
    mettreAvatar2();
});

webSocketclient.on('bonjour', function (contenu) {
    game(contenu);
    mettreAvatar1();
});


//Pour chaque pour joueurs avec le moins de clic
var affichePoints = function(message){
    if(true){
        
    }
}


webSocketclient.on('animation', function(data){
    console.log(data);
    if(document.getElementById('pseudo'),innerText==data[0].speudo){
        
    }

});

});
