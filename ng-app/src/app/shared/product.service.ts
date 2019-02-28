import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    /*private products: Product[] = [
        new Product(1, '第一个商品', 1.99, 3.5, '这是第一个商品', ['电子产品', '硬件设备']),
        new Product(2, '第二个商品', 2.99, 2.5, '这是第二个商品', ['硬件设备']),
        new Product(3, '第三个商品', 3.99, 4.5, '这是第三个商品', ['电子产品', '硬件设备']),
        new Product(4, '第四个商品', 4.99, 1.5, '这是第四个商品', ['电子产品', '硬件设备']),
        new Product(5, '第五个商品', 5.99, 3.5, '这是第五个商品', ['电子产品']),
        new Product(6, '第六个商品', 6.99, 2.5, '这是第六个商品', ['图书']),
    ];*/

    /*private comments: Comment[] = [
        new Comment(1, 1, '2019-01-28 22:40:20', '张三', 3, '东西不错'),
        new Comment(2, 1, '2019-01-27 22:50:20', '李四', 4, '东西是不错'),
        new Comment(3, 1, '2019-01-26 22:30:20', '王五', 2, '东西发不错'),
        new Comment(4, 2, '2019-01-25 22:40:40', '赵六', 4, '东西个不错')
    ];*/

    searchEvent: EventEmitter<ProductSearchParams> = new EventEmitter();

    constructor(private http: HttpClient) {
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>('/api/products');
    }

    getAllCategories(): string[] {
        return ['电子产品', '硬件设备', '图书'];
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>('/api/products/' + id);
    }


    getCommentsForProductId(id: number): Observable<Comment[]> {
        return this.http.get<Comment[]>('/api/products/' + id + '/comments');
    }

    search(params: ProductSearchParams): Observable<Product[]> {
        // @ts-ignore
        return this.http.get<Product[]>('/api/products?', {params: params});
    }
}

export class ProductSearchParams {
    constructor(
        public title: string,
        public price: number,
        public category: string
    ) {
    }

}

export class Product {
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
