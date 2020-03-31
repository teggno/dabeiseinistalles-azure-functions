export function groupBy<T>(array: T[], keyExtractor: (item: T) => string) {
  return array.reduce((prev, current) => {
    const key = keyExtractor(current);
    let group = prev[key];
    if (group) {
      group.push(current);
    } else {
      group = [current];
      prev[key] = group;
    }
    return prev;
  }, {} as { [key: string]: T[] });
}

export function arrayToMap<T>(array: T[], keyExtractor: (item: T) => string) {
  return array.reduce((prev, current) => {
    prev[keyExtractor(current)] = current;
    return prev;
  }, {} as { [key: string]: T });
}
