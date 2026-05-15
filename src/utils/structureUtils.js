export function convertStructure(raw, projName = 'project') {
  if (!raw.trim()) return '';
  const lines = raw.split('\n');
  const result = ['📦 ' + projName];

  function getDepth(line) {
    const m = line.match(/^(\s*)/);
    return m ? Math.floor(m[1].length / 2) : 0;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    if (!line.trim()) continue;
    const depth = getDepth(line);
    const name = line.trim();
    const isDir = name.endsWith('/');
    const cleanName = name.replace(/\/$/, '');

    let isLast = true;
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].trim() && getDepth(lines[j]) === depth) { isLast = false; break; }
      if (lines[j].trim() && getDepth(lines[j]) < depth) break;
    }

    let prefix = '';
    for (let d = 0; d < depth; d++) {
      let parentIsLast = true;
      for (let k = i - 1; k >= 0; k--) {
        if (lines[k].trim() && getDepth(lines[k]) === d) {
          for (let l = i + 1; l < lines.length; l++) {
            if (lines[l].trim() && getDepth(lines[l]) === d) { parentIsLast = false; break; }
            if (lines[l].trim() && getDepth(lines[l]) < d) break;
          }
          break;
        }
      }
      prefix += parentIsLast ? '   ' : ' ┃ ';
    }

    const symbol = isLast ? ' ┗ ' : ' ┣ ';
    const icon = isDir ? '📂 ' : '📜 ';
    result.push(prefix + symbol + icon + cleanName);
  }
  return result.join('\n');
}
