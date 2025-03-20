
import React, { useEffect, useRef, useState } from 'react';

interface AudioWaveformProps {
  isListening: boolean;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ isListening }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let streamAnalyser: AnalyserNode | null = null;

    const setupAudio = async () => {
      try {
        if (isListening && !mediaStream) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setMediaStream(stream);
          
          audioContext = new AudioContext();
          const source = audioContext.createMediaStreamSource(stream);
          streamAnalyser = audioContext.createAnalyser();
          
          // Increase FFT size for more detailed visualization
          streamAnalyser.fftSize = 512;
          streamAnalyser.smoothingTimeConstant = 0.5;
          source.connect(streamAnalyser);
          
          const bufferLength = streamAnalyser.frequencyBinCount;
          const newDataArray = new Uint8Array(bufferLength);
          
          setAnalyser(streamAnalyser);
          setDataArray(newDataArray);
        }
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    if (isListening) {
      setupAudio();
    } else if (mediaStream) {
      // Stop all tracks when not listening
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
      setAnalyser(null);
      setDataArray(null);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, mediaStream]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser || !dataArray) return;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const draw = () => {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      
      // Get frequency data
      analyser.getByteFrequencyData(dataArray);
      
      // Clear the canvas with a dark purple background
      canvasCtx.fillStyle = 'rgba(248,250,252,255)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      
      // Set up variables for drawing
      const barWidth = 2; // Narrower bars
      const barSpacing = 1; // Space between bars
      const barCount = Math.min(dataArray.length, Math.floor(WIDTH / (barWidth + barSpacing)));
      const centerY = HEIGHT / 2;
      
      // Create gradients for top and bottom parts of the waveform
      const topGradient = canvasCtx.createLinearGradient(0, 0, WIDTH, 0);
      topGradient.addColorStop(0, '#8B5CF6');   // Purple
      topGradient.addColorStop(0.5, '#D946EF'); // Pink
      topGradient.addColorStop(1, '#F97316');   // Orange

      const bottomGradient = canvasCtx.createLinearGradient(0, 0, WIDTH, 0);
      bottomGradient.addColorStop(0, '#8B5CF6');   // Purple
      bottomGradient.addColorStop(0.5, '#D946EF'); // Pink
      bottomGradient.addColorStop(1, '#F97316');   // Orange
      
      // Draw each bar of the waveform
      for (let i = 0; i < barCount; i++) {
        // For visual interest, we'll use a multiplier that changes across the width
        const multiplier = 0.8 + Math.sin(i / barCount * Math.PI) * 0.3;
        
        // Calculate bar height based on frequency data
        const scaledData = dataArray[i] * multiplier;
        const barHeight = (scaledData / 255) * (HEIGHT / 2 - 10);
        
        // Position of this bar
        const x = (barWidth + barSpacing) * i;
        
        // Add glow effect
        canvasCtx.shadowColor = '#D946EF';
        canvasCtx.shadowBlur = 5;
        
        // Draw top part of the waveform (going up from center)
        canvasCtx.fillStyle = topGradient;
        canvasCtx.fillRect(x, centerY - barHeight, barWidth, barHeight);
        
        // Draw bottom part of the waveform (going down from center)
        canvasCtx.fillStyle = bottomGradient;
        canvasCtx.fillRect(x, centerY, barWidth, barHeight);
        
        // Add white line in the center for the "flat line" effect when quiet
        if (i % 4 === 0) {
          canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          canvasCtx.fillRect(x, centerY - 0.5, barWidth, 1);
        }
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, dataArray]);

  return (
    <div className="relative w-full h-40 overflow-hidden">
      {isListening ? (
        <canvas 
          ref={canvasRef} 
          className="w-full h-full" 
          width={1000} 
          height={200}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Audio paused</div>
        </div>
      )}
    </div>
  );
};

export default AudioWaveform;
