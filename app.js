var koa = require('koa');
var cors = require('koa-cors');
var serve = require('koa-static');
var router = require('koa-router');
var urlToImage = require('url-to-image');


// since the result is cheap we can just cache in memory
var cache = {};

// where are the images going to be stored on disk? (in the container)
var imageRoot = '/opt/images/';

// initialize koa app
var app = koa();

// allow cross origin requests
app.use(cors());

// let koa serve the image requests rather than setting up a web server
app.use(serve(imageRoot));

// a basic router
var apiRouter = router();


// simple hashing function
var hash = function (string) {
    var hash = 0;
    if (string.length === 0) return hash;
    for (var index = 0; index < string.length; index++) {
        var char = string.charCodeAt(index);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash * hash;
};


// returns a promise resolving the url to a uri at which the thumbnail can be requested.
var screenshot = function (url) {
    var imageName = hash(url) + ".png";
    return new Promise(function (resolve, reject) {
        if (cache.hasOwnProperty(imageName)) {
            resolve(cache[imageName]);
        } else {
            urlToImage(url, imageRoot + "/" + imageName, {ignoreSslErrors: false}).fail(function (err) {
                reject({error: 'An error occurred while fetching the url. Probably it is unreachable.'});
            }).then(function () {
                cache[url] = '/' + imageName;
                resolve({uri: cache[url]});
            });
        }
    });
};


// we support one endpoint that expects a ?url query parameter and returns a result indicating where the thumbnail
// for the requested url can be retrieved.
apiRouter.get('/', function *() {
    var query = this.query;
    if (query.hasOwnProperty('url')) {
        var url = query['url'];
        this.body = yield screenshot(url);
    } else {
        this.status = 400;
        this.body = {error: 'Bad Request.'};
    }
});


// tell the app to use the router
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());


// serve the app
var server = app.listen(3000, function () {
    console.log('Successfully started up on port 3000');
});