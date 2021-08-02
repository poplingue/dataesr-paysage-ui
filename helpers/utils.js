export default function cleanString(str){
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}