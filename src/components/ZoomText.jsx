import React, { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import messagesData from '../data/distanceMessages.json';
import '../styles/ZoomText.css';

function ZoomText({ distance, setDistance, setCtaActive }) {
  const [message, setMessage] = useState('');
  const [textClass, setTextClass] = useState('');

useEffect(() => {
  const roundedDistance = Math.round(distance);

  const matched = messagesData.find(
    entry => roundedDistance >= entry.min && roundedDistance <= entry.max
  );

  if (matched) {
    setMessage(matched.text);
    setTextClass(matched.class || '');

    // Activate CTA only if in exact distance 20 range
    const isCtaRange = matched.min === 20 && matched.max === 20;
    setCtaActive(isCtaRange);
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
            <button
              onClick={() => {
                setDistance(1000); // Go back
                setCtaActive(false);
              }}
            >
              Torna indietro
            </button>
            <button
              onClick={() => {
                setDistance(19); // Continue
              }}
            >
              Continua
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ZoomText;
