
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
      
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      
      // Create a gradient for the visualizer
      const gradient = canvasCtx.createLinearGradient(0, 0, WIDTH, 0);
      gradient.addColorStop(0, '#9b87f5');   // Purple
      gradient.addColorStop(0.5, '#D946EF'); // Magenta Pink
      gradient.addColorStop(1, '#F97316');   // Bright Orange
      
      canvasCtx.fillStyle = '#1A1F2C'; // Dark background
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      
      const barWidth = (WIDTH / dataArray.length) * 2.5;
      let x = 0;
      
      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * HEIGHT;
        
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
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
    <div className="relative w-full h-32 bg-background/5 rounded-lg overflow-hidden">
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
