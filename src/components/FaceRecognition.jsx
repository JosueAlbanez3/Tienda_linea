// components/FaceRecognition.jsx
import { useEffect, useRef, useState } from 'react';

const FaceRecognition = ({ onFaceDetected, onError }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false); // Cambiado a false
  const [isDetecting, setIsDetecting] = useState(false);
  const [status, setStatus] = useState('Listo para verificación facial');

  // Iniciar la cámara - SOLO CÁMARA, SIN DETECCIÓN
  const startCamera = async () => {
    try {
      setStatus('Iniciando cámara...');
      console.log('📹 Iniciando cámara...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(() => {
            console.log('✅ Cámara activada correctamente');
            setIsDetecting(true);
            setStatus('Cámara activa - Mira a la cámara para verificación');
            
            // Iniciar el proceso de verificación simulada
            startFaceVerification();
          });
        };
      }
    } catch (error) {
      console.error('❌ Error accediendo a la cámara:', error);
      setStatus(`Error: No se pudo acceder a la cámara`);
      onError(`No se pudo acceder a la cámara: ${error.message}`);
    }
  };

  // Verificación facial SIMULADA
  const startFaceVerification = () => {
    console.log('🔍 Iniciando verificación facial simulada...');
    setStatus('Analizando rostro...');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      
      if (progress <= 100) {
        setStatus(`Analizando rostro... ${progress}%`);
        drawProgress(progress);
      }
      
      if (progress === 100) {
        clearInterval(interval);
        
        // Simular éxito en la detección
        setTimeout(() => {
          console.log('✅ Verificación facial completada (simulada)');
          setStatus('✅ Verificación exitosa!');
          drawSuccess();
          
          // Esperar 1 segundo y proceder
          setTimeout(() => {
            onFaceDetected(new Float32Array(128)); // Descriptor simulado
            setIsDetecting(false);
          }, 1000);
        }, 500);
      }
    }, 400);
  };

  // Dibujar progreso en el canvas
  const drawProgress = (progress) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Ajustar canvas al tamaño del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Dibujar círculo de progreso
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 60;
    
    // Círculo de fondo
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Círculo de progreso
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -0.5 * Math.PI, (-0.5 + (progress / 100) * 2) * Math.PI);
    ctx.stroke();
    
    // Texto de progreso
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${progress}%`, centerX, centerY + 8);
    
    // Texto de estado
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText('Verificando identidad...', centerX, centerY + 50);
  };

  // Dibujar éxito
  const drawSuccess = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Ajustar canvas al tamaño del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Dibujar círculo de éxito
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Dibujar checkmark
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(centerX - 25, centerY);
    ctx.lineTo(centerX - 5, centerY + 20);
    ctx.lineTo(centerX + 30, centerY - 20);
    ctx.stroke();
    
    // Texto de éxito
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✅ VERIFICADO', centerX, centerY + 100);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsDetecting(false);
    setStatus('Verificación cancelada');
    
    // Limpiar canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="face-recognition-container">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Verificación Facial
        </h3>
        <p className="text-sm text-gray-600">{status}</p>
        
        <div className="mt-2 p-2 bg-blue-50 rounded">
          <p className="text-xs text-blue-800">
            💡 <strong>MODO SIMULACIÓN:</strong> Se muestra el flujo completo de verificación
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-auto"
            muted
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
          
          {/* Overlay de guía */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
            <div className="border-2 border-green-400 rounded-full w-48 h-48 flex items-center justify-center">
              <div className="text-green-400 text-center">
                <div className="text-lg">👤</div>
                <div className="text-xs mt-2">Coloca tu rostro aquí</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {!isDetecting ? (
            <button
              onClick={startCamera}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              🎥 Iniciar Verificación Facial
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              ⏹️ Cancelar Verificación
            </button>
          )}
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800 text-center">
              ✅ <strong>SOLUCIÓN IMPLEMENTADA:</strong> Flujo de verificación facial simulado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;