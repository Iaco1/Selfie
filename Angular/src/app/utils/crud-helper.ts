export class CrudHelper<T extends { _id?: string; _tempID?: string }> {
	constructor(
		private list: T[],
		private setList: (list: T[]) => void
	) {}

	notice(item: T): void {
		const i = this.list.findIndex(e =>
			(item._tempID && e._tempID === item._tempID) ||
			(item._id && e._id === item._id)
		);
		if (i !== -1) {
			this.list[i] = item;
			this.setList([...this.list]);
		} else {
			this.setList([...this.list, item]);
		}
	}

	save(
		item: T,
		service: { update(id: string, data: T): any; create(data: T): any }
	): void {
		const { _tempID, ...copy } = item as any;

		const op$ = item._id ? service.update(item._id, copy) : service.create(copy);
		op$.subscribe((saved: T) => {
			(saved as any)._tempID = _tempID;
			this.notice(saved);
		});
	}

	delete(
		item: T,
		service: { delete(id: string): any }
	): void {
		if (item._id) {
			service.delete(item._id).subscribe(() => {
				this.setList(this.list.filter(i => i._id !== item._id));
			});
		} else if (item._tempID) {
			this.setList(this.list.filter(i => i._tempID !== item._tempID));
		}
	}
}
