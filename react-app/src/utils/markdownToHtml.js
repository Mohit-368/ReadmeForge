// Markdown → HTML converter — 

export const BADGE_COLORS = {
  brightgreen: '#22c55e', green: '#22c55e', yellowgreen: '#84cc16',
  yellow: '#eab308', orange: '#f97316', red: '#ef4444', blue: '#3b82f6',
  lightgrey: '#94a3b8', grey: '#64748b', gray: '#64748b',
  blueviolet: '#8b5cf6', ff69b4: '#ec4899',
};

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function shieldToBadge(label, url) {
  var isShield = url.indexOf('shields.io') !== -1;
  if (!isShield)
    return '<span class="gh-badge" style="background:#555;color:#fff">' + label + '</span>';
  var color = '#555', left = label || '', right = '', m;
  m = url.match(/\/badge\/([^?]+)/);
  if (m) {
    var parts = m[1].split('-');
    if (parts.length >= 3) {
      right = parts[parts.length - 2];
      var col = parts[parts.length - 1].split('?')[0];
      color = BADGE_COLORS[col] || '#' + col;
      left = parts.slice(0, parts.length - 2).join(' ').replace(/_/g, ' ');
    } else if (parts.length === 2) {
      right = parts[1].split('?')[0];
      color = '#22c55e';
      left = parts[0].replace(/_/g, ' ');
    } else {
      left = parts[0].replace(/_/g, ' ');
      color = '#3b82f6';
    }
  }
  if (!m) {
    if (url.indexOf('/github/stars') !== -1) { left = 'Stars'; right = '★'; color = '#f59e0b'; }
    else if (url.indexOf('/github/forks') !== -1) { left = 'Forks'; right = '⑂'; color = '#8b5cf6'; }
    else if (url.indexOf('/github/issues') !== -1) { left = 'Issues'; right = '●'; color = '#ef4444'; }
    else { left = label; color = '#3b82f6'; }
  }
  left = decodeURIComponent(left).replace(/\+/g, ' ');
  right = decodeURIComponent(right).replace(/\+/g, ' ');
  return (
    '<span class="gh-badge"><span class="gh-badge-left">' + left + '</span>' +
    (right ? '<span class="gh-badge-right" style="background:' + color + '">' + right + '</span>' : '') +
    '</span>'
  );
}

export function md2html(md) {
  var h = md;
  h = h.replace(/```(\w*)\n([\s\S]*?)```/g, function (_, lang, code) {
    return '<pre><code>' + esc(code) + '</code></pre>';
  });
  h = h.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  h = h.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  h = h.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/__(.+?)__/g, '<strong>$1</strong>');
  h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
  h = h.replace(/^---$/gm, '<hr>');
  // Linked badges [![alt](imgUrl)](linkUrl)
  h = h.replace(/\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g, function (_, alt, imgUrl, linkUrl) {
    return '<a href="' + linkUrl + '" target="_blank" style="text-decoration:none">' + shieldToBadge(alt, imgUrl) + '</a>';
  });
  // Unlinked images/badges
  h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, imgUrl) {
    if (imgUrl.indexOf('shields.io') !== -1) return shieldToBadge(alt, imgUrl);
    return '<img src="' + imgUrl + '" alt="' + alt + '" style="max-width:100%;border-radius:4px;margin:4px 0">';
  });
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  h = h.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  h = h.replace(/((\|.+\|\n)+)/g, function (table) {
    var rows = table.trim().split('\n');
    var out = '<table>';
    rows.forEach(function (row, i) {
      if (row.match(/^\|[-| :]+\|$/)) return;
      var cells = row.split('|').filter(function (c, idx, a) { return idx > 0 && idx < a.length - 1; });
      var tag = i === 0 ? 'th' : 'td';
      out += '<tr>' + cells.map(function (c) { return '<' + tag + '>' + c.trim() + '</' + tag + '>'; }).join('') + '</tr>';
    });
    return out + '</table>';
  });
  h = h.replace(/^- (.+)$/gm, '<li>$1</li>');
  h = h.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  h = h.replace(/(<li>[\s\S]*?<\/li>)/g, function (m) { return '<ul>' + m + '</ul>'; });
  h = h.split('\n\n').map(function (block) {
    if (/^<(h[1-6]|ul|ol|li|pre|blockquote|hr|table)/.test(block.trim())) return block;
    return '<p>' + block.replace(/\n/g, ' ') + '</p>';
  }).join('\n');
  return h;
}
