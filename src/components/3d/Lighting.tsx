import React from 'react';

export const Lighting: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-10, -5, -5]} intensity={0.5} color="#00F0FF" />
    </>
  );
};
