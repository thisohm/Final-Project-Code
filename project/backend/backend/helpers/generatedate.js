module.exports = generateDate = (day) => {
    let date = new Date().getTime()
    let result = new Date(date + 86400000 * day)
    return result
}
