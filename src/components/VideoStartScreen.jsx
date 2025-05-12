import React from 'react';
import './VideoStartScreen.css'; // We will create this CSS file next

const VideoStartScreen = ({ onStartClick }) => {
  return (
    <div className="video-start-screen">
      <video
        // Assuming your video is placed here:
        src="/assets/videos/intro_video.mp4"
        autoPlay // Attempt to autoplay
        loop     // Loop the video
        muted    // CRITICAL: Mute the video for reliable autoplay
        playsInline // Important for playback on mobile devices
        className="intro-video"
      />
      <button className="start-button pixel-button" onClick={onStartClick}>
        Start
      </button>
    </div>
  );
};

export default VideoStartScreen; 