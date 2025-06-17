import React, { useState, useEffect } from 'react';

function TypewriterText({ text = '', speed = 20 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    }
  }, [index, text, speed]);

  // Replace newline characters with <br />
  const formattedText = displayedText.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));

  return <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{formattedText}</div>;
}

export default TypewriterText;
