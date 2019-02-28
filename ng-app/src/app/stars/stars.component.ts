import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
    selector: 'app-stars',
    templateUrl: './stars.component.html',
    styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit, OnChanges {

    @Input()
    public rating = 0;

    @Output()
    private ratingChange: EventEmitter<number> = new EventEmitter();

    public stars: boolean[];

    @Input()
    public readonly = true;

    constructor() {
    }

    ngOnInit() {
    }

    clickStar(idx: number) {
        if (!this.readonly) {
            this.rating = idx + 1;
            this.ratingChange.emit(this.rating);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.stars = [];
        for (let i = 1; i <= 5; i++) {
            this.stars.push(i > this.rating);
        }
    }

}
