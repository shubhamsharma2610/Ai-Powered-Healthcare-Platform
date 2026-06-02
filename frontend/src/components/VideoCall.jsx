import React, { useState, useEffect } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { X, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';

export default function VideoCall({ roomName, displayName, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Force close any hanging connections
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleReady = () => {
    setIsLoading(false);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    document.body.style.overflow = 'auto';
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-white text-sm">Joining video call...</p>
            <p className="text-gray-400 text-xs mt-2">Please wait while we connect you</p>
          </div>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-200 shadow-lg"
      >
        <PhoneOff size={20} />
      </button>

      {/* Control Buttons (Optional - Jitsi has its own controls too) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-2 rounded-full transition-all ${isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`}
        >
          {isMuted ? <MicOff size={18} className="text-white" /> : <Mic size={18} className="text-white" />}
        </button>
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`p-2 rounded-full transition-all ${isVideoOff ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`}
        >
          {isVideoOff ? <VideoOff size={18} className="text-white" /> : <Video size={18} className="text-white" />}
        </button>
        <button
          onClick={handleClose}
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-all"
        >
          <PhoneOff size={18} className="text-white" />
        </button>
      </div>

      {/* Jitsi Meeting Component */}
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        config={{
          startWithAudioMuted: isMuted,
          startWithVideoMuted: isVideoOff,
          disableDeepLinking: true,
          enableNoAudioDetection: true,
          enableNoisyMicDetection: true,
          disableInviteFunctions: true,
          prejoinPageEnabled: false,
          toolbarButtons: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'feedback', 'tileview', 'download',
            'help', 'mute-everyone', 'security'
          ]
        }}
        userInfo={{
          displayName: displayName,
          email: ''
        }}
        getIFrameRef={(iframe) => {
          iframe.style.height = '100vh';
          iframe.style.width = '100vw';
          iframe.style.border = 'none';
        }}
        onReady={handleReady}
      />
    </div>
  );
}