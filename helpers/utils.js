export function cleanString(str){
    return str.replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
export function containsObject(obj, array) {
    let i;
    for (i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}
