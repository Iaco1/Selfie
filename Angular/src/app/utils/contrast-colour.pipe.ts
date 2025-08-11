import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'contrastColour',
	pure: true // this is default, pipe output cached unless input changes
})
export class ContrastColourPipe implements PipeTransform {

	transform(color: string): string {
		if (!color) { return 'black'; } // fallback
		// Create canvas
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = 1;
		const ctx = canvas.getContext('2d');

		if (!ctx) { return 'black'; } // fallback

		// Fill with given color
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, 1, 1);

		// Get pixel color data
		const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

		//debugging
		//if (!this.hasLogged) { console.log('rgb', color, `→ rgb(${r}, ${g}, ${b})`); this.hasLogged = true;	}

		// Calculate relative luminance
		const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

		// Return black for light backgrounds, white for dark
		return luminance > 128 ? 'black' : 'white';
	}
}
