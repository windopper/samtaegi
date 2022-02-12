

function positive(message) {
    return (
        `:white_check_mark: ${message}`
    )
}

function negative(message) {
    return (
        `:x: ${message}`
    )
}

module.exports = {
    positive: positive,
    negative: negative
}