let date = new Date();
let year = date.getFullYear();

if (date.getMonth() < 6) {
    year--;
}

module.exports = year;