"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var app = express();
var Product = /** @class */ (function () {
    function Product(id, title, price, rating, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
var products = [
    new Product(1, '第一个商品', 1.99, 3.5, '这是第一个商品', ['电子产品', '硬件设备']),
    new Product(2, '第二个商品', 2.99, 2.5, '这是第二个商品', ['硬件设备']),
    new Product(3, '第三个商品', 3.99, 4.5, '这是第三个商品', ['电子产品', '硬件设备']),
    new Product(4, '第四个商品', 4.99, 1.5, '这是第四个商品', ['电子产品', '硬件设备']),
    new Product(5, '第五个商品', 5.99, 3.5, '这是第五个商品', ['电子产品']),
    new Product(6, '第六个商品', 6.99, 2.5, '这是第六个商品', ['图书'])
];
var Comment = /** @class */ (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var comments = [
    new Comment(1, 1, '2019-01-28 22:40:20', '张三', 3, '东西不错'),
    new Comment(2, 1, '2019-01-27 22:50:20', '李四', 4, '东西是不错'),
    new Comment(3, 1, '2019-01-26 22:30:20', '王五', 2, '东西发不错'),
    new Comment(4, 2, '2019-01-25 22:40:40', '赵六', 4, '东西个不错')
];
app.get('/', function (req, res) {
    res.send('Hello Express');
});
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) != -1; });
    }
    if (params.price && params.price !== 'null' && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    if (params.category && params.category !== '-1' && result.length > 0) {
        result = result.filter(function (p) { return p.category.indexOf(params.category) !== -1; });
    }
    res.json(result);
});
app.get('/api/products/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/products/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, 'localhost', function () {
    console.log('服务器已启动， 地址：http:// localhost:8000');
});
var wsServer = new ws_1.Server({ port: 8085 });
var subscriptions = new Map();
wsServer.on('connection', function (webSocket) {
    // webSocket.send('这个消息是服务器主动推送的');
    webSocket.on('message', function (message) {
        var messageObj = JSON.parse(message);
        console.log(messageObj);
        var productIds = subscriptions.get(webSocket) || [];
        subscriptions.set(webSocket, productIds.concat([messageObj.productId]));
    });
});
var currentBids = new Map();
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscriptions.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
