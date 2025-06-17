/*import React, { useState, useEffect } from 'react'
import { a, useSpring } from '@react-spring/web'

const texts = [
  "Benvenuto nello spazio",
  "Attenzione",
  "Una stella sta per morire...\nIl suo destino cambierà lo spazio attorno a sé per sempre....",
  "Inizia ora il viaggio...\nverso l'ignoto...",
]

const StarfieldTextOverlay = ({ onFinale }) => {
  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [displayIndex, setDisplayIndex] = useState(index)
  const [maxWidth, setMaxWidth] = useState(5)
  const [fontSize, setFontSize] = useState(1.5)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)  // 1. Stato isMobile

  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const base = Math.min(width, height)

      // Aggiorna isMobile al resize
      setIsMobile(width < 768)

      const newFontSize = width < 768
        ? Math.max(0.4, base / 1000)
        : Math.min(1.5, Math.max(0.8, base / 800))

      setMaxWidth(Math.max(3, width / 20))
      setFontSize(newFontSize)
    }

    window.addEventListener('resize', updateSizes)
    updateSizes()
    return () => window.removeEventListener('resize', updateSizes)
  }, [])

  const { scale } = useSpring({
    scale: animating ? 0 : 1,
    config: { tension: 50, friction: 20, clamp: true },
    onRest: () => {
      if (animating) {
        setDisplayIndex(index)
        setAnimating(false)
      }
    }
  })

  useEffect(() => {
    if (index !== displayIndex) {
      setAnimating(true)
    }
  }, [index, displayIndex])

  useEffect(() => {
    const onWheel = (event) => {
      event.preventDefault()
      if (animating) return
      setIndex((i) => {
        let newIndex = i + (event.deltaY > 0 ? 1 : -1)
        return Math.max(0, Math.min(texts.length - 1, newIndex))
      })
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [animating])

  const isLast = index === texts.length - 1 && !animating

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        whiteSpace: 'pre-line',
        fontSize: `${fontSize * 50}px`,
        width: `${maxWidth * 100}px`,  // prova a moltiplicare per 100 per più larghezza
        maxWidth: '90%',
        textAlign: 'center',
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        <a.div style={{ scale }}>
          {texts[displayIndex]}
        </a.div>
      </div>

      {isLast && (
        <div style={{
          position: 'fixed',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          pointerEvents: 'auto'
        }}>
          <button
            onClick={onFinale}
            style={{
              padding: isMobile ? '8px 16px' : '14px 28px',
              fontSize: isMobile ? '16px' : '24px',
              borderRadius: '10px',
              backgroundColor: '#ffffff22',
              color: 'white',
              border: '1px solid white',
              cursor: 'pointer',
              animation: 'blink 1.2s infinite'
            }}
          >
            Inizia
          </button>
          <style>
            {`
              @keyframes blink {
                0%   { opacity: 1; }
                50%  { opacity: 0.4; }
                100% { opacity: 1; }
              }
            `}
          </style>
        </div>
      )}
    </>
  )
}

export default StarfieldTextOverlay*/
