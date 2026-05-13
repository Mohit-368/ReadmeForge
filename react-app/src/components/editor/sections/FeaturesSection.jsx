import { useMemo } from 'react'
import SectionCard from '../SectionCard'
import { labelStyle, inputStyle } from '../FormFields'
import { useReadme } from '../../../context/ReadmeContext'

function countWords(text) {
  let words = text.trim() ? text.trim().split(/\s+/) : []
  words = words.filter(word => word !== '###' && word !== '-')
  return words.length
}

export default function FeaturesSection({ num }) {
  const { state, dispatch } = useReadme()
  const features = state.fields['features'] || ''
  const wordCount = useMemo(() => countWords(features), [features])
  const wordLabel = wordCount === 1 ? 'WORD' : 'WORDS'

  return (
    <SectionCard num={num} title="Features">
      <div>
        <label style={{ ...labelStyle, marginBottom: '8px' }}>
          KEY FEATURES — USE "### CATEGORY" FOR GROUPS, "- ITEM" FOR BULLETS
        </label>
        <textarea
          id="features"
          className="textInput"
          placeholder={"### 🔐 Authentication\n- Email OTP verification\n- Secure login / logout\n\n### 📝 Posts\n- Create, Read, Update, Delete"}
          value={features}
          onChange={e => dispatch({ type: 'SET_FIELD', id: 'features', value: e.target.value })}
          style={{ ...inputStyle, minHeight: '160px', resize: 'vertical', lineHeight: 1.65 }}
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
