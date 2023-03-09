import DateType from "sap/ui/model/type/Date";

export default class Comparator {
    public static compareStrings = (a: string, b: string): number => {
        return a.localeCompare(b);
    }

    public static compareNumbers = (a: number, b: number): number => {
        return a - b;
    }

    public static compareDateStrings = (a: string, b: string): number => {
        const type = new DateType({
            source: {
                pattern: "dd.MM.yyyy" //TODO: How to set source format externally
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pattern: "yyyy-MM-dd"
        });
        const aDate = new Date(type.formatValue(a, typeof a) as string);
        const bDate = new Date(type.formatValue(b, typeof b) as string);

        return aDate.getTime() - bDate.getTime();
    }
}