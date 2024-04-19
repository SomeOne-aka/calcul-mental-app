function uniqueid(digits) {
    let time = new Date().getTime()
    let randomNumber = Math.floor((Math.random() * 100000 + 100))
    let uniqueNumber = time * randomNumber
    let hexuuiStr = uniqueNumber.toString(16).toString().substring(0, digits)

    return hexuuiStr
}
