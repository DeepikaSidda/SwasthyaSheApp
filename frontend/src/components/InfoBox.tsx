import React, { useState } from 'react';

interface InfoBoxProps {
  imageSrc: string;
  title: string;
  content: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ imageSrc, title, content }) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  return (
    <div className="relative">
      <div 
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={() => setIsInfoVisible(!isInfoVisible)}
      >
        <img 
          src={imageSrc}
          alt={title}
          className="w-full h-auto rounded-lg shadow-sm"
        />
      </div>
      
      {isInfoVisible && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-purple-50 p-4 rounded-lg shadow-md z-10">
          <h4 className="font-medium text-purple-700 mb-2">{title}</h4>
          <p className="text-sm text-gray-600">{content}</p>
        </div>
      )}
    </div>
  );
};

export default InfoBox;
