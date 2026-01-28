// src/components/panels/video-link.tsx
import React from 'react';

interface VideoLinkProps {
  title: string;
  url: string;
  duration: string;
}

const VideoLink: React.FC<VideoLinkProps> = ({ title, url, duration }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-500">Duración: {duration}</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors font-medium"
        title="Ver video"
      >
        VER VIDEO
      </a>
    </div>
  );
};

export default VideoLink;