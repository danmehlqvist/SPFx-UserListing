export function homemadeStartsWith(text: string, startsWith: string): boolean {
    if (text.toUpperCase().slice(0, startsWith.length) === startsWith.toUpperCase()) {
        return true;
    }
    return false;
}
