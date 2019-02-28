import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    ws: WebSocket;

    constructor() {
    }

    createObservableSocket(url: string, id: number): Observable<any> {
        this.ws = new WebSocket(url); // 去连接url的服务器
        /* 响应式编程Observable 三步走 */
        return new Observable<string>(
            observer => {
                this.ws.onmessage = ev => observer.next(ev.data); // 1. 当ws收到消息时发射数据
                this.ws.onerror = err => observer.error(err); // 2. 处理异常
                this.ws.onclose = () => observer.complete(); // 3. 完成操作
                this.ws.onopen = ev => this.sendMessage({productId: id}); // ws打开连接时操作
                return () => this.ws.close(); // 取消订阅时断开ws连接
            }
        ).pipe(
            map(message => JSON.parse(message))
        );
    }

    sendMessage(message: any) {
        this.ws.send(JSON.stringify(message));
    }
}
