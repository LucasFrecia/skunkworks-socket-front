const express = require('express');
var request = require('request');
var app = express();  
var staticRoot = __dirname;  
var path = require('path');
var fs = require('fs');
var https = require('https');
var compression = require('compression')
var port = process.env.PORT || 3000;

function wwwRedirect(req, res, next) {
    if (req.headers.host.slice(0, 4) === 'www.') {
        var newHost = req.headers.host.slice(4);
        return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
    }
    next();
};

/*require('https').createServer({
    key: fs.readFileSync('/etc/ssl/private/informesinbandera.com.key'),
    cert: fs.readFileSync('/etc/ssl/certs/1b7dbe40cb30921b.crt'),
    ca: [fs.readFileSync('/etc/ssl/certs/gd_bundle-g2-g1.crt')] // <----- note this part
}, app).listen(process.env.PORT || 3000);*/


//var enforce = require('express-sslify');


// put it as one of the first middlewares, before routes
//app.use(enforce.HTTPS()); 


app.set('port', (process.env.PORT || 3000));  


app.set('trust proxy', true);
app.use(wwwRedirect);

app.use(compression())
app.use(express.static(staticRoot));
app.use(express.static(path.join(__dirname, '../app')));
app.use(express.static(path.join(__dirname, './')));
app.use(express.static(path.join(__dirname, '../node_modules')));


app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

app.get('/proxy/:url', function(req, res) {  
  var url = req.params.url;
  req.pipe(request(url)).pipe(res);
 // res.sendFile(request(url));
});


app.get('/proxied_image/:image_url', function(request_from_client, response_to_client){
  sys.puts("Starting proxy");
  var image_url = request_from_client.params.image_url;

  var image_host_name = url.parse(image_url).hostname
  var filename = url.parse(image_url).pathname.split("/").pop()

  var http_client = http.createClient(80, image_host_name);
  var image_get_request = http_client.request('GET', image_url, {"host": image_host_name});
  image_get_request.addListener('response', function(proxy_response){
    var current_byte_index = 0;
    var response_content_length = parseInt(proxy_response.header("Content-Length"));
    var response_body = new Buffer(response_content_length);
   
    proxy_response.setEncoding('binary');
    proxy_response.addListener('data', function(chunk){
      response_body.write(chunk, current_byte_index, "binary");
      current_byte_index += chunk.length;
    });
    proxy_response.addListener('end', function(){
      response_to_client.contentType(filename);
      response_to_client.send(response_body);
    });
  });
  image_get_request.end();
});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});
/*app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, './index.html'));
});*/
app.get('/noticias/:id', function(req, res) {
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
app.get('/login', function(req, res) {
     res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/admin', function(req, res) {
     res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/admin/news', function(req, res) {
     res.sendFile(path.join(__dirname, './index.html'));
});


app.listen(app.get('port'), function() {  
    console.log('app running on port', app.get('port'));
});


// Create https server & run
/*https.createServer({
    key: fs.readFileSync('/etc/ssl/private/informesinbandera.com.key'),
    cert: fs.readFileSync('/etc/ssl/certs/1b7dbe40cb30921b.crt'),
    ca: [fs.readFileSync('/etc/ssl/certs/gd_bundle-g2-g1.crt')] // <----- note this part
}, app).listen(port, function() {
    console.log('API Server Started On Port %d', port);
});*/

/**
 * 
 * // Import libraries
var express = require('express');
var server = express();
var bodyParser = require('body-parser')
var https = require('https');
var fs = require('fs');

// Server setting
var port = process.env.PORT || 8080;

// Register body-parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// Configure router
var router = express.Router();
server.use('/api/v1', router);

// Create https server & run
https.createServer({
    key: fs.readFileSync('/etc/ssl/private/informesinbandera.com.key'),
    cert: fs.readFileSync('/etc/ssl/certs/1b7dbe40cb30921b.crt'),
    ca: [fs.readFileSync('/etc/ssl/certs/gd_bundle-g2-g1.crt')] 
}, server).listen(port, function() {
    console.log('API Server Started On Port %d', port);
});

// Register routes
router.get('/', function(req, res) {
    res.json({ success: true });
});
 * 
 */