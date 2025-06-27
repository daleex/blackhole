import React, { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import messagesData from '../data/distanceMessages.json';
import '../styles/ZoomText.css';


function ZoomText({ distance, setDistance, setCtaActive }) {
  const [mainMessage, setMainMessage] = useState('');
  const [textClass, setTextClass] = useState('');
  const [instruction, setInstruction] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imagePosition, setImagePosition] = useState('left');

  useEffect(() => {
    const roundedDistance = Math.round(distance);
    const matchedMessages = messagesData.filter(
      entry => roundedDistance >= entry.min && roundedDistance <= entry.max
    );

    let main = '';
    let cssClass = '';
    let scrollInstruction = '';
    let fallbackNeeded = false;
    let image = null;
    let imagePos = 'left';

    matchedMessages.forEach(entry => {
      if (entry.text === "Scorri un po’, ti garantisco che ne vale la pena!") {
        scrollInstruction = entry.text;
      }
      if (typeof entry.text === 'string' && !main) {
        main = entry.text;
        cssClass = entry.class || '';
        if (entry.image) {
          image = entry.image;
          imagePos = entry.imagePosition || 'left';
        }
      }
    });

    fallbackNeeded = matchedMessages.some(
      entry => entry.min === 20 && entry.max === 20
    );

    setMainMessage(main);
    setTextClass(cssClass);
    setInstruction(scrollInstruction);
    setShowFallback(fallbackNeeded);
    setCtaActive(fallbackNeeded);
    setImageSrc(image);
    setImagePosition(imagePos);
  }, [distance, setCtaActive]);

  return (
    <>
      {instruction && (
        <div className="scroll-instruction">
          <TypewriterText text={instruction} speed={10} />
        </div>
      )}

      <div className={`zoom-text ${showFallback ? 'centered' : textClass || 'bottom-left'}`}>
        {!showFallback ? (
          <div className={`text-with-image ${imagePosition}`}>
            {imageSrc && (imagePosition === 'top' || imagePosition === 'left') && (
              <img src={imageSrc} alt="" className="message-image" />
            )}
            <TypewriterText text={mainMessage} speed={10} />
            {imageSrc && (imagePosition === 'bottom' || imagePosition === 'right') && (
              <img src={imageSrc} alt="" className="message-image" />
            )}
          </div>
        ) : (
          <>
            <div className="terminal-warning">
              <TypewriterText
                text={`>>> ATTENZIONE: siamo arrivati al "punto di non ritorno"\n>>> La forza di gravità è così intensa che nulla può sfuggire… nemmeno noi\n>>> Non potrai più tornare indietro.`}
                speed={10}
              />
            </div>
            <div className="buttons">
              <button
                onClick={() => {
                  setDistance(1000);
                  setCtaActive(false);
                }}
              >
                Torna indietro
              </button>
              <button
                onClick={() => {
                  setDistance(19);
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
