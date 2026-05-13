import { useMemo } from 'react'
import SectionCard from '../SectionCard'
import { labelStyle, inputStyle } from '../FormFields'
import { useReadme } from '../../../context/ReadmeContext'

function countWords(text) {
  let words = text.trim() ? text.trim().split(/\s+/) : []
  words = words.filter(w => w !== '###' && w !== '-')
  return words.length
}

export default function ContributingSection({ num }) {
  const { state, dispatch } = useReadme()
  const contribNotes = state.fields['contribNotes'] || ''
  const wordCount = useMemo(() => countWords(contribNotes), [contribNotes])
  const wordLabel = wordCount === 1 ? 'WORD' : 'WORDS'

  return (
    <SectionCard num={num} title="Contributing">
      <div>
        <label style={{ ...labelStyle, marginBottom: '8px' }}>
          CUSTOM CONTRIBUTING NOTES (OPTIONAL — DEFAULT GUIDE AUTO-GENERATED)
        </label>
        <textarea
          id="contribNotes"
          className="textInput"
          placeholder="Any specific guidelines, code style rules, branch naming conventions..."
          value={contribNotes}
          onChange={e => dispatch({ type: 'SET_FIELD', id: 'contribNotes', value: e.target.value })}
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', lineHeight: 1.65 }}
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
    </SectionCard>
  )
}
