export function findAnagrams(data: string[]) {
    const map = new Map<string, Set<string>>();
    for (let str of data) {
        const sortedStr = sortString(str);
        const foundKey = map.get(sortedStr);
        if (foundKey) {
            foundKey.add(str);
            map.set(sortedStr, foundKey);
            continue;
        }
        
        map.set(sortedStr, new Set<string>([str]))
    }

    return map;
}

export function sortString(str: string): string {
    return str.split('').sort().join('')
}

