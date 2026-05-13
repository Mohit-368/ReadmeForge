import { md2html } from './markdownToHtml';

export function copyMarkdown(currentMd, showToast) {
  if (!currentMd) { showToast('Generate content first!'); return; }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(currentMd)
      .then(() => showToast('✓ Copied to clipboard!'))
      .catch(() => fbCopy(currentMd, showToast));
  } else {
    fbCopy(currentMd, showToast);
  }
}

function fbCopy(currentMd, showToast) {
  var ta = document.createElement('textarea');
  ta.value = currentMd;
  ta.style.cssText = 'position:absolute;left:-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showToast('✓ Copied!'); }
  catch (e) { showToast('Copy failed'); }
  document.body.removeChild(ta);
}

export function downloadMd(currentMd, showToast) {
  if (!currentMd) { showToast('Nothing to download yet!'); return; }
  var blob = new Blob([currentMd], { type: 'text/markdown' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'README.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('✓ README.md downloaded!');
}

export function downloadPDF(currentMd, showToast) {
  if (!currentMd) { showToast('Nothing to download yet!'); return; }
  showToast('Opening print dialog...');
  var printIframe = document.createElement('iframe');
  printIframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:0';
  document.body.appendChild(printIframe);
  var doc = printIframe.contentWindow.document;
  var htmlContent = md2html(currentMd);
  doc.write(`<!DOCTYPE html><html><head><title>README Preview</title>
    <style>
      :root { --bg:#fff; --text:#000; --border:#e2e8f0; --surface:#fff; }
      body { background:white!important; color:black!important; padding:40px!important; font-family:sans-serif; }
      .gh-preview { max-width:900px; margin:0 auto; }
      @media print { body { padding:0!important; } .gh-preview { width:100%; } }
    </style></head><body>
    <div class="gh-preview">${htmlContent}</div>
    <script>window.onload=function(){setTimeout(function(){window.print();setTimeout(function(){window.frameElement.parentNode.removeChild(window.frameElement);},1000);},500);};<\/script>
    </body></html>`);
  doc.close();
}

export function printPreview(currentMd, showToast) {
  if (!currentMd) { showToast('Nothing to print yet!'); return; }
  showToast('Opening print preview...');
  window.print();
}
