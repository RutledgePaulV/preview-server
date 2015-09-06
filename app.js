var koa = require('koa');
var router = require('koa-router');
var serve = require('koa-static');
var urlToImage = require('url-to-image');
var imageRoot = '/opt/images/';

var app = koa();
app.use(serve(imageRoot));

var hash = function (string) {
    var hash = 0;
    if (string.length === 0) return hash;
    for (var index = 0; index < string.length; index++) {
        var char = string.charCodeAt(index);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

var screenshot = function (url) {
    var imageName = hash(url) + ".png";
    return new Promise(function (resolve, reject) {
        urlToImage(url, imageRoot + "/" + imageName, {ignoreSslErrors: false}).fail(function (err) {
            reject(err);
        }).then(function () {
            resolve({uri: imageName});
        });
    });
};

var siteRouter = router();

siteRouter.get('/', function *() {
    var query = this.query;
    if (query.hasOwnProperty('url')) {
        var url = query['url'];
        this.body = yield screenshot(url);
    }
});

app.use(siteRouter.routes());
app.use(siteRouter.allowedMethods());

var server = app.listen(3000, function () {
    console.log('Successfully started up on port 3000');
});