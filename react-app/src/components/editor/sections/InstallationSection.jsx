import { useMemo } from 'react'
import SectionCard from '../SectionCard'
import { Input, labelStyle, inputStyle } from '../FormFields'
import { useReadme } from '../../../context/ReadmeContext'

function countWords(text) {
  let words = text.trim() ? text.trim().split(/\s+/) : []
  words = words.filter(w => w !== '###' && w !== '-')
  return words.length
}

function TextareaWithCount({ id, label, placeholder, value, onChange, minHeight = '100px' }) {
  const count = useMemo(() => countWords(value), [value])
  const wordLabel = count === 1 ? 'WORD' : 'WORDS'

  return (
    <div>
      <label style={{ ...labelStyle, marginBottom: '8px' }}>{label}</label>
      <textarea
        id={id}
        className="textInput"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ ...inputStyle, minHeight, resize: 'vertical', lineHeight: 1.65 }}
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
        {count} {wordLabel}
      </div>
    </div>
  )
}

export default function InstallationSection({ num }) {
  const { state, dispatch } = useReadme()
  const f = (id) => state.fields[id] || ''
  const set = (id) => (e) => dispatch({ type: 'SET_FIELD', id, value: e.target.value })

  return (
    <SectionCard num={num} title="Installation & Usage">
      <Input
        label="PREREQUISITES"
        id="prereqs"
        placeholder="Python 3.10+, Node.js 18+"
        value={f('prereqs')}
        onChange={set('prereqs')}
      />
      <TextareaWithCount
        id="installCmds"
        label="INSTALL COMMANDS (ONE PER LINE)"
        placeholder={"git clone https://github.com/user/repo.git\ncd repo\npip install -r requirements.txt\npython manage.py migrate\npython manage.py runserver"}
        value={f('installCmds')}
        onChange={set('installCmds')}
        minHeight="120px"
      />
      <TextareaWithCount
        id="envVars"
        label="ENV VARIABLES (OPTIONAL)"
        placeholder={"SECRET_KEY=your_secret\nDATABASE_URL=sqlite:///db.sqlite3\nDEBUG=True"}
        value={f('envVars')}
        onChange={set('envVars')}
        minHeight="90px"
      />
      <TextareaWithCount
        id="usageCmd"
        label="RUN COMMAND / USAGE INSTRUCTIONS"
        placeholder={"python manage.py runserver\n\n# Then open http://127.0.0.1:8000/"}
        value={f('usageCmd')}
        onChange={set('usageCmd')}
        minHeight="90px"
      />
    </SectionCard>
  )
}
