import { useReadme } from '../../context/ReadmeContext'
import TitleSection from './sections/TitleSection'
import DescriptionSection from './sections/DescriptionSection'
import FeaturesSection from './sections/FeaturesSection'
import TechStackSection from './sections/TechStackSection'
import InstallationSection from './sections/InstallationSection'
import StructureSection from './sections/StructureSection'
import ScreenshotsSection from './sections/ScreenshotsSection'
import ApiSection from './sections/ApiSection'
import ContributingSection from './sections/ContributingSection'
import AuthorSection from './sections/AuthorSection'
import SupportSection from './sections/SupportSection'

export default function Editor() {
  const { state } = useReadme()
  const { sections } = state

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: 'transparent' }}
    >
      <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto', paddingBottom: '120px' }}>
        {sections.title && <TitleSection num={1} />}
        {sections.description && <DescriptionSection num={2} />}
        {sections.features && <FeaturesSection num={3} />}
        {sections.techstack && <TechStackSection num={4} />}
        {sections.installation && <InstallationSection num={5} />}
        {sections.structure && <StructureSection num={6} />}
        {sections.screenshots && <ScreenshotsSection num={7} />}
        {sections.api && <ApiSection num={8} />}
        {sections.contributing && <ContributingSection num={9} />}
        {sections.author && <AuthorSection num={10} />}
        {sections.support && <SupportSection num={11} />}
      </div>
    </div>
  )
}
