export default class Spliterator {
    static split<T>(entries: Array<T>, chunkSize: number): Array<Array<T>> {
        let index = 0;
        let tempArray = [];

        for (index; index < entries.length; index += chunkSize)
            tempArray.push(entries.slice(index, index + chunkSize));
        return tempArray;
    }
}