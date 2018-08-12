export class FormatUtility {
    public capitalize(name: string): string {
        const firstLetter = name.substr(0, 1).toUpperCase();
        const otherLetters = name.substr(1);
        const result = firstLetter + otherLetters;
        return result;
    }
}
