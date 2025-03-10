import React from 'react';

type RetroCardProps = {
  title: string;
  content: string;
};

export const RetroCard: React.FC<RetroCardProps> = ({ title, content }) => {
  return (
    <div className="bg-retroPrimary border-2 border-retroBorder shadow-retro p-6 rounded-retro">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p>{content}</p>
    </div>
  );
};
