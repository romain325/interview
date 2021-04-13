const sleep = ms => new Promise(res => setTimeout(res, ms));
const display = (forest) => {
    forest.forEach(sub => console.log(sub.join()))
}

module.exports = {
    sleep,
    display
}