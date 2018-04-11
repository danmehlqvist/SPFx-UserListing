/* Simple little hack. 
* For some reasons startsWith didn't work due to some bug in the TypeScript parser.
* This little function somehow side-steps that bug. Please don't ask me why :)
*/

export function homemadeStartsWith(text: string, startsWith: string): boolean {
    if (text.toUpperCase().slice(0, startsWith.length) === startsWith.toUpperCase()) {
        return true;
    }
    return false;
}
