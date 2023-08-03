import './App.css';
import './antd.scss';
import { Tabs } from 'antd';
import YoutubeTranslation from './components/YoutubeTranslation';
import AISummarizer from './components/AISummarizer';
const onChange = ({key}) => {
  console.log(key);
};

const items = [
  {
    key: '1',
    label: `Youtube AI Translation`,
    children: <YoutubeTranslation />,
  },
  {
    key: '2',
    label: `AI Article Summarizer`,
    children: <AISummarizer />,
  },
];

function App() {
  return (
    <div className='appHeader'>

    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>

  );
}

export default App;
