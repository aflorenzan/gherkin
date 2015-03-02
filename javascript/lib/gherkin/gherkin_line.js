var GherkinLineSpan = require('./gherkin_line_span');

function GherkinLine(lineText, lineNumber) {
  this.lineText = lineText;
  this.lineNumber = lineNumber;
  this.trimmedLineText = lineText.replace(/^\s+/g, ''); // ltrim
  this.isEmpty = this.trimmedLineText.length == 0;
  this.indent = lineText.length - this.trimmedLineText.length;
};

GherkinLine.prototype.startsWith = function startsWith(prefix) {
  return this.trimmedLineText.indexOf(prefix) == 0;
};

GherkinLine.prototype.startsWithTitleKeyword = function startsWithTitleKeyword(keyword) {
  return this.startsWith(keyword+':'); // The C# impl is more complicated. Find out why.
};

GherkinLine.prototype.getLineText = function getLineText(indentToRemove) {
  if (indentToRemove < 0 || indentToRemove > this.indent) {
    return this.trimmedLineText;
  } else {
    return this.lineText.substring(indentToRemove);
  }
};

GherkinLine.prototype.getRestTrimmed = function getRestTrimmed(length) {
  return this.trimmedLineText.substring(length).trim();
};

GherkinLine.prototype.getTableCells = function getTableCells() {
  var column = this.indent + 1;
  var items = this.trimmedLineText.split('|');
  items.shift(); // Skip the beginning of the line
  items.pop(); // Skip the one after the last pipe
  return items.map(function (item) {
    var cellIndent = item.length - item.replace(/^\s+/g, '').length + 1;
    var span = new GherkinLineSpan(column + cellIndent, item.trim());
    column += item.length + 1;
    return span;
  });
};

module.exports = GherkinLine;
