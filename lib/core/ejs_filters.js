module.exports = function(ejs) {
    ejs.filters.capitalize_words = function(str) {
      str = String(str).split(" ");
      partOne = str[0][0].toUpperCase() + str[0].substr(1, str[0].length);
      partTwo = str[1][0].toUpperCase() + str[1].substr(1, str[1].length);
      return partOne + " " + partTwo;
    };
}
