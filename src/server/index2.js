const express = require('express');
var request = require('request');
var mysql = require("mysql");

var app = express();  
var staticRoot = __dirname;  
var path = require('path');
var fs = require('fs');
var https = require('https');
var compression = require('compression')
var port = process.env.PORT || 3000;

var key = fs.readFileSync('/etc/ssl/private/informesinbandera.com.key');
var cert = fs.readFileSync( '/etc/ssl/certs/1b7dbe40cb30921b.crt' );
var ca = fs.readFileSync( '/etc/ssl/certs/gd_bundle-g2-g1.crt' );

var options = {
  key: key,
  cert: cert,
  ca: ca
};

function wwwRedirect(req, res, next) {
    if (req.headers.host) {
        if (req.headers.host.slice(0, 4) === 'www.') {
            var newHost = req.headers.host.slice(4);
            return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
        }
    }
    next();
};

// app.set('port', (process.env.PORT || 3000));  


app.set('trust proxy', true);
app.use(wwwRedirect);


var nonSPArouter = express.Router();
 
nonSPArouter.get('/', function(req,res) {

    
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'themachine21.',
        database : 'isb'
    });

connection.connect();
    let query = "SELECT * FROM ?? INNER JOIN ?? ON news.id = news_ratings_detail.news_id WHERE created_time >= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 1 DAY)) ORDER BY id DESC LIMIT 55";
    let table = ["news", "news_ratings_detail"]; 
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query, function (err, rows, fields) {
        if (err) throw err;

        rows.forEach(function(element) {
                if(element.image.indexOf("efe") == -1) { 
                    element.image = 'https://informesinbandera.com/proxy/'+encodeURIComponent(element.image);
                } else if (element.image === 'https://informesinbandera.com/proxy/'){
                    element.image = 'img/placeholder-img.png';
                } else {
                    element.image = 'img/placeholder-img.png';
                }
        });
        connection.end();
        res.render('/var/www/html/betatester/isb-cli/src/server/views/index', {
            rows      : rows,
                img       : 'https://informesinbandera.com/img/bola.png',
                url       : 'https://informesinbandera.com/',
                title     : 'Informe Sin Bandera', 
                descriptionText : 'Informe al minuto las 24 horas',
                imageUrl  : 'https://informesinbandera.com/img/bola.png'
        });
    });


 // var img   = 'https://informesinbandera.com/img/bola.png';

/*  res.render('bot', { 
    img       : img,
    url       : 'https://informesinbandera.com/',
    title     : 'Informe Sin Bandera', 
    descriptionText 
              : 'Informe al minuto las 24 horas',
    imageUrl  : 'https://informesinbandera.com/img/bola.png'
  });*/
});

nonSPArouter.get('/noticias/:id', function(req, res) {

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'themachine21.',
        database : 'isb'
    });

connection.connect();
    let query = "SELECT * FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ??=?";
    let table = ["news", "news_detail", "news.id", "news_detail.id", "url_name", decodeURIComponent(req.url.substr(10))]; 
    query = mysql.format(query,table);
    console.log(query);
    connection.query(query, function (err, rows, fields) {
        if (err) throw err;

        var img, body;
        if (!rows || !rows[0]) {
            rows = [];
            rows[0] = []
            rows[0].title = 'Informe Sin Bandera';
            rows[0].img      = 'https://informesinbandera.com/img/bola.png';
            rows[0].url       = 'https://informesinbandera.com/';
            rows[0].text = 'Informe al minuto las 24 horas';
            rows[0].imageUrl  = 'https://informesinbandera.com/img/bola.png';
            body = '';
        } else {
            rows[0].url       = 'https://informesinbandera.com/noticias/'+rows[0].url_name;

            if (rows[0].image.substring(0, 15) == "//estaticos.efe") {
                rows[0].image = 'https:' + rows[0].image;
            }
            img = 'https://informesinbandera.com/proxy/'+encodeURIComponent(rows[0].image);
            body = new Buffer(rows[0].body, 'base64').toString();
            if (img === 'https://informesinbandera.com/proxy/') img = 'https://informesinbandera.com/img/bola.png';
        }

        // console.log(req.url.substr(10));
        connection.end();
        res.render('/var/www/html/betatester/isb-cli/src/server/views/bot', {
            img       : img,
            url       : rows[0].url,
            title     : rows[0].title, 
            descriptionText : rows[0].text,
            imageUrl  : img,
            body: body,
            subtitle: rows[0].text
        });
        console.log('The solution is: ', rows[0])
    });

   
});
 
app.use(function(req, res, next) {
    if (req.secure) {
        next();
    } else {
        res.redirect('https://' + req.headers.host + req.url);
    }
});

app.use(function(req,res,next) {
  var ua = req.headers['user-agent'];
  if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)|(Google)|(LinkedInBot)|(bingbot)|(Slurp)|(DuckDuckBot)|(Baiduspider)|(YandexBot)|(Sogou)|(facebot)|(ia_archiver)|(Pingdom)|(uptimerobot)|(SocialRankIOBot)|(LivelapBot)/gi.test(ua)) {
    let b = req.url.substr(10);
    console.log(ua,' is a bot');
    nonSPArouter(req,res,next);
  } else {
    console.log('User-Agent is not a bot: ' + ua);
    next();
  }
});

app.use(compression())
app.use(express.static(staticRoot));
app.use(express.static(path.join(__dirname, '../app')));
app.use(express.static(path.join(__dirname, './')));
app.use(express.static(path.join(__dirname, '../node_modules')));


app.get('/proxy/:url', function(req, res) {  
  var url = req.params.url;
  
  req.pipe(request(url)).on('error', function(err) { console.log(err); }).pipe(res);
});

app.get('/', function(req, res) {
    console.log('User-Agent /: ' + req.headers['user-agent']);
    res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/noticias/:id', function(req, res) {
    console.log('User-Agent /noticias/:id: ' + req.headers['user-agent']);
      res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/noticias/:id/:comment_id', function(req, res) {
     res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/portada', function(req, res) {
     res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/redirect', function(req, res) {
     res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/noticias/redirect', function(req, res) {
     res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/login', function(req, res) {
     res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/admin', function(req, res) {
     res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/admin/news', function(req, res) {
     res.sendFile(path.join(__dirname, './index.html'));
});

app.use('/',express.static(__dirname + '/static'));
app.set('view engine', 'jade');

https.createServer(options, app).listen(443, function() {  
    console.log('app running on port', app.get(443));
});
var http = require('http');
http.createServer(app).listen(3000, function() {  
    console.log('app running on port', app.get(3000));
});



/*app.listen(app.get('port'), function() {  
    console.log('app running on port', app.get('port'));
});*/


/*https.createServer({
    key: fs.readFileSync('/etc/ssl/private/informesinbandera.com.key'),
    cert: fs.readFileSync('/etc/ssl/certs/1b7dbe40cb30921b.crt'),
    ca: [fs.readFileSync('/etc/ssl/certs/gd_bundle-g2-g1.crt')] // <----- note this part
}, app).listen(process.env.PORT || 3000);*/
