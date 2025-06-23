import React, { useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import './VideoStartScreen.css'; // We will create this CSS file next

const VideoStartScreen = ({ onFinish }) => {
  useEffect(() => {
    // Announce to the Farcaster client that the app is ready to be displayed.
    // This hides the splash screen and shows this component.
    // Note: sdk.actions.ready() is now also called in App.jsx to handle cases
    // where VideoStartScreen is skipped. Multiple calls should be safe.
    console.log('[VideoStartScreen] Component mounted, sdk.actions.ready() may have already been called in App.jsx');
    // We can still call it here as a fallback - the SDK should handle duplicate calls gracefully
    try {
      sdk.actions.ready();
    } catch (error) {
      console.log('[VideoStartScreen] sdk.actions.ready() error (may be expected if already called):', error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="video-start-screen" onClick={onFinish}>
      <video
        // Assuming your video is placed here:
        src="/assets/videos/intro_video.mp4"
        autoPlay // Attempt to autoplay
        loop     // Loop the video
        muted    // CRITICAL: Mute the video for reliable autoplay
        playsInline // Important for playback on mobile devices
        className="intro-video"
        onEnded={onFinish} // Also call onFinish when video naturally ends
      />
      <div className="start-prompt">
        <p>Click anywhere to begin</p>
      </div>
    </div>
  );
};

export default VideoStartScreen; 