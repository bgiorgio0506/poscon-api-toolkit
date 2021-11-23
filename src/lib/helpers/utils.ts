
export function filterByRules(filterOptions: Object, array: Array<any>): Array<any> {
    let resultArray = [];
    let filterKeys = Object.keys(filterOptions);
    for (let i= 0; i < filterKeys.length; i++) {
        if (Object.prototype.hasOwnProperty.call(filterOptions, filterKeys[i])) {
            if (Array.isArray(filterOptions[filterKeys[i]])) 
                resultArray = resultArray.concat(array.filter((item) => {
                    return filterOptions[filterKeys[i]].indexOf(item[filterKeys[i]]) > -1;
                }));
            else 
                resultArray = resultArray.concat(array.filter(item => {
                    return item[filterKeys[i]] === filterOptions[filterKeys[i]];
                }));

            return resultArray;
        } else return [];
    }
}
