export function getStartOfWeek(date: Date): Date {
	const d = new Date(date);
	const dayOfWeek = d.getDay();
	d.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek));
	return d;
}