var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

/*Appel des modules nécessaaire*/
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

/* */
var MongoClient = require('mongodb').MongoClient;
var myDb;
var URL = 'mongodb://localhost:27017/game';

/* Joueurs */
var joueurs = [];
var choixJoueurs=[];

/*Déf le dossier des Fichiers static */
app.use('/static', express.static(__dirname + '/public'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));

//Support des envois methode post (body-parser)
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());

app.use(session({
    secret:'123456789SECRET',
    saveUninitialize: false,
    resave: false
}));


/* Déf l'utilisation de Pug pour les templates */
app.set('view engine', 'pug');

/*Re-déf le dossier de reception des fichier pug */
app.set('views', 'templates');

/***
**Les différentes routes 
***/

// Chemin de base de mon application
/*
app.get('/', function(req, res) {
    res.send('Bienvenue sur Heroku avec NodeJS !');
});
*/
/*
app.get('/index', function (req, res) {
    res.render('index');
});
*/

// 1. Routes en GET : Inscription joueurs
app.get('/inscription', function(req, res){
    res.render('inscription');/*fichier pug*/
});

app.get('/inscrit', function (req, res) {
    res.render('inscription');
});


app.get('/', function (req, res) {
    res.render('connexion');
});

app.get('*', function (req, res) {
    res.render('error');
});

/* Permet la connexion des joueurs */
app.post('/connex', function (req, res) {
    console.log(req.body.pseudo);
    console.log(req.password);
    console.log(req.lavatar);
    myDb.collection('players').findOne({pseudo: req.body.pseudo, password: req.body.password }, function (err, data) {
        console.log(data);
        if (err || !data) {
            console.log('ce pseudo n\'existe pas');
            res.render('connexion', {
                msg1: 'Identifiants inconnus'
            }); /*fichier pug*/
        } else {
            var pseudo = data.pseudo || '';
            var password = data.password || '';
            var lavatar = data.lavatar;

            console.log(joueurs);
            res.render('game', {
                pseudo: req.body.pseudo,
                password: req.body.password,
                lavatar: lavatar
            });
        }
    });
});

// 2. Routes en POST:
/* Permet l'inscription des joueurs */
app.post('/inscrit', function (req, res){
    console.log(req.pseudo);
    console.log(req.email);
    console.log(req.password);
    console.log(req.lavatar);
    myDb.collection('players').insert({
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: req.body.password,
        lavatar: req.body.lavatar },
        function (err, data) {
        console.log(data);
        if (err || !data) {
            console.log('champs mal remplie');
                res.render('inscription', {
                });

        } else {
        var pseudo = data.pseudo || '';
        var email = data.email || '';
        var password = data.password || '';
        var lavatar = data.lavatar || '';

            res.render('game', {
                pseudo: req.body.pseudo,
                email: req.body.email,
                password: req.password,
                lavatar: req.body.lavatar
            });
        }
    });
});


/*  */
    
MongoClient.connect(URL, function(err, db){
    if(err) {
        return;
    }
    myDb=db;
    var server = app.listen(port, function(){
        var portEcoute=server.address().port;
        console.log('Le serveur est en marche sur le port  : 8080');
        /* */

        /* Websocket */
        var io = require('socket.io');
        var websocketServer = io(server);

        websocketServer.on('connection', function(socket){

            socket.on('bonjour', function(contenu){
                console.log('Bonjour', contenu);
                var adversaire = 'en attente';
                if(joueurs.length % 2 !==0){
                    adversaire = joueurs[joueurs.length - 1].pseudo;
                    console.log('adv', joueurs[joueurs.length - 1].id);
                    socket.broadcast.to(joueurs[joueurs.length - 1].id).emit('adversaire', {
                        adversaire: contenu.pseudo
                    });
                }
                joueurs.push({
                    id: socket.id,
                    pseudo: contenu.pseudo,
                    index: joueurs.length,
                    adversaire: adversaire
                });
                socket.emit('adversaire', {
                    adversaire: adversaire
                });
                socket.emit('bonjour','bienvenue à toi');
            });
            socket.on('choisir', function(data){
                console.log(data);
                choixJoueurs.push(data);

                console.log(choixJoueurs);
                console.log(choixJoueurs.length);

                console.log('OK');
                if(choixJoueurs.length==2){
                    websocketServer.emit('animation', choixJoueurs);
                    choixJoueurs=[];
                }
            });
        });
    });
}); 

