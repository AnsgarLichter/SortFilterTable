export default class Comparator {
    public static compareStrings = (a: string, b: string): number => {
        return a.localeCompare(b);
    }

    public static compareNumbers = (a: number, b: number): number => {
        return a - b;
    }

    public static compareDate = (a: Date, b: Date) => {
        return a.getTime() - b.getTime();
    }
}