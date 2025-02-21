/* BOILERPLATE */
export const INSTRUCTION =
	"Enter a value and press Enter to proceed, or Ctrl+C to cancel";
export default function prompt(
	message,
	{
		defaultValue,
		maskChar,
		stdin = process.stdin,
		stdout = process.stdout,
	} = {},
) {
	const input = [];
	stdout.write(`${message}: `);
	if (defaultValue) {
		input.push(...defaultValue.split(""));
		let display;
		if (maskChar) {
			display = maskChar.repeat(defaultValue.length);
		} else {
			display = defaultValue;
		}
		stdout.write(display);
	}
	const oldEncoding = stdin.readableEncoding;
	const oldRawMode = stdin.isRaw;
	stdin.setEncoding("utf-8");
	stdin.setRawMode(true);
	stdin.resume();
	return new Promise((resolve, reject) => {
		function pause() {
			stdin.removeListener("data", dataHandler);
			stdin.setRawMode(oldRawMode);
			if (oldEncoding) {
				stdin.setEncoding(oldEncoding);
			}
			stdin.pause();
		}
		function dataHandler(data) {
			forLabel: for (const char of data) {
				switch (char) {
					case "\x1B": // ESCAPE CODE
						break forLabel;
					case "\x7F": // BACKSPACE
						if (input.length > 0) {
							input.pop();
							stdout.write("\b \b");
						}
						break forLabel;
					case "\x04":
					case "\r":
					case "\n": // ENTER
						pause();
						stdout.write("\n");
						resolve(input.join(""));
						break forLabel;
					case "\x03": // CNTRL+C
						pause();
						reject("Prompt interrupted by user");
						break forLabel;
					default: {
						input.push(char);
						let display;
						if (maskChar) {
							display = maskChar[0];
						} else if (maskChar !== "") {
							display = char;
						}
						if (display) {
							stdout.write(display);
						}
					}
				}
			}
		}
		stdin.on("data", dataHandler);
	});
}
export function showInstruction({ stdout = process.stdout } = {}) {
	stdout.write(`\x1B[2m${INSTRUCTION}\x1B[0m\n`);
}
