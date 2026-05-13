import SectionCard from '../SectionCard'
import { Input, Textarea } from '../FormFields'
import { useReadme } from '../../../context/ReadmeContext'

export default function ApiSection({ num }) {
  const { state, dispatch } = useReadme()
  const f = (id) => state.fields[id] || ''
  const set = (id) => (e) => dispatch({ type: 'SET_FIELD', id, value: e.target.value })

  return (
    <SectionCard num={num} title="API Docs">
      <Input label="BASE URL" id="apiBase" placeholder="https://api.yourapp.com/v1" type="url" value={f('apiBase')} onChange={set('apiBase')} />
      <Textarea
        label="ENDPOINTS (METHOD /path | Description)"
        id="apiDocs"
        placeholder={"GET /users | Get all users\nPOST /users | Create a new user\nDELETE /users/:id | Delete user by ID"}
        value={f('apiDocs')}
        onChange={set('apiDocs')}
        minHeight="120px"
      />
    </SectionCard>
  )
}
