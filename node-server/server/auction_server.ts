import * as express from 'express'
import { Server } from 'ws'

const app = express();

class Product {
    constructor(
        public id: number,
        public title: string,
        public price: number,
        public rating: number,
        public desc: string,
        public categories: Array<string>
    ) {
    }
}

const products: Product[] = [
    new Product(1, '第一个商品', 1.99, 3.5, '这是第一个商品', ['电子产品', '硬件设备']),
    new Product(2, '第二个商品', 2.99, 2.5, '这是第二个商品', ['硬件设备']),
    new Product(3, '第三个商品', 3.99, 4.5, '这是第三个商品', ['电子产品', '硬件设备']),
    new Product(4, '第四个商品', 4.99, 1.5, '这是第四个商品', ['电子产品', '硬件设备']),
    new Product(5, '第五个商品', 5.99, 3.5, '这是第五个商品', ['电子产品']),
    new Product(6, '第六个商品', 6.99, 2.5, '这是第六个商品', ['图书'])
];

export class Comment {
    constructor(
        public id: number,
        public productId: number,
        public timestamp: string,
        public user: string,
        public rating: number,
        public content: string
    ) {
    }
}

const comments: Comment[] = [
    new Comment(1, 1, '2019-01-28 22:40:20', '张三', 3, '东西不错'),
    new Comment(2, 1, '2019-01-27 22:50:20', '李四', 4, '东西是不错'),
    new Comment(3, 1, '2019-01-26 22:30:20', '王五', 2, '东西发不错'),
    new Comment(4, 2, '2019-01-25 22:40:40', '赵六', 4, '东西个不错')
];


app.get('/', function (req, res) {
    res.send('Hello Express');
});
app.get('/api/products', function (req, res) {
    let result = products;
    let params = req.query;

    if (params.title) {
        result = result.filter(p => p.title.indexOf(params.title) != -1);
    }

    if (params.price && params.price !== 'null' && result.length > 0) {
        result = result.filter(p => p.price <= parseInt(params.price));
    }

    if (params.category && params.category !== '-1' && result.length > 0) {
        result = result.filter(p => p.category.indexOf(params.category) !== -1);
    }
    res.json(result);
});
app.get('/api/products/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/products/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});

const server = app.listen(8000, 'localhost', () => {
    console.log('服务器已启动， 地址：http:// localhost:8000')
})

const wsServer = new Server({ port: 8085 });
const subscriptions = new Map<any, number[]>();

wsServer.on('connection', webSocket => {
    // webSocket.send('这个消息是服务器主动推送的');
    webSocket.on('message', message => {
        let messageObj = JSON.parse(message);
        console.log(messageObj)
        let productIds = subscriptions.get(webSocket) || [];
        subscriptions.set(webSocket, [...productIds, messageObj.productId]);
    })
});

const currentBids = new Map<number, number>();

setInterval(() => {
    products.forEach(p => {
        let currentBid = currentBids.get(p.id) || p.price;
        let newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    })

    subscriptions.forEach((productIds: number[], ws) => {
        if(ws.readyState === 1) {
            let newBids = productIds.map(pid => ({
                productId: pid,
                bid: currentBids.get(pid)
            }));
            ws.send(JSON.stringify(newBids));
        } else {
            subscriptions.delete(ws);
        }
    })

}, 2000);
