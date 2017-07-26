/**
 * Takes an array of objects along with two parameter key names and returns the array with keys renamed x and y 
 * @param {Object[]} data - Array of objects. Standard d3 data format. 
 * @param {string} xKey - name of the x column
 * @param {string} yKey - name of the y column
 * @return {Object[]} - Array of objects just as before but now with x and y as column names
 */
export function SimplifyData(data, xKey, yKey) {
  return data.map((d) => {
    const {[xKey]: x, [yKey]: y, ...rest} = d;
    return Object.assign(rest, {x, y});
  });
}
