import React, { useState } from 'react';
import "./LearningVideosList.css";

const VIDEOS = [
  {
    id: 1,
    title: 'Recycling Awareness',
    description: 'Learn why recycling matters and how to recycle effectively.',
    src: '/videos/recycling.mp4',
  },
  {
    id: 2,
    title: 'Tree Plantation',
    description: 'Understand the importance of trees and plantation drives.',
    src: '/videos/treeplantation.mp4',
  },
  {
    id: 3,
    title: 'Magic Bin',
    description: 'Learn why recycling matters and how to recycle effectively.',
    src: '/videos/garbage.mp4',
  }
];

export default function LearningVideosList() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div className="videos-section">
      {/* Title */}
      <h3 className="videos-title"></h3>

      {/* Video Cards Row */}
      <div className="videos-row">
        {VIDEOS.map(video => (
          <div key={video.id} className="video-card">
            <div className="video-name">{video.title}</div>
            <p>{video.description}</p>
            <button className="video-btn" onClick={() => setActiveVideo(video)}>
              Watch
            </button>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h4>{activeVideo.title}</h4>
            <video width="100%" height="315" controls autoPlay>
              <source src={activeVideo.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button className="video-btn" onClick={() => setActiveVideo(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
