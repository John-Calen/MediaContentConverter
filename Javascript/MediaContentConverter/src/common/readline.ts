import readline, { ReadLineOptions } from 'readline';
import { Interface } from 'readline';

declare module "readline"
{
    export interface Interface
    {
        questionAsync(text: string): Promise<string>
    }
}

function questionAsync(this: Interface, text: string): Promise<string>
{
    let promise = new Promise<string>
    (
        (resolve: (payload: string) => void) => 
            this.question(text, (answer) => { resolve(answer) })
    );

    return promise;
}

readline.Interface.prototype.questionAsync = questionAsync;

export { };