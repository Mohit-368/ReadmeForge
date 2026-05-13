import { useMemo } from 'react'
import SectionCard from '../SectionCard'
import { Input, inputStyle, labelStyle } from '../FormFields'
import { useReadme } from '../../../context/ReadmeContext'

function countWords(text) {
  let words = text.trim() ? text.trim().split(/\s+/) : []
  // Filter out markdown syntax tokens (### for headings, - for lists)
  words = words.filter(word => word !== '###' && word !== '-')
  return words.length
}

export default function DescriptionSection({ num }) {
  const { state, dispatch } = useReadme()
  const f = (id) => state.fields[id] || ''
  const set = (id) => (e) => dispatch({ type: 'SET_FIELD', id, value: e.target.value })

  const description = f('description')
  const wordCount = useMemo(() => countWords(description), [description])
  const wordLabel = wordCount === 1 ? 'WORD' : 'WORDS'

  return (
    <SectionCard num={num} title="Description">
      {/* Description textarea with word counter */}
      <div>
        <label style={{ ...labelStyle, marginBottom: '8px' }}>SHORT DESCRIPTION</label>
        <textarea
          id="description"
          placeholder="What does your project do? What problem does it solve?"
          value={description}
          onChange={set('description')}
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
        {/* Word count below textarea — */}
        <div style={{ ...labelStyle, marginTop: '8px', marginBottom: 0 }}>
          {wordCount} {wordLabel}
        </div>
      </div>

      <Input
        label="LIVE DEMO URL (OPTIONAL)"
        id="demoUrl"
        placeholder="https://your-app.com"
        type="url"
        value={f('demoUrl')}
        onChange={set('demoUrl')}
      />
    </SectionCard>
  )
}
