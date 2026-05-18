import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage } =
    useContext(LanguageContext);

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      style={{
        padding: '8px',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      <option value="en">English</option>
      <option value="hi">Hindi</option>
      <option value="es">Spanish</option>
      <option value="fr">French</option>
      <option value="zh">Chinese</option>
    </select>
  );
};

export default LanguageSelector;