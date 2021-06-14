import React, { useState, useEffect, useRef } from 'react';
import { processor } from './processor'

function App() {

  const videoRef = useRef()

  useEffect( () => {
    videoRef.current.addEventListener('loadedmetadata', (e) => {
      processor.doLoad()
    })
  }, [])

  return (
    <div className="App">
      asdf

      <canvas id='canvas'></canvas>

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
