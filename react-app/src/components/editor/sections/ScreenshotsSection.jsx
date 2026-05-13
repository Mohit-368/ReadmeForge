import { useRef, useMemo } from 'react'
import { useReadme } from '../../../context/ReadmeContext'
import SectionCard from '../SectionCard'
import { Input, labelStyle, inputStyle } from '../FormFields'

function countWords(text) {
  let words = text.trim() ? text.trim().split(/\s+/) : []
  words = words.filter(w => w !== '###' && w !== '-')
  return words.length
}

export default function ScreenshotsSection({ num }) {
  const { state, dispatch } = useReadme()
  const f = (id) => state.fields[id] || ''
  const set = (id) => (e) => dispatch({ type: 'SET_FIELD', id, value: e.target.value })
  const fileInputRef = useRef()
  const imageUrls = f('imageUrls')
  const wordCount = useMemo(() => countWords(imageUrls), [imageUrls])
  const wordLabel = wordCount === 1 ? 'WORD' : 'WORDS'

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        dispatch({ type: 'ADD_SCREENSHOTS', items: [{ name: file.name, dataUrl: e.target.result }] })
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <SectionCard num={num} title="Screenshots">
      {/* Video / demo link */}
      <Input
        label="LIVE DEMO / VIDEO LINK (OPTIONAL)"
        id="videoUrl"
        type="url"
        placeholder="https://youtube.com/watch?v=..."
        value={f('videoUrl')}
        onChange={set('videoUrl')}
      />

      {/* Drop Zone */}
      <div>
        <label style={{ ...labelStyle, marginBottom: '8px' }}>DRAG & DROP SCREENSHOTS</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
          style={{
            border: '2px dashed var(--border2)', borderRadius: '12px', padding: '40px 24px',
            textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
            background: 'var(--surface2)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.background = 'rgba(56,189,248,0.05)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border2)'
            e.currentTarget.style.background = 'var(--surface2)'
          }}
        >
          {/* Landscape image icon */}
          <div style={{ fontSize: '40px', marginBottom: '14px', lineHeight: 1 }}>🖼️</div>
          <p style={{
            fontSize: '14px', fontWeight: 700, color: 'var(--muted2)',
            marginBottom: '6px', fontFamily: "'Space Grotesk', sans-serif",
          }}>Drop images here or click to browse</p>
          <small style={{
            fontSize: '12px', color: 'var(--muted)',
            fontFamily: "'JetBrains Mono', monospace",
          }}>PNG, JPG, GIF — they'll be linked as Markdown</small>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Uploaded screenshot list */}
      {state.screenshots.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {state.screenshots.map((ss, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'var(--surface3)', border: '1px solid var(--border2)',
              borderRadius: '8px', padding: '10px 12px',
            }}>
              <img src={ss.dataUrl} alt="" style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '6px' }} />
              <span style={{ flex: 1, fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {ss.name}
              </span>
              <button
                onClick={() => dispatch({ type: 'REMOVE_SCREENSHOT', idx })}
                style={{
                  width: '24px', height: '24px', borderRadius: '6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.2)',
                  color: 'var(--red)', cursor: 'pointer', fontSize: '14px', flexShrink: 0,
                }}
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Image URLs textarea */}
      <div>
        <label style={{ ...labelStyle, marginBottom: '8px' }}>
          OR ADD IMAGE URLS (FORMAT: LABEL | URL, ONE PER LINE)
        </label>
        <textarea
          id="imageUrls"
          className="textInput"
          placeholder={"Landing Page | https://i.imgur.com/abc.png\nDashboard | https://i.imgur.com/xyz.png"}
          value={imageUrls}
          onChange={set('imageUrls')}
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', lineHeight: 1.65 }}
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
