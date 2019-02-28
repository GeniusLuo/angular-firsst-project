import {Component, OnInit} from '@angular/core';
import {Product, ProductService} from '../shared/product.service';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

    public products: Observable<Product[]>;

    /* private keyword: string;

     public titleFilter: FormControl = new FormControl();*/

    public imgUrl = 'http://placehold.it/320x150';

    constructor(private productService: ProductService) {
        /*this.titleFilter.valueChanges
            .pipe(debounceTime(500))
            .subscribe(
                value => this.keyword = value
            );*/
    }

    ngOnInit() {
        this.products = this.productService.getProducts();

        this.productService.searchEvent.subscribe(
            params => this.products = this.productService.search(params)
        );
    }

}

