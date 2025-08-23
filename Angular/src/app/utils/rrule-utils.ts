import { RRule, rrulestr, RRuleSet, Options, Weekday } from 'rrule';

const WEEKDAY_MAP: { [key: string]: Weekday } = {
	MO: RRule.MO,
	TU: RRule.TU,
	WE: RRule.WE,
	TH: RRule.TH,
	FR: RRule.FR,
	SA: RRule.SA,
	SU: RRule.SU
};

const FREQ_MAP = {
	daily: RRule.DAILY,
	weekly: RRule.WEEKLY,
	monthly: RRule.MONTHLY,
	yearly: RRule.YEARLY
} as const;

type FrequencyKey = keyof typeof FREQ_MAP; // "daily" | "weekly" | "monthly" | "yearly"

//GENERATE
export interface RepeatInput {
	startDate: string; // e.g. "2025-08-12"
	startTime: string; // e.g. "18:00"
	frequency: FrequencyKey;
	interval: number;
	repeatEndMode: 'never' | 'after' | 'until';
	count?: number;
	until?: string; // e.g. "2025-09-12"
	byweekday?: string[];
	bysetpos?: number[];
}

export function generateRRuleFromInput(input: RepeatInput): string | null {
	try {
		const dateTimeString = `${input.startDate}T${input.startTime}`;
		const dtstart = new Date(dateTimeString); // local time
		//console.log("dtstart: ", dtstart);

		const options: Partial<Options> = {
			dtstart,
			freq: FREQ_MAP[input.frequency],
			interval: input.interval || 1,
		};

		if (input.repeatEndMode === 'after') {
			options.count = input.count;
		} else if (input.repeatEndMode === 'until' && input.until) {
			const untilDate = new Date(input.until + 'T23:59:59');
			options.until = untilDate;
		}

		if (input.frequency === 'monthly' && input.byweekday?.length && input.bysetpos?.length) {
			options.byweekday = input.byweekday.flatMap((day: string) =>
				input.bysetpos!.map(pos => WEEKDAY_MAP[day].nth(pos))
			);
		}

		const rrule = new RRule(options);

		const pad = (n: number) => n.toString().padStart(2, '0');
		const dtDate = `${dtstart.getFullYear()}${pad(dtstart.getMonth() + 1)}${pad(dtstart.getDate())}`;
		const dtTime = `${pad(dtstart.getHours())}${pad(dtstart.getMinutes())}${pad(dtstart.getSeconds())}`;
		const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const dtstartStr = `DTSTART;TZID=${userTimeZone}:${dtDate}T${dtTime}`;

		const fullRRule = `${dtstartStr}\n${rrule.toString().split('\n').filter(l => !l.startsWith('DTSTART')).join('\n')}`;

		// Validate
		rrulestr(fullRRule);

		return fullRRule;
	} catch (e) {
		console.error("Error generating RRule:", e);
		return null;
	}
}

//PARSE
export interface ParsedRRule {
	startDate: string; // "YYYY-MM-DD"
	startTime: string; // "HH:MM"
	frequency: string;
	interval: number;
	count?: number;
	until?: string;
	byweekday: string[];
	bysetpos: number[];
}

export function parseRRule(rruleString: string): ParsedRRule | null {
	try {
		const rule = rrulestr(rruleString, { forceset: true }) as RRuleSet;
		const r = rule.rrules()[0];
		const options = r.origOptions;

		const frequency = Object.entries(FREQ_MAP).find(([_, val]) => val === options.freq)?.[0];
		const interval = options.interval ?? 1;
		const count = typeof options.count === 'number' ? options.count : undefined;
		let until: string | undefined;

		if (options.until instanceof Date) {
			const pad = (n: number) => n.toString().padStart(2, '0');
			until = `${options.until.getFullYear()}-${pad(options.until.getMonth() + 1)}-${pad(options.until.getDate())}`;
		}

		const dtstartLine = rruleString.split('\n').find(l => l.startsWith('DTSTART'));
		let startDate = '';
		let startTime = '';

		if (dtstartLine) {
			let match = dtstartLine.match(/DTSTART(?:;TZID=[^:]+)?:([0-9T]+)/);
			if (match) {
				const raw = match[1]; // e.g. '20250812T180000'
				startDate = `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`;
				startTime = `${raw.slice(9,11)}:${raw.slice(11,13)}`;
			}
		}

		const byweekday: string[] = [];
		const bysetpos: number[] = [];

		if (Array.isArray(options.byweekday)) {
			for (const wd of options.byweekday) {
				if (typeof wd === 'object' && wd.weekday !== undefined) {
					const dayKey = Object.keys(WEEKDAY_MAP).find(key => WEEKDAY_MAP[key].weekday === wd.weekday);
					if (dayKey) {
						if (!byweekday.includes(dayKey)) byweekday.push(dayKey);
						if (typeof wd.n === 'number' && !bysetpos.includes(wd.n)) bysetpos.push(wd.n);
					}
				} else if (typeof wd === 'number') {
					const dayKey = Object.keys(WEEKDAY_MAP).find(key => WEEKDAY_MAP[key].weekday === wd);
					if (dayKey && !byweekday.includes(dayKey)) byweekday.push(dayKey);
				}
			}
		}

		return {
			startDate,
			startTime,
			frequency: frequency || 'daily',
			interval,
			count,
			until,
			byweekday,
			bysetpos,
		};
	} catch (e) {
		console.error("Failed to parse rrule:", e);
		return null;
	}
}

/*
import { generateRRuleFromInput, parseRRule } from '@/utils/rrule-utils';

// Example usage:
const rrule = generateRRuleFromInput({
	startDate: this.me.start.date,
	startTime: this.me.start.time,
	frequency: this.frequency,
	interval: this.interval,
	repeatEndMode: this.repeatEndMode,
	count: this.count,
	until: this.until,
	byweekday: this.byweekday,
	bysetpos: this.bysetpos,
});

if (rrule) {
	this.me.repeat.rrule = rrule;
} else {
	alert("Invalid recurrence rule");
}
*/
