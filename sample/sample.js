import prompt, { INSTRUCTION, showInstruction } from '../dist/prompt.js';

console.log(INSTRUCTION);

showInstruction();
const userName = await prompt('User Name', { defaultValue: 'user', stdout: process.stderr });
const password = await prompt('Password', { maskChar: '*' });

console.log('\nUSER NAME', userName, 'PASSWORD', password);
