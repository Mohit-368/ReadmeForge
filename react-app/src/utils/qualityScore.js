// Quality score calculator — 
// Receives state object instead of reading from DOM

export function calculateQuality(state) {
  const { fields, sections, selectedTechs, selectedBadges, screenshots, license } = state;
  const f = (id) => (fields[id] || '').trim();

  var score = 0;
  var suggestions = [];

  // Project name (10 pts)
  if (f('projName')) { score += 10; }
  else { suggestions.push({ icon: '📌', text: 'Add a project name to identify your project.' }); }

  // Tagline (5 pts)
  if (f('tagline')) { score += 5; }
  else { suggestions.push({ icon: '💬', text: 'Add a tagline — a one-line summary of what your project does.' }); }

  // GitHub user + repo (5 pts)
  if ((f('ghUser') || f('authorGh')) && f('repoSlug')) { score += 5; }
  else { suggestions.push({ icon: '🔗', text: 'Fill in your GitHub username and repository name for accurate badge links.' }); }

  // Description (15 pts — tiered by word count)
  var desc = f('description');
  var descWords = desc ? desc.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
  if (descWords >= 30) { score += 15; }
  else if (descWords >= 15) { score += 8; suggestions.push({ icon: '📋', text: 'Expand your description to at least 30 words for a better explanation.' }); }
  else if (descWords > 0) { score += 3; suggestions.push({ icon: '📋', text: 'Your description is very short. Aim for at least 30 words.' }); }
  else { suggestions.push({ icon: '📋', text: 'Add a description explaining what your project does and the problem it solves.' }); }

  // Features (15 pts)
  var features = f('features');
  if (sections['features'] && features && features.trim().length > 20) { score += 15; }
  else if (sections['features'] && features && features.trim().length > 0) { score += 7; suggestions.push({ icon: '✨', text: 'Expand the Features section with more detail.' }); }
  else { suggestions.push({ icon: '✨', text: 'Enable and fill in the Features section to highlight what makes your project stand out.' }); }

  // Tech stack (10 pts)
  var customTech = f('customTech');
  var totalTechs = selectedTechs.size + (customTech ? customTech.split(',').filter(t => t.trim()).length : 0);
  if (totalTechs >= 3) { score += 10; }
  else if (totalTechs >= 1) { score += 5; suggestions.push({ icon: '🛠️', text: 'Select at least 3 technologies in the Tech Stack section.' }); }
  else { suggestions.push({ icon: '🛠️', text: 'Select your tech stack — let readers know what technologies power your project.' }); }

  // Installation (10 pts)
  if (sections['installation'] && f('installCmds')) { score += 10; }
  else if (sections['installation']) { score += 4; suggestions.push({ icon: '🚀', text: 'Add installation commands so others can easily set up your project.' }); }
  else { suggestions.push({ icon: '🚀', text: 'Enable the Installation section and add setup commands.' }); }

  // Usage (5 pts)
  if (sections['installation'] && f('usageCmd')) { score += 5; }
  else { suggestions.push({ icon: '💻', text: 'Add usage instructions or a run command to the Usage section.' }); }

  // Author info (5 pts)
  if (sections['author'] && (f('authorName') || f('authorGh'))) { score += 5; }
  else { suggestions.push({ icon: '👤', text: 'Fill in author details in the License & Author section.' }); }

  // Screenshots / demo (5 pts)
  if (sections['screenshots'] && (screenshots.length > 0 || f('videoUrl') || f('imageUrls'))) { score += 5; }
  else { suggestions.push({ icon: '🖼️', text: 'Add screenshots or a demo video/link.' }); }

  // Live demo URL (5 pts)
  if (f('demoUrl')) { score += 5; }
  else { suggestions.push({ icon: '🔗', text: 'Add a live demo URL if your project is deployed online.' }); }

  // Contributing (5 pts)
  if (sections['contributing']) { score += 5; }
  else { suggestions.push({ icon: '🤝', text: 'Enable the Contributing section to invite community contributions.' }); }

  // License (5 pts)
  if (sections['author'] && license !== 'none') { score += 5; }
  else if (license === 'none') { suggestions.push({ icon: '📄', text: 'Choose a license to clarify how others can use your project.' }); }

  return { score: Math.min(score, 100), suggestions };
}
