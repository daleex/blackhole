import React, { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import messagesData from '../data/distanceMessages.json';
import '../styles/ZoomText.css';

function ZoomText({ distance, setDistance, setCtaActive }) {
  const [message, setMessage] = useState('');
  const [textClass, setTextClass] = useState('');

  useEffect(() => {
    const matched = messagesData.find(entry => distance > entry.min);

    if (matched) {
      setMessage(matched.text);
      setTextClass(matched.class || '');
      if (typeof matched.text !== 'string') {
        setCtaActive(true); // ✅ Activate CTA when showing non-string content
      } else {
        setCtaActive(false); // ✅ Reset CTA if we’re not in CTA anymore
      }
    } else {
      setMessage('');
      setTextClass('');
      setCtaActive(false);
    }
  }, [distance, setCtaActive]);

  return (
    <div className={`zoom-text ${textClass}`}>
      {typeof message === 'string' ? (
        <TypewriterText text={message} speed={15} />
      ) : (
        <>
          <TypewriterText
            text={`>>> ATTENZIONE: siamo arrivati al "punto di non ritorno"\n>>> La forza di gravità è così intensa che nulla può sfuggire… nemmeno noi\n>>> Non potrai più tornare indietro.\n`}
            speed={20}
          />
          <div className="buttons">
            <button onClick={() => {
              setDistance(700);
              setCtaActive(false); // ✅ Reactivate zoom out
            }}>
              Torna indietro
            </button>
            <button onClick={() => {
              setDistance(19);
              // ctaActive stays true to lock zoom out
            }}>
              Continua
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ZoomText;
