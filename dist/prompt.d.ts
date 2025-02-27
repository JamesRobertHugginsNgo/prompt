export declare const INSTRUCTION: string;
export default function prompt(
	message: string,
	{
		defaultValue,
		maskChar,
		stdin,
		stdout,
	}?: {
		defaultValue?: string;
		maskChar?: string;
		stdin?: NodeJS.ReadStream;
		stdout?: NodeJS.WriteStream;
	},
): Promise<string>;
export declare function showInstruction({
	stdout,
}?: {
	stdout?: NodeJS.WriteStream;
}): void;
