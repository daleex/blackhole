import React, { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import messagesData from '../data/distanceMessages.json';
import '../styles/ZoomText.css';

function ZoomText({ distance, setDistance, setCtaActive }) {
  const [mainMessage, setMainMessage] = useState('');
  const [textClass, setTextClass] = useState('');
  const [instruction, setInstruction] = useState('');
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const roundedDistance = Math.round(distance);
    const matchedMessages = messagesData.filter(
      entry => roundedDistance >= entry.min && roundedDistance <= entry.max
    );

    let main = '';
    let cssClass = '';
    let scrollInstruction = '';
    let fallbackNeeded = false;

    matchedMessages.forEach(entry => {
      // Handle scroll instruction separately
      if (entry.text === "Scorri un po’, ti garantisco che ne vale la pena!") {
        scrollInstruction = entry.text;
      }
      // Take the first valid string text as main message
      if (typeof entry.text === 'string' && !main) {
        main = entry.text;
        cssClass = entry.class || '';  // Use class from JSON or empty string
      }
    });

    // Detect fallback: you had a fallback at min=20 max=20
    fallbackNeeded = matchedMessages.some(
      entry => entry.min === 20 && entry.max === 20
    );

    setMainMessage(main);
    setTextClass(cssClass);
    setInstruction(scrollInstruction);
    setShowFallback(fallbackNeeded);
    setCtaActive(fallbackNeeded);
  }, [distance, setCtaActive]);

  return (
    <>
      {instruction && (
        <div className="scroll-instruction">
          <TypewriterText text={instruction} speed={20} />
        </div>
      )}

      <div className={`zoom-text ${showFallback ? 'centered' : textClass || 'bottom-left'}`}>
        {!showFallback ? (
          <TypewriterText text={mainMessage} speed={15} />
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
    </>
  );
}

export default ZoomText;
