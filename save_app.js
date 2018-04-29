var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

app.get('/', function(req, res) {
    res.send('Bonjour à tous !');
});

var server = app.listen(port, function(){
    console.log('Le serveur est en marche sur le port  : 8080');
}); 