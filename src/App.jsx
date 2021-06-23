import React, { useState, useEffect, useRef } from 'react'
import renderBlob from './webgl-master'

function App() {

  useEffect( () => {
    renderBlob()
  }, [])

  // const handleCanvasClick = (event) => {
  //   if (event.currentTarget.id === 'canvas') {
  //     const clientRect = event.currentTarget.getBoundingClientRect()
  //     const posX = event.clientX - clientRect.left
  //     const posY = event.clientY - clientRect.top
  //     // triggerInfo.fadeCount = 0,
  //     // triggerInfo.posX = posX,
  //     // triggerInfo.posY = posY
  //   }
  // }

  return (
    <div className="App">
      asdf
      <canvas
        id='canvas'
        // aspect ratio: 1.77777777
        width='650'
        height='366'
        // onClick={handleCanvasClick}
      ></canvas>
    </div>
  );
}

export default App;
