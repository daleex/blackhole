import React, { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import '../styles/ZoomText.css';

function ZoomText({ distance, setDistance }) {
  const [message, setMessage] = useState('');
  const [textClass, setTextClass] = useState('');

  useEffect(() => {
    let newMessage = '';
    let newTextClass = '';

    if (distance > 650) {
      newMessage = 'Benvenuto nello spazio';
    } else if (distance > 630) {
      newMessage = 'Attenzione';
    } else if (distance > 610) {
      newMessage = 'Una stella sta per morire...\nIl suo destino cambierà lo spazio attorno a sé per sempre....';
    } else if (distance > 600) {
      newMessage = 'Inizia ora il viaggio...\nverso l\'ignoto...';
    } else if (distance > 550) {
      newMessage = 'Immagina una stella molto, molto grande, almeno venti volte più grande del nostro Sole. Dopo tanto tempo, anche questa stella arriva alla fine della sua vita.';
    } else if (distance > 500) {
      newMessage = 'La stella ha consumato tutto il carburante che la faceva brillare e stare calda. Senza quel carburante, la gravità inizia a vincere e il centro della stella comincia a schiacciarsi sempre di più';
    } else if (distance > 470) {
      newMessage = 'Mentre il centro si schiaccia, gli strati esterni della stella vengono lanciati lontano nello spazio con una forza incredibile. Questa esplosione spettacolare si chiama supernova.';
    } else if (distance > 430) {
      newMessage = 'Una supernova è una delle esplosioni più forti e luminose che ci siano: per un breve periodo può brillare più di tutte le stelle di una galassia messe insieme.';
    } else if (distance > 400) {
      newMessage = 'Durante questo evento, la stella rilascia una quantità enorme di energia, tanto che per un breve periodo può brillare più di un\'intera galassia.';
    } else if (distance > 370) {
      newMessage = 'Ma quello che rimane dopo questa esplosione è davvero speciale: un oggetto piccolissimo ma super denso, con una forza di gravità così grande che niente può scappare. Nemmeno la luce.';
    } else if (distance > 350) {
      newMessage = 'Questo oggetto misterioso si chiama buco nero. Non possiamo vederlo direttamente, perché non emette nessuna luce e non riflette niente.';
    } else if (distance > 320) {
      newMessage = 'Ecco un punto importante: quando diciamo che nemmeno la luce può uscire, parliamo proprio di quella luce che di solito ci permette di vedere le cose. Qui invece, la gravità è così forte che blocca anche quella.';
    } else if (distance > 300) {
      newMessage = 'Allora, come possiamo sapere che un buco nero esiste?';
    } else if (distance > 270) {
      newMessage = 'Gli scienziati lo scoprono osservando l’ambiente intorno: se una stella si muove in modo strano, come se fosse attratta da qualcosa di invisibile, è un indizio.';
    } else if (distance > 240) {
      newMessage = 'Possiamo individuare un buco nero mentre le stelle orbitano nel vuoto.';
    } else if (distance > 200) {
      newMessage = 'Oppure li troviamo attraverso la materia che si scalda mentre cade.';
    } else if (distance > 150) {
      newMessage = 'E negli ultimi anni, abbiamo scoperto un nuovo modo per “sentire” i buchi neri: quando due buchi neri si fondono, creano onde gravitazionali, cioè piccole increspature nello spazio e nel tempo, come onde su uno stagno.';
    } else if (distance > 100) {
      newMessage = 'Adesso stiamo per avvicinarci alla parte più misteriosa del buco nero: l’orizzonte degli eventi.';
    } else if (distance > 70) {
      newMessage = 'L’orizzonte degli eventi è un confine invisibile. Superato quel punto, nulla può più uscire, nemmeno la luce, nemmeno un segnale, nemmeno una navicella spaziale. Per questo si chiama "punto di non ritorno".';
    } else if (distance > 60) {
      newMessage = 'Se qualcuno si avvicinasse troppo a questo confine, da fuori sembrerebbe rallentare sempre di più, come se il tempo per lui andasse piano piano. La luce che manda indietro diventerebbe sempre più debole e stirata, fino quasi a sparire.';
    } else if (distance > 20) {
      newMessage = 'Ma cosa succede se entriamo dentro l’orizzonte degli eventi?';
    } else if (distance > 10) {
      newMessage = null; // JSX will be rendered
      newTextClass = 'centered terminal-style';
    } else if (distance > 6) {
      newMessage = 'Dal nostro punto di vista, potremmo superare l’orizzonte senza accorgercene. Ma una volta dentro... ';
    } else if (distance > 5) {
      newMessage = 'Nessuna informazione potrebbe tornare indietro. È come se fossimo usciti dall’universo osservabile.';
    } else if (distance > 4) {
      newMessage = 'La gravità dentro un buco nero è così intensa che la materia viene stirata in lunghe forme sottili, come spaghetti. Per questo gli scienziati chiamano questo fenomeno “spaghettificazione”. La materia viene spezzata, distrutta e... scompare.';
    } else if (distance > 3) {
      newMessage = 'Che cosa c’è al centro di un buco nero?';
    } else if (distance > 2) {
      newMessage = 'La teoria più accettata dice che c’è una singolarità: un punto minuscolo dove la densità è infinita e il tempo e lo spazio si comportano in modi che ancora non comprendiamo.';
    } else if (distance > 1) {
      newMessage = 'Ma forse la singolarità non è davvero un punto. Forse c’è qualcosa di diverso, qualcosa che ancora non conosciamo. Forse è una porta per altri luoghi, per altri universi. Nessuno lo sa per certo.';
    } else if (distance > 0) {
      newMessage = 'I buchi neri ci sfidano a comprendere l’universo. Ci raccontano di stelle morte, ma anche di nascita di conoscenza. Guardare dentro di loro è guardare oltre i limiti della scienza. È guardare noi stessi.';
    } else {
      newMessage = '';
    }

    setTextClass(newTextClass);
    setMessage(newMessage);
  }, [distance]);

  return (
    <div className={`zoom-text ${textClass}`}>
      {typeof message === 'string' ? (
        <TypewriterText text={message} speed={20} />
      ) : (
        <>
          <TypewriterText
            text={`>>> ATTENZIONE: siamo arrivati al "punto di non ritorno"\n>>> La forza di gravità è così intensa che nulla può sfuggire… nemmeno noi\n>>> Non potrai più tornare indietro.\n`}
            speed={25}
          />
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '20px',
              justifyContent: 'center',
              pointerEvents: 'auto',
            }}
          >
            <button
              onClick={() => setDistance(700)}
              style={{
                padding: '10px 20px',
                fontSize: '18px',
                borderRadius: '4px',
                backgroundColor: '#111',
                color: '#0f0',
                border: '1px solid #0f0',
                fontFamily: 'monospace',
                cursor: 'pointer',
                boxShadow: '0 0 5px #0f0',
              }}
            >
              Torna indietro
            </button>
            <button
              onClick={() => setDistance(7)}
              style={{
                padding: '10px 20px',
                fontSize: '18px',
                borderRadius: '4px',
                backgroundColor: '#111',
                color: '#0f0',
                border: '1px solid #0f0',
                fontFamily: 'monospace',
                cursor: 'pointer',
                boxShadow: '0 0 5px #0f0',
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
