import React, { useState, useEffect, useRef } from 'react';
import { processor, triggerInfo } from './processor'

function App() {

  const videoRef = useRef()

  useEffect( () => {
    videoRef.current.addEventListener('loadedmetadata', (e) => {
      processor.doLoad()
    })
  }, [])

  const handleCanvasClick = (event) => {
    if (event.currentTarget.id === 'canvas') {
      const clientRect = event.currentTarget.getBoundingClientRect()
      const posX = event.clientX - clientRect.left
      const posY = event.clientY - clientRect.top
      triggerInfo.fadeCount = 0,
      triggerInfo.posX = posX,
      triggerInfo.posY = posY
    }
  }

  return (
    <div className="App">
      asdf

      <canvas
        id='canvas'
        onClick={handleCanvasClick}
      ></canvas>

      <video 
        autoPlay muted loop
        className='invisible'
        ref={videoRef}
        src='/blob-cropped-halfSize.webm'
        id='video'
        width="650"
      />
    </div>
  );
}

export default App;
