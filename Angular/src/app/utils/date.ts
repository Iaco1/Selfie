function toLocalDateString(date: Date): string {
	const y = date.getFullYear();
	const m = (date.getMonth() + 1).toString().padStart(2, '0');
	const d = date.getDate().toString().padStart(2, '0');
	return `${y}-${m}-${d}`;
}
function fromLocalDateString(dateStr: string): Date {
	const [y, m, d] = dateStr.split('-').map(Number);
	return new Date(y, m - 1, d); // local midnight
}
function getStartOfWeek(day: Date): Date {
	const d = new Date(day);
	const dayOfWeek = d.getDay();
	d.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek));
	return d;
}
export {toLocalDateString, fromLocalDateString, getStartOfWeek};
