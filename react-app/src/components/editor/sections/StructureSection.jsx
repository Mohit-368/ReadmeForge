import { useMemo } from 'react'
import { useReadme } from '../../../context/ReadmeContext'
import { convertStructure } from '../../../utils/structureConverter'
import SectionCard from '../SectionCard'
import { labelStyle, inputStyle } from '../FormFields'

function countWords(text) {
  let words = text.trim() ? text.trim().split(/\s+/) : []
  words = words.filter(w => w !== '###' && w !== '-')
  return words.length
}

export default function StructureSection({ num }) {
  const { state, dispatch } = useReadme()
  const rawStructure = state.fields['rawStructure'] || ''
  const projName = state.fields['projName'] || ''
  const wordCount = useMemo(() => countWords(rawStructure), [rawStructure])
  const wordLabel = wordCount === 1 ? 'WORD' : 'WORDS'

  const preview = rawStructure.trim()
    ? convertStructure(rawStructure, projName)
    : 'Paste structure above to preview...'

  return (
    <SectionCard num={num} title="Project Structure Visualizer">
      {/* Raw structure input */}
      <div>
        <label style={{ ...labelStyle, marginBottom: '8px' }}>
          PASTE YOUR FOLDER STRUCTURE (INDENTED WITH SPACES)
        </label>
        <textarea
          id="rawStructure"
          className="textInput"
          placeholder={"src/\n  components/\n    Button.jsx\n  pages/\n    Home.jsx\npublic/\npackage.json"}
          value={rawStructure}
          onChange={e => dispatch({ type: 'SET_FIELD', id: 'rawStructure', value: e.target.value })}
          style={{ ...inputStyle, minHeight: '140px', resize: 'vertical', lineHeight: 1.65 }}
          onFocus={e => {
            e.target.style.borderColor = 'var(--accent)'
            e.target.style.boxShadow = '0 0 0 4px rgba(56,189,248,0.1)'
            e.target.style.background = 'var(--surface)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--border2)'
            e.target.style.boxShadow = 'none'
            e.target.style.background = 'var(--surface2)'
          }}
        />
        <div style={{ ...labelStyle, marginTop: '8px', marginBottom: 0 }}>
          {wordCount} {wordLabel}
        </div>
      </div>

      {/* Visual preview */}
      <div>
        <label style={{ ...labelStyle, marginBottom: '8px' }}>VISUAL PREVIEW</label>
        <pre style={{
          ...inputStyle,
          minHeight: '70px',
          lineHeight: 1.8,
          fontSize: '13px',
          color: rawStructure.trim() ? 'var(--code-text)' : 'var(--muted)',
          whiteSpace: 'pre',
          overflowX: 'auto',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)',
          fontStyle: rawStructure.trim() ? 'normal' : 'normal',
        }}>
          {preview}
        </pre>
      </div>
    </SectionCard>
  )
}
