import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export abstract class BaseService<T> {
	constructor(
		protected http: HttpClient,
		protected baseURL: string,
		protected transformFn: (item: any) => T
	) {}

	create(item: Partial<T>): Observable<T> {
		return this.http.post<{ message: string; result: any }>(this.baseURL, item)
			.pipe(map(res => this.transformFn(res.result)));
	}

	getAll(query: string = ""): Observable<T[]> {
		return this.http.get<{ message: string; result: any[] }>(this.baseURL + query)
			.pipe(map(res => res.result.map(this.transformFn)));
	}

	getById(id: string): Observable<T> {
		return this.http.get<{ message: string; result: any }>(`${this.baseURL}/${id}`)
			.pipe(map(res => this.transformFn(res.result)));
	}

	update(id: string, item: Partial<T>): Observable<T> {
		return this.http.put<{ message: string; result: any }>(`${this.baseURL}/${id}`, item)
			.pipe(map(res => this.transformFn(res.result)));
	}

	delete(id: string): Observable<any> {
		return this.http.delete(`${this.baseURL}/${id}`);
	}
}
