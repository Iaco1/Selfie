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
function getStartOfWeek(date: Date): Date {
	const d = new Date(date);
	const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
	const diff = (day === 0 ? -6 : 1 - day); // Adjust so Monday is start
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0);
	return d;
}

// Converts Date → 'YYYY-MM-DDTHH:mm'
function toLocal(date: Date): string {
	const y = date.getFullYear();
	const m = (date.getMonth() + 1).toString().padStart(2, '0');
	const d = date.getDate().toString().padStart(2, '0');
	const hh = date.getHours().toString().padStart(2, '0');
	const mm = date.getMinutes().toString().padStart(2, '0');
	return `${y}-${m}-${d}T${hh}:${mm}`;
}

// Parses 'YYYY-MM-DDTHH:mm' as local time
function fromLocal(str: string): Date {
	const [datePart, timePart] = str.split('T');
	const [y, m, d] = datePart.split('-').map(Number);
	const [hh, mm] = timePart.split(':').map(Number);
	return new Date(y, m - 1, d, hh, mm);
}

function isSameDay(d1: Date, d2: Date): boolean {
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
}

export {toLocalDateString, fromLocalDateString, getStartOfWeek, toLocal, fromLocal, isSameDay};
