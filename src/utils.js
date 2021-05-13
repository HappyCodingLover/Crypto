export const getShortNumber = (number, decimal) => {
    if (number > 100000000) return `${(number / 1000000000).toFixed(decimal)}b`
    if (number > 100000) return `${(number / 1000000).toFixed(decimal)}m`
    if (number > 100) return `${(number / 1000).toFixed(decimal)}k`
    return number
}
export const checkMobile = () =>{
    return document.documentElement.offsetWidth <= 600;

}
