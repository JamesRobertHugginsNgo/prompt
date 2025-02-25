export const INSTRUCTION = 'Enter a value and press Enter to proceed, or Ctrl+C to cancel';

export default function prompt(message: string, {
	defaultValue,
	maskChar,
	stdin = process.stdin,
	stdout = process.stdout
}: {
	defaultValue?: string,
	maskChar?: string,
	stdin?: NodeJS.ReadStream,
	stdout?: NodeJS.WriteStream
} = {}): Promise<string> {
	const input: Array<string> = [];

	stdout.write(`${message}: `);
	if (defaultValue) {
		input.push(...defaultValue.split(''));

		let display: string;
		if (maskChar) {
			display = maskChar.repeat(defaultValue.length);
		} else {
			display = defaultValue;
		}
		stdout.write(display);
	}

	const oldEncoding: BufferEncoding | null = stdin.readableEncoding;
	const oldRawMode: boolean = stdin.isRaw;
	stdin.setEncoding('utf-8');
	stdin.setRawMode(true);
	stdin.resume();

	return new Promise((
		resolve: (value: string) => void,
		reject: (value: string) => void
	): void => {
		function pause(): void {
			stdin.removeListener('data', dataHandler);
			stdin.setRawMode(oldRawMode);
			if (oldEncoding) {
				stdin.setEncoding(oldEncoding);
			}
			stdin.pause();
		}

		function dataHandler(data: string): void {
			forLabel: for (const char of data) {
				switch (char) {
					case '\x1B': // ESCAPE CODE
						break forLabel;
					case '\x7F': // BACKSPACE
						if (input.length > 0) {
							input.pop();
							stdout.write('\b \b');
						}
						break forLabel;
					case '\x04':
					case '\r':
					case '\n': // ENTER
						pause();
						stdout.write('\n');
						resolve(input.join(''));
						break forLabel;
					case '\x03': // CNTRL+C
						pause();
						reject('Prompt interrupted by user');
						break forLabel;
					default: {
						input.push(char);
						let display: string | undefined;
						if (maskChar) {
							display = maskChar[0];
						} else if (maskChar !== '') {
							display = char;
						}
						if (display) {
							stdout.write(display);
						}
					}
				}
			}
		}
		stdin.on('data', dataHandler);
	});
}

export function showInstruction({
	stdout = process.stdout
}: {
	stdout?: NodeJS.WriteStream
} = {}): void {
	stdout.write(`\x1B[2m${INSTRUCTION}\x1B[0m\n`);
}
