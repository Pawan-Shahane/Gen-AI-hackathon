import React , {Fragment  }from 'react'
import { Row, Col, Input, Select, Button, Divider, Collapse, Card} from 'antd'
import openNotification from '../utils/notification';
import Paragraph from './Paragraph';
import classes from './YoutubeTranslation.module.scss';
import { TRANSLATION_STEPS } from '../constants';
import { useState } from 'react'
import { TRANSLATE_LANGUAGES } from '../constants'
import {
  getTexttoVoice,
  getTranslation,
  getVideoSubtitles} from '../apis/youtube-api';
const YoutubeTranslation = () => {
  const [url, setURL] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [audio, setAudio] = useState(null);
  const [translationInfo, setTranslation] = useState({
    title: '',
    subtitles: '',
    translation: '',
  });

  const translateVideo = async () => {
    if (!url) {
      openNotification({ type: 'info', message: 'Please enter url first' });
      return;
    }

    setLoading(true);

    // getting subtitles
    let subtitles;
    try {
      subtitles = await getVideoSubtitles(url);
    } catch (error) {
      openNotification({
        type: 'error',
        message: "Video doesn't have subtitles",
      });
      setLoading(false);
      return;
    }

    if (!subtitles) {
      setLoading(false);
      return;
    }

    // translating subtitles
    let subtitleTranslation;
    try {
      subtitleTranslation = await getTranslation(subtitles, 'en-US', language);
    } catch (error) {
      setLoading(false);
      openNotification({ type: 'error', message: 'Something went wrong' });
      return;
    }

    // generating audio
    try {
      const translationAudio = await getTexttoVoice(
        language.toLowerCase(),
        subtitleTranslation
      );
      setAudio(translationAudio);
      setTranslation({
        ...translationInfo,
        subtitles,
        translation: subtitleTranslation,
      });
      console.log('Audio : ', audio);
      setTranslatedText(subtitleTranslation);
      setLoading(false);
    } catch (error) {
      openNotification({ type: 'error', message: 'Something went wrong' });
    }
  };

  const onSelectChange = (value) => {
    setLanguage(value);
  };


  return (
    <Row style={{ paddingBottom: '2rem' }}>
    <Col span={24} className={classes.summarizeHeader}>
      <h2>Youtube AI Voice Translation</h2>
    </Col>
    <Divider className={classes.divider} />
    <Col span={24} className={classes.summarizeBody}>
      <Input
        placeholder="Enter Youtube URL"
        className={classes.input}
        onChange={(e) => setURL(e.target.value)}
      />
      <Select
        showSearch
        placeholder="Language"
        optionFilterProp="children"
        onChange={onSelectChange}
        options={TRANSLATE_LANGUAGES}
        filterOption={(input, option) =>
          option?.label?.toLowerCase().includes(input.toLowerCase())
        }
      />
      <Button type="primary" onClick={translateVideo} loading={loading}>
        Translate
      </Button>
    </Col>
    <Col span={24} className={classes.audioWrapper}>
      {audio && (
        <Card className={classes.summaryCard}>
          <h3>Listen</h3>
          <audio controls className={classes.audioTranslation}>
            <source src={audio} type="audio/mp3" />
          </audio>
        </Card>
      )}
    </Col>
    <Col span={24}>
      <Card className={classes.summaryCard}>
        {translatedText ? (
          <Fragment>
            <Col span={24} className={classes.textHeader}>
              <h3>Read</h3>
            </Col>
            <div className={classes.summary}>{translatedText}</div>
          </Fragment>
        ) : (
          <div className={classes.infoContainer}>
            <h1>HOW IT WORKS?</h1>
            <div>
              {TRANSLATION_STEPS.map((step) => (
                <Paragraph text={step.text} />
              ))}

              <p className={classes.warn}>
                Note: Please enter URL which contains english subtitles on
                Youtube.
              </p>
            </div>
          </div>
        )}
      </Card>
      {translationInfo.subtitles && (
        <Collapse
          className={classes.subtitles}
          size="large"
          items={[
            {
              key: '1',
              label: 'Original Subtitles',
              children: <p>{translationInfo.subtitles}</p>,
            },
          ]}
        />
      )}
    </Col>

  </Row>
  )
}

export default YoutubeTranslation

