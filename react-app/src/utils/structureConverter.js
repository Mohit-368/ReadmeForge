// Structure tree converter — 

export function convertStructure(raw, projectName) {
  if (!raw.trim()) return '';
  var lines = raw.split('\n');
  var result = [];
  result.push('📦 ' + (projectName || 'project'));

  function getDepth(line) {
    var m = line.match(/^(\s*)/);
    return m ? Math.floor(m[1].length / 2) : 0;
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trimEnd();
    if (!line.trim()) continue;
    var depth = getDepth(line);
    var name = line.trim();
    var isDir = name.endsWith('/');
    var cleanName = name.replace(/\/$/, '');
    var isLast = true;
    for (var j = i + 1; j < lines.length; j++) {
      if (lines[j].trim() && getDepth(lines[j]) === depth) { isLast = false; break; }
      if (lines[j].trim() && getDepth(lines[j]) < depth) break;
    }
    var prefix = '';
    for (var d = 0; d < depth; d++) {
      var parentIsLast = true;
      for (var k = i - 1; k >= 0; k--) {
        if (lines[k].trim() && getDepth(lines[k]) === d) {
          for (var l = i + 1; l < lines.length; l++) {
            if (lines[l].trim() && getDepth(lines[l]) === d) { parentIsLast = false; break; }
            if (lines[l].trim() && getDepth(lines[l]) < d) break;
          }
          break;
        }
      }
      prefix += parentIsLast ? '   ' : ' ┃ ';
    }
    var symbol = isLast ? ' ┗ ' : ' ┣ ';
    var icon = isDir ? '📂 ' : '📜 ';
    result.push(prefix + symbol + icon + cleanName);
  }
  return result.join('\n');
}
