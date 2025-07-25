export class CrudHelper<T extends { _id?: string; _tempID?: string }> {
	constructor(
		private getList: () => T[],
		private setList: (list: T[]) => void
	) {}

	private findIndex(item: T): number {
		const list = this.getList();
		return list.findIndex(e =>
			(item._tempID && e._tempID === item._tempID) ||
			(item._id && e._id === item._id)
		);
	}

	notice(item: T): void {
		const list = this.getList();
		const index = this.findIndex(item);

		if (index !== -1) {
			const updated = [...list];
			updated[index] = item;
			this.setList(updated);
		} else {
			this.setList([...list, item]);
		}
	}

	save(
		item: T,
		service: { update(id: string, data: T): any; create(data: T): any }
	): void {
		const { _tempID, ...copy } = item as any;

		const op$ = item._id
			? service.update(item._id, copy)
			: service.create(copy);

		op$.subscribe((saved: T) => {
			(saved as any)._tempID = _tempID;
			this.notice(saved);
		});
	}

	delete(
		item: T,
		service: { delete(id: string): any }
	): void {
		const list = this.getList();

		if (item._id) {
			service.delete(item._id).subscribe(() => {
				this.setList(list.filter(i => i._id !== item._id));
			});
		} else if (item._tempID) {
			this.setList(list.filter(i => i._tempID !== item._tempID));
		}
	}
}
