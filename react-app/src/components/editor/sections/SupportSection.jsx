import SectionCard from '../SectionCard'
import { Input, Textarea } from '../FormFields'
import { useReadme } from '../../../context/ReadmeContext'

export default function SupportSection({ num }) {
  const { state, dispatch } = useReadme()
  const f = (id) => state.fields[id] || ''
  const set = (id) => (e) => dispatch({ type: 'SET_FIELD', id, value: e.target.value })

  return (
    <SectionCard num={num} title="Support & Donation">
      <Textarea label="SUPPORT MESSAGE (optional)" id="supportMsg" placeholder="If you find this project helpful, consider supporting..." value={f('supportMsg')} onChange={set('supportMsg')} minHeight="70px" />
      <Input label="BUY ME A COFFEE USERNAME" id="supportBmac" placeholder="your-username" value={f('supportBmac')} onChange={set('supportBmac')} />
      <Input label="KO-FI USERNAME" id="supportKofi" placeholder="your-username" value={f('supportKofi')} onChange={set('supportKofi')} />
      <Input label="PATREON USERNAME" id="supportPatreon" placeholder="your-username" value={f('supportPatreon')} onChange={set('supportPatreon')} />
      <Input label="GITHUB SPONSORS USERNAME" id="supportGhSponsors" placeholder="your-username" value={f('supportGhSponsors')} onChange={set('supportGhSponsors')} />
    </SectionCard>
  )
}
