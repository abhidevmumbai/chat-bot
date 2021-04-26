import * as readline from 'readline';

export class Prompt {
    interface: any;

    constructor() {
        this.interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    close() {
        this.interface.close();
    }

    write(phrase) {
        console.log(phrase);
    }

    question(phrase: string): Promise<string> {
        return new Promise((resolve) => {
            this.interface.question(`${phrase}\r\n> `, (answer) =>
                resolve(answer)
            );
        });
    }
}

export const PromptService = new Prompt();
