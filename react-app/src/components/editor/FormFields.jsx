// Shared input/textarea/select styles
export const inputStyle = {
  width: '100%',
  background: 'var(--surface2)',
  border: '1px solid var(--border2)',
  color: 'var(--text)',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '13px',
  padding: '12px 16px',
  borderRadius: '10px',
  outline: 'none',
  transition: 'all 0.2s',
}

export const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontFamily: "'JetBrains Mono', monospace",
  color: 'var(--muted)',
  marginBottom: '8px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
}

export function Field({ label, children }) {
  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}
      {children}
    </div>
  )
}

export function Input({ label, id, placeholder, type = 'text', value, onChange }) {
  return (
    <Field label={label}>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={inputStyle}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 4px rgba(56,189,248,0.1)'; e.target.style.background = 'var(--surface)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface2)'; }}
      />
    </Field>
  )
}

export function Textarea({ label, id, placeholder, value, onChange, minHeight = '90px' }) {
  return (
    <Field label={label}>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ ...inputStyle, minHeight, resize: 'vertical', lineHeight: 1.65 }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 4px rgba(56,189,248,0.1)'; e.target.style.background = 'var(--surface)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--surface2)'; }}
      />
    </Field>
  )
}

export function TwoCol({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      {children}
    </div>
  )
}
