import React, { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import messagesData from '../data/distanceMessages.json';
import '../styles/ZoomText.css';

function ZoomText({ distance, setDistance }) {
  const [message, setMessage] = useState('');
  const [textClass, setTextClass] = useState('');

  useEffect(() => {
    const matched = messagesData.find(entry => distance > entry.min);

    if (matched) {
      setMessage(matched.text);
      setTextClass(matched.class || '');
    } else {
      setMessage('');
      setTextClass('');
    }
  }, [distance]);

  return (
    <div className={`zoom-text ${textClass}`}>
      {typeof message === 'string' ? (
        <TypewriterText text={message} speed={25} />
      ) : (
        <>
          <TypewriterText
            text={`>>> ATTENZIONE: siamo arrivati al "punto di non ritorno"\n>>> La forza di gravità è così intensa che nulla può sfuggire… nemmeno noi\n>>> Non potrai più tornare indietro.\n`}
            speed={25}
          />
          <div className="buttons">
            <button onClick={() => setDistance(700)}>Torna indietro</button>
            <button onClick={() => setDistance(19)}>Continua</button>
          </div>
        </>
      )}
    </div>
  );
}

export default ZoomText;
