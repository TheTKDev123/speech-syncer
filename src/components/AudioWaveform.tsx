
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
          
          streamAnalyser.fftSize = 256;
          streamAnalyser.smoothingTimeConstant = 0.7;
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
      
      analyser.getByteFrequencyData(dataArray);
      
      // Make the background fully transparent
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      
      // Create a gradient for the visualizer with more vibrant colors
      const gradient = canvasCtx.createLinearGradient(0, HEIGHT / 2, WIDTH, HEIGHT / 2);
      gradient.addColorStop(0, '#8B5CF6');   // Vivid Purple
      gradient.addColorStop(0.5, '#D946EF'); // Magenta Pink
      gradient.addColorStop(1, '#F97316');   // Bright Orange
      
      // Draw the waveform as a smooth curve
      canvasCtx.beginPath();
      
      // Start path at the left edge
      canvasCtx.moveTo(0, HEIGHT);
      
      // Calculate bar width based on available data points
      const barWidth = (WIDTH / dataArray.length) * 2.5;
      let x = 0;
      
      // Draw the top part of the waveform
      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * HEIGHT * 0.8; // Scale down a bit
        const y = HEIGHT - barHeight;
        
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          // Use quadratic curves for smoother lines
          const prevX = x - barWidth;
          canvasCtx.quadraticCurveTo(
            prevX + barWidth / 2, 
            HEIGHT - (dataArray[i-1] / 255) * HEIGHT * 0.8, 
            x, 
            y
          );
        }
        
        x += barWidth;
      }
      
      // Complete the path back to bottom right and then to bottom left
      canvasCtx.lineTo(WIDTH, HEIGHT);
      canvasCtx.lineTo(0, HEIGHT);
      
      // Fill with gradient
      canvasCtx.fillStyle = gradient;
      canvasCtx.fill();
      
      // Add a subtle stroke for definition
      canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      canvasCtx.lineWidth = 1;
      canvasCtx.stroke();
      
      // Add glow effect
      canvasCtx.shadowColor = '#D946EF';
      canvasCtx.shadowBlur = 15;
      
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
    <div className="relative w-full h-32 overflow-hidden rounded-lg">
      {isListening ? (
        <canvas 
          ref={canvasRef} 
          className="w-full h-full" 
          width={500} 
          height={128}
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
