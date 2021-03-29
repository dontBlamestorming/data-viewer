import React, { useState, useRef } from 'react';
import { useGesture } from 'react-use-gesture';

export default function ImageController({ src }) {
  const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });
  console.log(crop);

  let imageRef = useRef();
  let imageContainerRef = useRef();

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        setCrop((crop) => ({ ...crop, x: dx, y: dy }));
      },
      onPinch: (offset) => {
        console.log('onPinch', offset);
        // setCrop((crop) => ({ ...crop, scale: 1 + d / 100 }));
      },
      onWheel: (offset) => {
        // setCrop((crop) => ({ ...crop, scale: 1 + d / 100 }));
      },
    },
    {
      domTarget: imageRef,
      eventOptions: { passive: false },
    },
  );

  return (
    <>
      <div ref={imageContainerRef}>
        <img
          alt="이미지"
          src={src}
          ref={imageRef}
          style={{
            left: crop.x,
            right: crop.y,
            transform: `scale(${crop.scale})`,
          }}
        />
      </div>
      <div>
        <p>Crop X : {crop.x}</p>
        <p>Crop Y : {crop.y}</p>
        <p>Crop Scale : {crop.scale}</p>
      </div>
    </>
  );
}
