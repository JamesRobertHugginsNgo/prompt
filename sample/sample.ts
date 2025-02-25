import prompt, { INSTRUCTION, showInstruction } from '../dist/prompt';

console.log(INSTRUCTION);

showInstruction();
const userName: string = await prompt('User Name', { defaultValue: 'user', stdout: process.stderr });
const password: string = await prompt('Password', { maskChar: '*' });

console.log('\nUSER NAME', userName, 'PASSWORD', password);
