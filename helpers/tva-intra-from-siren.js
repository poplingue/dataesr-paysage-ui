export function getTvaIntraFromSiren(siren) {
    // if (Number.isInteger(siren) && siren.toString().length === 9) {
    return `FR${(12 + 3 * (siren % 97)) % 97}${siren}`;
    // }
    // throw new TypeError('Parameter siren must be a 9-digit number');
}
