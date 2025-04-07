import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Activity, Brain, Users, ArrowLeft, Camera, Upload, Eye, Fingerprint, X, ChevronDown, ChevronUp, Heart, Leaf, Droplet, Shield, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Custom Components
const AnimatedRoute = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const FeatureCard = ({ icon, title, description, image, link, linkText }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  link: string;
  linkText: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="bg-[#232936] rounded-lg overflow-hidden relative"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="h-48 relative overflow-hidden">
        <motion.img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#232936] to-transparent" />
      </div>
      <div className="p-8">
        <div className="bg-[#1a1f2e] p-8 rounded-lg mb-6 inline-block hover:bg-[#3BB7E7]/10 transition-colors">
          {icon}
        </div>
        <h3 className="text-white text-xl font-semibold mb-3 hover:text-[#3BB7E7] transition-colors">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <Link to={link} className="text-[#3BB7E7] hover:text-[#2a9ac5] flex items-center space-x-2 group">
          <span>{linkText}</span>
          <ArrowLeft className="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
};

const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const incrementTime = (duration * 1000) / end;
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [inView, value, duration]);

  return <span ref={ref}>{count}+</span>;
};

// Navbar remains mostly the same but with animation
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`${scrolled ? 'bg-[#1a1f2e] shadow-lg' : 'bg-transparent'} fixed w-full z-50 p-4 transition-all duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Activity className="w-6 h-6 text-[#3BB7E7]" />
          <span className="text-white text-xl font-bold">IronBites</span>
        </Link>
        <div className="hidden md:flex space-x-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/detect">Detect Anemia</NavLink>
          <NavLink to="/diet">Diet Plan</NavLink>
          <NavLink to="/info">Info Hub</NavLink>
          <NavLink to="/about">About Us</NavLink>
        </div>
        <MobileMenu />
      </div>
    </motion.nav>
  );
}

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-300 hover:text-[#3BB7E7] focus:outline-none"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute right-4 mt-2 w-56 bg-[#232936] rounded-md shadow-lg z-50"
          >
            <div className="py-1">
              <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/detect" onClick={() => setIsOpen(false)}>Detect Anemia</MobileNavLink>
              <MobileNavLink to="/diet" onClick={() => setIsOpen(false)}>Diet Plan</MobileNavLink>
              <MobileNavLink to="/info" onClick={() => setIsOpen(false)}>Info Hub</MobileNavLink>
              <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>About Us</MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#3BB7E7]/10 hover:text-[#3BB7E7]"
    >
      {children}
    </Link>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-gray-300 hover:text-[#3BB7E7] transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3BB7E7] transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}

// Enhanced Home Page
function Home() {
  const stats = [
    { value: 25, label: 'Million people affected by anemia globally', icon: <Users className="w-8 h-8" /> },
    { value: 50, label: 'Of pregnant women suffer from anemia', icon: <Heart className="w-8 h-8" /> },
    { value: 80, label: 'Cases are due to iron deficiency', icon: <Droplet className="w-8 h-8" /> },
    { value: 90, label: 'Can be prevented with proper diet', icon: <Leaf className="w-8 h-8" /> },
  ];

  return (
    <div className="min-h-screen bg-[#1a1f2e] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#3BB7E7]/10"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3BB7E7] to-[#5ce7ff]">
                Early Detection
              </span>
              <br />
              for Better Health
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-8">
              Quick, accurate anemia detection and personalized diet recommendations
              to help you maintain optimal health.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/detect"
                className="inline-block bg-gradient-to-r from-[#3BB7E7] to-[#5ce7ff] text-white px-8 py-3 rounded-full hover:opacity-90 transition-all shadow-lg shadow-[#3BB7E7]/30"
              >
                Start Detection
              </Link>
              <Link
                to="/info"
                className="inline-block border border-[#3BB7E7] text-[#3BB7E7] px-8 py-3 rounded-full hover:bg-[#3BB7E7]/10 transition-all"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-[#232936]/80 backdrop-blur-sm rounded-xl p-6 border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-[#3BB7E7] mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  <AnimatedCounter value={stat.value} />%
                </h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Objective Section */}
          <motion.div 
            className="bg-[#232936]/80 backdrop-blur-sm rounded-xl p-8 mb-20 border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Objective</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-400 text-lg mb-4">
                  IronBites aims to revolutionize anemia detection by making it accessible, quick, and non-invasive. Our platform combines cutting-edge technology with user-friendly interfaces to help people identify potential anemia symptoms early.
                </p>
                <p className="text-gray-400 text-lg">
                  We believe that early detection and proper nutrition are key to preventing and managing anemia effectively. Our mission is to empower individuals with the knowledge and tools they need to maintain optimal health.
                </p>
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden">
                <motion.img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80" 
                  alt="Healthcare technology" 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#232936] to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            <FeatureCard
              icon={<Brain className="w-16 h-16 text-[#3BB7E7]" />}
              title="Info Hub"
              description="Learn about anemia, its causes, symptoms, and prevention methods. Access comprehensive resources and expert insights."
              image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80"
              link="/info"
              linkText="Explore"
            />
            <FeatureCard
              icon={<Activity className="w-16 h-16 text-[#3BB7E7]" />}
              title="Diet Recommender"
              description="Receive personalized meal plans and dietary recommendations based on your health profile and nutritional needs."
              image="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80"
              link="/diet"
              linkText="Learn more"
            />
            <FeatureCard
              icon={<Users className="w-16 h-16 text-[#3BB7E7]" />}
              title="About Us"
              description="Learn about our mission to make anemia detection accessible and help people maintain better health through early intervention."
              image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
              link="/about"
              linkText="Learn more"
            />
          </motion.div>

          {/* Diet Plan Section */}
          <motion.div 
            className="bg-[#232936]/80 backdrop-blur-sm rounded-xl p-8 mb-20 border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Recommended Diet Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-[#1a1f2e] rounded-xl overflow-hidden group"
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80" 
                    alt="Iron-rich foods" 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#3BB7E7] transition-colors">Iron-Rich Foods</h3>
                  <ul className="text-gray-400 space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#3BB7E7] mr-2">•</span>
                      <span>Lean red meat and poultry</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3BB7E7] mr-2">•</span>
                      <span>Leafy green vegetables</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3BB7E7] mr-2">•</span>
                      <span>Beans and lentils</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3BB7E7] mr-2">•</span>
                      <span>Fortified cereals</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
              <motion.div 
                className="bg-[#1a1f2e] rounded-xl overflow-hidden group"
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img 
                    src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80" 
                    alt="Vitamin C rich foods" 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#3BB7E7] transition-colors">Vitamin C Rich Foods</h3>
                  <ul className="text-gray-400 space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#3BB7E7] mr-2">•</span>
                      <span>Citrus fruits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3BB7E7] mr-2">•</span>
                      <span>Bell peppers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3BB7E7] mr-2">•</span>
                      <span>Strawberries</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#3BB7E7] mr-2">•</span>
                      <span>Tomatoes</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Enhanced CameraView with better UX
function CameraView({ onCapture, onClose }: { onCapture: (image: string) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flash, setFlash] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    setCountdown(3);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          takePicture();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const takePicture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const image = canvas.toDataURL('image/jpeg');
      onCapture(image);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-[#232936] rounded-xl p-4 w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-xl">Camera View</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {countdown && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="text-white text-6xl font-bold">{countdown}</div>
              </div>
            )}
            
            {flash && (
              <div className="absolute inset-0 bg-white animate-pulse"></div>
            )}
            
            {/* Camera overlay guides */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white/50 rounded-full w-64 h-64"></div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={captureImage}
              className="bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <div className="bg-[#3BB7E7] w-14 h-14 rounded-full flex items-center justify-center">
                {countdown ? (
                  <div className="text-white font-bold">{countdown}</div>
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </div>
            </button>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button 
            className="p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors"
            onClick={() => {
              if (stream) {
                const tracks = stream.getVideoTracks();
                tracks.forEach(track => {
                  track.applyConstraints({
                    facingMode: track.getConstraints().facingMode === 'user' ? 'environment' : 'user'
                  });
                });
              }
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v7h7V4h9v16h-9v-7H4v7H2V4h2z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced DetectAnemia Page with API integration
function DetectAnemia() {
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [detectionType, setDetectionType] = useState<'eye' | 'nail'>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [step, setStep] = useState<'initial' | 'select' | 'capture'>(capturedImage ? 'capture' : 'initial');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [result, setResult] = useState<{ 
    status: 'normal' | 'anemia' | 'error'; 
    confidence: number;
    type?: string;
    success?: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function dataURLtoBlob(dataURL: string): Blob {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)![1];
    const binary = atob(data);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
  }
  
  // Function to send image to backend
  async function sendImageToBackend(imageData: string | File, type: 'eye' | 'nail') {  
    try {
        const formData = new FormData();
        let fileToSend: File;
        
        if (typeof imageData === 'string') {
            const blob = dataURLtoBlob(imageData);
            fileToSend = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
        } else {
            fileToSend = imageData;
        }
        
        formData.append('file', fileToSend);
        const endpoint = `http://localhost:5000/api/predict/${type}`;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error || 
                `Request failed with status ${response.status}`
            );
        }
        
        return await response.json();
    } catch (error) {
        console.error('Full error:', error);
        throw new Error(
            error instanceof Error ? error.message : 'Unknown error occurred'
        );
    }
}
  
  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setCapturedImage(reader.result as string);
    reader.readAsDataURL(file);
    
    setStep('capture');
    setError(null);
    
    let interval: ReturnType<typeof setInterval> | null = null;
    
    try {
      setAnalysisProgress(0);
      interval = setInterval(() => {
        setAnalysisProgress(prev => (prev < 100 ? prev + 10 : 100));
      }, 200);
      
      const result = await sendImageToBackend(file, detectionType);
      
      if (interval) clearInterval(interval);
      setAnalysisProgress(100);
      setAnalysisComplete(true);
      
      if (result && result.success) {
        setResult({
          status: result.prediction === 'Anemia Detected' ? 'anemia' : 'normal',
          confidence: result.confidence,
          type: result.type
        });
      } else {
        setResult({ 
          status: 'error', 
          confidence: 0 
        });
        setError(result?.error || 'An error occurred during analysis');
      }
    } catch (error) {
      if (interval) clearInterval(interval);
      setAnalysisProgress(0);
      setAnalysisComplete(true);
      setResult({ 
        status: 'error', 
        confidence: 0 
      });
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  
  // Make similar changes to handleCameraCapture
  const handleCameraCapture = async (imageDataURL: string) => {
    setCapturedImage(imageDataURL);
    setShowCamera(false);
    setStep('capture');
    setError(null);
    
    let interval: ReturnType<typeof setInterval> | null = null;
    
    try {
      setAnalysisProgress(0);
      interval = setInterval(() => {
        setAnalysisProgress(prev => (prev < 100 ? prev + 10 : 100));
      }, 200);
      
      const result = await sendImageToBackend(imageDataURL, detectionType);
      
      if (interval) clearInterval(interval);
      setAnalysisProgress(100);
      setAnalysisComplete(true);
      
      if (result && result.success) {
        setResult({
          status: result.prediction === 'Anemia Detected' ? 'anemia' : 'normal',
          confidence: result.confidence,
          type: result.type
        });
      } else {
        setResult({ 
          status: 'error', 
          confidence: 0 
        });
        setError(result?.error || 'An error occurred during analysis');
      }
    } catch (error) {
      if (interval) clearInterval(interval);
      setAnalysisProgress(0);
      setAnalysisComplete(true);
      setResult({ 
        status: 'error', 
        confidence: 0 
      });
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  const goBack = () => {
    if (step === 'capture') {
      setCapturedImage(null);
      setStep('select');
      setAnalysisComplete(false);
      setResult(null);
      setError(null);
    } else if (step === 'select') {
      setStep('initial');
      setDetectionType(null);
    } else {
      navigate(-1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400';
      case 'anemia': return 'text-red-400';
      case 'error': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'normal': return 'Your hemoglobin levels appear to be within the normal range.';
      case 'anemia': return 'Anemia detected. We recommend consulting a healthcare provider.';
      case 'error': return 'An error occurred during analysis. Please try again.';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e]">
      <div className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <button
            onClick={goBack}
            className="text-[#3BB7E7] mb-8 flex items-center space-x-2 hover:text-[#2a9ac5] group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>

          <div className="text-center mb-16">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Anemia <span className="text-[#3BB7E7]">Detection</span>
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Quick, non-invasive screening using advanced image analysis technology.
            </motion.p>
          </div>

          {step === 'initial' && (
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  className="bg-[#232936] p-8 rounded-xl border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-[#3BB7E7]/10 p-4 rounded-lg">
                      <Camera className="w-8 h-8 text-[#3BB7E7]" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-semibold">Capture Image</h3>
                      <p className="text-gray-400 text-sm">Use your device camera</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('select')}
                    className="w-full bg-gradient-to-r from-[#3BB7E7] to-[#5ce7ff] text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Use Camera</span>
                  </button>
                </motion.div>

                <motion.div 
                  className="bg-[#232936] p-8 rounded-xl border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-[#3BB7E7]/10 p-4 rounded-lg">
                      <Upload className="w-8 h-8 text-[#3BB7E7]" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-semibold">Upload Image</h3>
                      <p className="text-gray-400 text-sm">Select from your device</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('select')}
                    className="w-full bg-gradient-to-r from-[#3BB7E7] to-[#5ce7ff] text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Choose Image</span>
                  </button>
                </motion.div>
              </div>
              <p className="text-center text-gray-400 mt-8">
                Select an option to begin your anemia detection process
              </p>
            </motion.div>
          )}

          {step === 'select' && (
            <motion.div 
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Select Image Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  className="bg-[#232936] p-8 rounded-xl border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-[#3BB7E7]/10 p-4 rounded-lg">
                      <Eye className="w-8 h-8 text-[#3BB7E7]" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-semibold">Eye Detection</h3>
                      <p className="text-gray-400 text-sm">For conjunctiva analysis</p>
                    </div>
                  </div>
                  <div className="bg-[#1a1f2e] p-6 rounded-lg">
                    <div className="flex flex-col space-y-4">
                      <div className="text-center">
                        <Eye className="w-8 h-8 text-[#3BB7E7] mx-auto mb-2" />
                        <span className="text-white text-sm block">Eye Analysis</span>
                      </div>
                      <button
                        onClick={() => {
                          setDetectionType('eye');
                          setShowCamera(true);
                        }}
                        className="w-full bg-gradient-to-r from-[#3BB7E7] to-[#5ce7ff] text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                      >
                        <Camera className="w-5 h-5" />
                        <span>Use Camera</span>
                      </button>
                      <label className="w-full bg-[#2a2f3c] text-white py-3 px-4 rounded-lg hover:bg-[#353b4a] flex items-center justify-center space-x-2 cursor-pointer transition-colors">
                        <Upload className="w-5 h-5" />
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setDetectionType('eye');
                              handleFileUpload(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-[#232936] p-8 rounded-xl border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-[#3BB7E7]/10 p-4 rounded-lg">
                      <Fingerprint className="w-8 h-8 text-[#3BB7E7]" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-semibold">Nail Detection</h3>
                      <p className="text-gray-400 text-sm">For pallor detection</p>
                    </div>
                  </div>
                  <div className="bg-[#1a1f2e] p-6 rounded-lg">
                    <div className="flex flex-col space-y-4">
                      <div className="text-center">
                        <Fingerprint className="w-8 h-8 text-[#3BB7E7] mx-auto mb-2" />
                        <span className="text-white text-sm block">Nail Analysis</span>
                      </div>
                      <button
                        onClick={() => {
                          setDetectionType('nail');
                          setShowCamera(true);
                        }}
                        className="w-full bg-gradient-to-r from-[#3BB7E7] to-[#5ce7ff] text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                      >
                        <Camera className="w-5 h-5" />
                        <span>Use Camera</span>
                      </button>
                      <label className="w-full bg-[#2a2f3c] text-white py-3 px-4 rounded-lg hover:bg-[#353b4a] flex items-center justify-center space-x-2 cursor-pointer transition-colors">
                        <Upload className="w-5 h-5" />
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setDetectionType('nail');
                              handleFileUpload(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={() => setStep('initial')}
                  className="text-[#3BB7E7] flex items-center space-x-2 mx-auto hover:text-[#2a9ac5] group"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Detection Options</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 'capture' && capturedImage && (
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Image Analysis</h2>
              <div className="bg-[#232936] p-8 rounded-xl">
                <div className="mb-6">
                  <h3 className="text-white text-xl font-semibold mb-4">Captured Image</h3>
                  <div className="relative h-96 rounded-lg overflow-hidden border border-[#3BB7E7]/30">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {!analysisComplete ? (
                  <div className="mb-8">
                    <h3 className="text-white text-xl font-semibold mb-4">Analyzing Image</h3>
                    <div className="w-full bg-[#1a1f2e] rounded-full h-4 mb-2">
                      <div 
                        className="bg-gradient-to-r from-[#3BB7E7] to-[#5ce7ff] h-4 rounded-full transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-right">{analysisProgress}%</p>
                  </div>
                ) : result ? (
                  <motion.div 
                    className="mb-8 p-6 rounded-lg bg-[#1a1f2e] border border-[#3BB7E7]/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Analysis Result</h3>
                    <div className="flex items-center mb-4">
                      <div className={`text-3xl font-bold mr-4 ${getStatusColor(result.status)}`}>
                        {result.status === 'normal' ? 'No Anemia' : result.status === 'anemia' ? 'Anemia Detected' : 'Error'}
                      </div>
                      {result.status !== 'error' && (
                        <div className="text-gray-400">
                          Confidence: {result.confidence}%
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 mb-4">
                      {getStatusDescription(result.status)}
                    </p>
                    {error && (
                      <p className="text-red-400 mb-4">{error}</p>
                    )}
                    {result.status === 'anemia' && (
                      <Link 
                        to="/diet" 
                        className="inline-block bg-[#3BB7E7] text-white px-6 py-2 rounded-lg hover:bg-[#2a9ac5] transition-colors"
                      >
                        View Diet Recommendations
                      </Link>
                    )}
                  </motion.div>
                ) : null}

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => setStep('select')}
                    className="bg-[#3BB7E7] text-white px-8 py-3 rounded-full hover:bg-[#2a9ac5] transition-colors"
                  >
                    Take Another Photo
                  </button>
                  {result && (
                    <button
                      onClick={() => navigate('/info')}
                      className="border border-[#3BB7E7] text-[#3BB7E7] px-8 py-3 rounded-full hover:bg-[#3BB7E7]/10 transition-colors"
                    >
                      Learn About Anemia
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {showCamera && (
            <CameraView
              onCapture={handleCameraCapture}
              onClose={() => setShowCamera(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Enhanced AboutUs Page
function AboutUs() {
  return (
    <div className="min-h-screen bg-[#1a1f2e] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl font-bold text-white mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About <span className="text-[#3BB7E7]">IronBites</span>
        </motion.h1>
        
        {/* Mission Section */}
        <motion.div 
          className="bg-[#232936] rounded-xl p-8 mb-12 border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-gray-400 text-lg mb-6">
            At IronBites, we're dedicated to making anemia detection accessible to everyone. Our platform combines innovative technology with medical expertise to provide quick, accurate, and non-invasive anemia screening.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#1a1f2e] p-6 rounded-lg border border-[#3BB7E7]/10">
              <div className="text-[#3BB7E7] mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Accuracy</h3>
              <p className="text-gray-400">Advanced algorithms trained on thousands of medical images</p>
            </div>
            <div className="bg-[#1a1f2e] p-6 rounded-lg border border-[#3BB7E7]/10">
              <div className="text-[#3BB7E7] mb-4">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Accessibility</h3>
              <p className="text-gray-400">Available anytime, anywhere with just a smartphone</p>
            </div>
            <div className="bg-[#1a1f2e] p-6 rounded-lg border border-[#3BB7E7]/10">
              <div className="text-[#3BB7E7] mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Empathy</h3>
              <p className="text-gray-400">Designed with patient needs and concerns in mind</p>
            </div>
          </div>
        </motion.div>

        {/* Prevention Section */}
        <motion.div 
          className="bg-[#232936] rounded-xl p-8 mb-12 border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Preventing Anemia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-[#1a1f2e] rounded-xl overflow-hidden group"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80" 
                  alt="Healthy diet" 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#3BB7E7] transition-colors">Maintain a Balanced Diet</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Include iron-rich foods in your daily meals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Eat foods high in vitamin C to improve iron absorption</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Consume adequate protein sources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Include folate-rich foods in your diet</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            <motion.div 
              className="bg-[#1a1f2e] rounded-xl overflow-hidden group"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80" 
                  alt="Regular checkups" 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#3BB7E7] transition-colors">Regular Health Checkups</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Monitor your iron levels regularly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Get routine blood tests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Stay aware of your body's signals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Consult healthcare providers when needed</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Lifestyle Section */}
        <motion.div 
          className="bg-[#232936] rounded-xl p-8 border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Healthy Lifestyle Habits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-[#1a1f2e] p-6 rounded-xl border border-[#3BB7E7]/10 group"
              whileHover={{ y: -5 }}
            >
              <div className="text-[#3BB7E7] mb-4">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#3BB7E7] transition-colors">Exercise Regularly</h3>
              <p className="text-gray-400">
                Regular physical activity helps improve blood circulation and overall health, which can help prevent anemia.
              </p>
            </motion.div>
            <motion.div 
              className="bg-[#1a1f2e] p-6 rounded-xl border border-[#3BB7E7]/10 group"
              whileHover={{ y: -5 }}
            >
              <div className="text-[#3BB7E7] mb-4">
                <Droplet className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#3BB7E7] transition-colors">Stay Hydrated</h3>
              <p className="text-gray-400">
                Proper hydration is essential for maintaining healthy blood volume and circulation.
              </p>
            </motion.div>
            <motion.div 
              className="bg-[#1a1f2e] p-6 rounded-xl border border-[#3BB7E7]/10 group"
              whileHover={{ y: -5 }}
            >
              <div className="text-[#3BB7E7] mb-4">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#3BB7E7] transition-colors">Manage Stress</h3>
              <p className="text-gray-400">
                Chronic stress can affect your body's ability to absorb nutrients properly.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced DietPlan Page
function DietPlan() {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const weeklyPlan = [
    {
      day: "Monday",
      meals: {
        breakfast: "Iron-fortified cereal with milk and strawberries",
        lunch: "Lean beef burger with spinach on whole wheat bun",
        dinner: "Grilled salmon with quinoa and steamed broccoli",
        snacks: ["Handful of pumpkin seeds", "Orange slices"]
      },
      nutrients: {
        iron: "18mg",
        vitaminC: "120mg",
        protein: "85g"
      }
    },
    {
      day: "Tuesday",
      meals: {
        breakfast: "Scrambled eggs with spinach and whole wheat toast",
        lunch: "Lentil soup with whole grain bread",
        dinner: "Chicken stir-fry with bell peppers and brown rice",
        snacks: ["Dried apricots", "Handful of almonds"]
      },
      nutrients: {
        iron: "16mg",
        vitaminC: "90mg",
        protein: "78g"
      }
    },
    {
      day: "Wednesday",
      meals: {
        breakfast: "Greek yogurt with granola and blueberries",
        lunch: "Tuna salad sandwich with tomato on whole wheat",
        dinner: "Beef and vegetable stew with sweet potato",
        snacks: ["Kiwi fruit", "Trail mix"]
      },
      nutrients: {
        iron: "17mg",
        vitaminC: "110mg",
        protein: "82g"
      }
    },
    {
      day: "Thursday",
      meals: {
        breakfast: "Oatmeal with raisins and walnuts",
        lunch: "Chickpea and spinach salad with lemon dressing",
        dinner: "Turkey meatballs with whole wheat pasta and tomato sauce",
        snacks: ["Apple with peanut butter", "Dark chocolate"]
      },
      nutrients: {
        iron: "15mg",
        vitaminC: "85mg",
        protein: "80g"
      }
    },
    {
      day: "Friday",
      meals: {
        breakfast: "Smoothie with spinach, banana, and almond milk",
        lunch: "Grilled chicken wrap with whole wheat tortilla",
        dinner: "Baked cod with roasted vegetables and quinoa",
        snacks: ["Edamame beans", "Strawberries"]
      },
      nutrients: {
        iron: "14mg",
        vitaminC: "95mg",
        protein: "75g"
      }
    },
    {
      day: "Saturday",
      meals: {
        breakfast: "Whole wheat pancakes with blueberries",
        lunch: "Beef and vegetable kebabs with couscous",
        dinner: "Vegetable and tofu stir-fry with brown rice",
        snacks: ["Pistachios", "Mango slices"]
      },
      nutrients: {
        iron: "16mg",
        vitaminC: "100mg",
        protein: "78g"
      }
    },
    {
      day: "Sunday",
      meals: {
        breakfast: "Avocado toast with poached eggs",
        lunch: "Salmon salad with mixed greens and citrus dressing",
        dinner: "Roast chicken with roasted root vegetables",
        snacks: ["Hummus with carrot sticks", "Dark cherries"]
      },
      nutrients: {
        iron: "17mg",
        vitaminC: "105mg",
        protein: "85g"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1f2e] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl font-bold text-white mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Personalized <span className="text-[#3BB7E7]">Diet Plan</span>
        </motion.h1>

        {/* Introduction */}
        <motion.div 
          className="bg-[#232936] rounded-xl p-8 mb-12 border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Understanding Anemia Diet</h2>
          <p className="text-gray-400 text-lg mb-6">
            A well-balanced diet rich in iron and other essential nutrients is crucial for preventing and managing anemia. Our diet plan focuses on foods that help increase iron absorption and maintain healthy blood levels.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1f2e] p-4 rounded-lg border border-[#3BB7E7]/10">
              <h3 className="text-lg font-semibold text-[#3BB7E7] mb-2">Heme Iron Sources</h3>
              <p className="text-gray-400 text-sm">Found in animal foods like meat, poultry, and fish, more easily absorbed by the body.</p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-lg border border-[#3BB7E7]/10">
              <h3 className="text-lg font-semibold text-[#3BB7E7] mb-2">Non-Heme Iron</h3>
              <p className="text-gray-400 text-sm">Found in plant foods like beans, lentils, and spinach, better absorbed with vitamin C.</p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-lg border border-[#3BB7E7]/10">
              <h3 className="text-lg font-semibold text-[#3BB7E7] mb-2">Enhancers & Inhibitors</h3>
              <p className="text-gray-400 text-sm">Vitamin C enhances absorption, while tea/coffee can inhibit it.</p>
            </div>
          </div>
        </motion.div>

        {/* Weekly Meal Plan */}
        <motion.div 
          className="bg-[#232936] rounded-xl p-8 mb-12 border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">7-Day Meal Plan</h2>
          <div className="space-y-4">
            {weeklyPlan.map((dayPlan, index) => (
              <motion.div 
                key={index}
                className="bg-[#1a1f2e] rounded-xl overflow-hidden border border-[#3BB7E7]/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left"
                >
                  <h3 className="text-xl font-semibold text-white">{dayPlan.day}</h3>
                  {expandedDay === index ? (
                    <ChevronUp className="text-[#3BB7E7]" />
                  ) : (
                    <ChevronDown className="text-[#3BB7E7]" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedDay === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-lg font-semibold text-[#3BB7E7] mb-3">Meals</h4>
                          <div className="space-y-4">
                            <div>
                              <h5 className="text-white font-medium mb-1">Breakfast</h5>
                              <p className="text-gray-400">{dayPlan.meals.breakfast}</p>
                            </div>
                            <div>
                              <h5 className="text-white font-medium mb-1">Lunch</h5>
                              <p className="text-gray-400">{dayPlan.meals.lunch}</p>
                            </div>
                            <div>
                              <h5 className="text-white font-medium mb-1">Dinner</h5>
                              <p className="text-gray-400">{dayPlan.meals.dinner}</p>
                            </div>
                            <div>
                              <h5 className="text-white font-medium mb-1">Snacks</h5>
                              <ul className="text-gray-400">
                                {dayPlan.meals.snacks.map((snack, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-[#3BB7E7] mr-2">•</span>
                                    <span>{snack}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-[#3BB7E7] mb-3">Nutritional Info</h4>
                          <div className="bg-[#232936] rounded-lg p-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <div className="text-white font-bold text-xl">{dayPlan.nutrients.iron}</div>
                                <div className="text-gray-400 text-sm">Iron</div>
                              </div>
                              <div>
                                <div className="text-white font-bold text-xl">{dayPlan.nutrients.vitaminC}</div>
                                <div className="text-gray-400 text-sm">Vitamin C</div>
                              </div>
                              <div>
                                <div className="text-white font-bold text-xl">{dayPlan.nutrients.protein}</div>
                                <div className="text-gray-400 text-sm">Protein</div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6">
                            <h5 className="text-white font-medium mb-2">Tips for the Day</h5>
                            <ul className="text-gray-400 space-y-2">
                              <li className="flex items-start">
                                <span className="text-[#3BB7E7] mr-2">•</span>
                                <span>Drink orange juice with breakfast to enhance iron absorption</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-[#3BB7E7] mr-2">•</span>
                                <span>Avoid tea/coffee within 1 hour of meals</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-[#3BB7E7] mr-2">•</span>
                                <span>Stay hydrated throughout the day</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Shopping List */}
        <motion.div 
          className="bg-[#232936] rounded-xl p-8 mb-12 border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Shopping List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1a1f2e] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#3BB7E7] mb-4">Proteins</h3>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Lean beef</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Chicken breast</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Salmon fillets</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Eggs</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Lentils</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Chickpeas</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#1a1f2e] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#3BB7E7] mb-4">Vegetables</h3>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Spinach</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Broccoli</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Bell peppers</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Sweet potatoes</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Carrots</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Tomatoes</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#1a1f2e] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#3BB7E7] mb-4">Fruits</h3>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Oranges</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Strawberries</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Blueberries</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Kiwi</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Dried apricots</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Raisins</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#1a1f2e] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#3BB7E7] mb-4">Grains & Others</h3>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Whole wheat bread</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Brown rice</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Quinoa</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Iron-fortified cereal</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Almonds</span>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded text-[#3BB7E7]" />
                  <span>Pumpkin seeds</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Nutritional Information */}
        <motion.div 
          className="bg-[#232936] rounded-xl p-8 mb-12 border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Nutritional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-[#1a1f2e] rounded-xl overflow-hidden group"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80" 
                  alt="Iron-rich foods" 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[#3BB7E7] transition-colors">Iron-Rich Foods</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Red meat (3.5mg/100g)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Spinach (2.7mg/100g)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Lentils (3.3mg/100g)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Fortified cereals (18mg/serving)</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            <motion.div 
              className="bg-[#1a1f2e] rounded-xl overflow-hidden group"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img 
                  src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80" 
                  alt="Vitamin C sources" 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[#3BB7E7] transition-colors">Vitamin C Sources</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Oranges (53mg/100g)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Bell peppers (128mg/100g)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Strawberries (59mg/100g)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Broccoli (89mg/100g)</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            <motion.div 
              className="bg-[#1a1f2e] rounded-xl overflow-hidden group"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80" 
                  alt="Daily requirements" 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[#3BB7E7] transition-colors">Daily Requirements</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Iron: 18mg (women)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Vitamin C: 75mg</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Vitamin B12: 2.4mcg</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Folate: 400mcg</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div 
          className="bg-[#232936] rounded-xl p-8 border border-[#3BB7E7]/20 hover:border-[#3BB7E7]/40 transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Healthy Eating Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-[#1a1f2e] rounded-xl overflow-hidden group"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img 
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80" 
                  alt="Healthy snacks" 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[#3BB7E7] transition-colors">Meal Preparation</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Cook in batches for the week</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Store meals in portion containers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Keep healthy snacks ready</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Prepare smoothie ingredients</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            <motion.div 
              className="bg-[#1a1f2e] rounded-xl overflow-hidden group"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80" 
                  alt="Important tips" 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[#3BB7E7] transition-colors">Cooking Tips</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Use cast iron cookware</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Pair iron-rich foods with vitamin C</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Soak beans and grains before cooking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3BB7E7] mr-2">•</span>
                    <span>Limit tea/coffee around meal times</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced InfoHub Page
function InfoHub() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'types' | 'diagnosis' | 'treatment'>('overview');

  const hemoglobinRanges = {
    normal: { min: 13.5, max: 17.5, label: 'Normal', color: 'text-green-400', icon: '✓' },
    mild: { min: 11.0, max: 13.4, label: 'Mild Anemia', color: 'text-yellow-400', icon: '!' },
    moderate: { min: 8.0, max: 10.9, label: 'Moderate Anemia', color: 'text-orange-400', icon: '!!' },
    severe: { min: 0, max: 7.9, label: 'Severe Anemia', color: 'text-red-400', icon: '!!!' }
  };

  const faqs = [
    {
      question: "What is Anemia?",
      answer: "Anemia is a condition where your blood doesn't have enough healthy red blood cells or hemoglobin to carry oxygen to your body's tissues. This can cause fatigue, weakness, and other symptoms.",
      image: "https://thumbs.dreamstime.com/z/symptoms-causes-iron-deficiency-anemia-vector-icon-set-template-use-medical-agitation-symptoms-causes-iron-180432786.jpg?ct=jpeg"
    },
    {
      question: "What are the common causes of Anemia?",
      answer: "Common causes include iron deficiency, vitamin B12 deficiency, chronic diseases, blood loss, and certain genetic conditions. Women are particularly at risk due to menstruation and pregnancy.",
      image: "https://www.researchgate.net/profile/Stefano-Ciannella-2/publication/369662166/figure/fig5/AS:11431281255125416@1719406015268/Different-types-of-anemia-and-respective-symptoms-and-causes.png"
    },
    {
      question: "How is Anemia diagnosed?",
      answer: "Anemia is typically diagnosed through blood tests that measure hemoglobin levels, red blood cell count, and other related markers. Our platform offers a non-invasive screening tool to help identify potential anemia symptoms early.",
      image: "https://www.clinicalpainadvisor.com/wp-content/uploads/sites/15/2023/10/Anemia-GettyImages-1474767837.jpg"
    },
    {
      question: "Can Anemia be prevented?",
      answer: "Yes, many types of anemia can be prevented through a balanced diet rich in iron and vitamins, regular health checkups, and proper management of underlying conditions.",
      image: "https://img.freepik.com/free-photo/healthy-food-medical-equipment_23-2148108966.jpg"
    }
  ];

  const anemiaTypes = [
    {
      type: "Iron-Deficiency Anemia",
      description: "The most common type, caused by insufficient iron to produce hemoglobin.",
      causes: "Poor diet, blood loss, increased iron needs",
      treatment: "Iron supplements, dietary changes"
    },
    {
      type: "Vitamin Deficiency Anemia",
      description: "Caused by low levels of vitamin B12 or folate needed for red blood cell production.",
      causes: "Poor diet, malabsorption, pernicious anemia",
      treatment: "Vitamin supplements, dietary changes"
    },
    {
      type: "Aplastic Anemia",
      description: "Occurs when the body stops producing enough new blood cells.",
      causes: "Autoimmune disorders, infections, toxic exposures",
      treatment: "Medications, blood transfusions, stem cell transplant"
    },
    {
      type: "Hemolytic Anemia",
      description: "Occurs when red blood cells are destroyed faster than they can be made.",
      causes: "Inherited conditions, infections, autoimmune disorders",
      treatment: "Medications, blood transfusions, spleen removal"
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1f2e] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl font-bold text-white mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Anemia <span className="text-[#3BB7E7]">Information Hub</span>
        </motion.h1>

        {/* Tab Navigation */}
        <motion.div 
          className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium rounded-t-lg mr-2 whitespace-nowrap ${activeTab === 'overview' ? 'bg-[#3BB7E7] text-white' : 'bg-[#232936] text-gray-300 hover:bg-[#2a2f3c]'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('types')}
            className={`px-6 py-3 font-medium rounded-t-lg mr-2 whitespace-nowrap ${activeTab === 'types' ? 'bg-[#3BB7E7] text-white' : 'bg-[#232936] text-gray-300 hover:bg-[#2a2f3c]'}`}
          >
            Types of Anemia
          </button>
          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`px-6 py-3 font-medium rounded-t-lg mr-2 whitespace-nowrap ${activeTab === 'diagnosis' ? 'bg-[#3BB7E7] text-white' : 'bg-[#232936] text-gray-300 hover:bg-[#2a2f3c]'}`}
          >
            Diagnosis
          </button>
          <button
            onClick={() => setActiveTab('treatment')}
            className={`px-6 py-3 font-medium rounded-t-lg whitespace-nowrap ${activeTab === 'treatment' ? 'bg-[#3BB7E7] text-white' : 'bg-[#232936] text-gray-300 hover:bg-[#2a2f3c]'}`}
          >
            Treatment Options
          </button>
        </motion.div>

        {/* Tab Content */}
        <div className="bg-[#232936] rounded-xl p-8 mb-12">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Understanding Anemia</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">What is Anemia?</h3>
                  <p className="text-gray-400 mb-6">
                    Anemia is a condition that occurs when your blood doesn't have enough healthy red blood cells or hemoglobin to carry oxygen to your body's tissues. This can lead to fatigue, weakness, and other health complications.
                  </p>
                  <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#3BB7E7]/10">
                    <h3 className="text-xl font-semibold text-white mb-4">Common Symptoms</h3>
                    <ul className="text-gray-400 space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Fatigue and weakness</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Pale or yellowish skin</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Irregular heartbeats</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Shortness of breath</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Dizziness or lightheadedness</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Cold hands and feet</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img 
                      src="https://www.practostatic.com/health-wiki/images/cb8ccddf2928265068953a8006db2142.jpg" 
                      alt="Anemia symptoms" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.everydayhealth.com/images/seo-graphic-content-initiative/eh-how-anemia-affects-the-body-seo-graphics.png?w=1110" 
                      alt="Blood test" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'types' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">Types of Anemia</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {anemiaTypes.map((type, index) => (
                  <motion.div
                    key={index}
                    className="bg-[#1a1f2e] rounded-lg p-6 border border-[#3BB7E7]/10"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-xl font-semibold text-[#3BB7E7] mb-3">{type.type}</h3>
                    <p className="text-gray-400 mb-4">{type.description}</p>
                    <div className="bg-[#232936] rounded-lg p-4 mb-3">
                      <h4 className="text-white font-medium mb-2">Common Causes:</h4>
                      <p className="text-gray-400">{type.causes}</p>
                    </div>
                    <div className="bg-[#232936] rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Treatment Options:</h4>
                      <p className="text-gray-400">{type.treatment}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'diagnosis' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">Diagnosing Anemia</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Medical Tests</h3>
                  <p className="text-gray-400 mb-4">
                    Anemia is typically diagnosed through a series of blood tests that measure different components of your blood and iron levels.
                  </p>
                  <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#3BB7E7]/10">
                    <h4 className="text-lg font-semibold text-white mb-3">Common Diagnostic Tests:</h4>
                    <ul className="text-gray-400 space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Complete Blood Count (CBC)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Hemoglobin and Hematocrit levels</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Serum Iron and Ferritin tests</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Vitamin B12 and Folate levels</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Reticulocyte count</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Hemoglobin Level Ranges</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {Object.entries(hemoglobinRanges).map(([key, range]) => (
                      <div key={key} className="bg-[#1a1f2e] rounded-lg p-6 text-center border border-[#3BB7E7]/10">
                        <div className={`text-2xl mb-2 ${range.color}`}>{range.icon}</div>
                        <h3 className={`text-xl font-semibold ${range.color} mb-2`}>{range.label}</h3>
                        <p className="text-gray-400">{range.min} - {range.max} g/dL</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#3BB7E7]/10">
                    <h4 className="text-lg font-semibold text-white mb-3">Understanding Results</h4>
                    <p className="text-gray-400">
                      Normal ranges may vary slightly by laboratory. Women typically have lower hemoglobin levels than men. Always consult with a healthcare provider to interpret your test results.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'treatment' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">Treatment Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Medical Treatments</h3>
                  <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#3BB7E7]/10 mb-6">
                    <h4 className="text-lg font-semibold text-[#3BB7E7] mb-3">Iron Supplementation</h4>
                    <p className="text-gray-400 mb-2">
                      For iron-deficiency anemia, doctors often prescribe iron supplements. These work best when taken on an empty stomach with vitamin C to enhance absorption.
                    </p>
                    <ul className="text-gray-400 space-y-1">
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Ferrous sulfate is the most common form</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>May cause constipation or stomach upset</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Typically needed for 3-6 months</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#3BB7E7]/10">
                    <h4 className="text-lg font-semibold text-[#3BB7E7] mb-3">Other Treatments</h4>
                    <ul className="text-gray-400 space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span><strong>Vitamin B12 injections:</strong> For pernicious anemia</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span><strong>Blood transfusions:</strong> For severe anemia</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span><strong>Erythropoiesis-stimulating agents:</strong> Medications that stimulate bone marrow</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span><strong>Treating underlying conditions:</strong> Such as chronic diseases or bleeding disorders</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Lifestyle and Home Remedies</h3>
                  <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#3BB7E7]/10 mb-6">
                    <h4 className="text-lg font-semibold text-[#3BB7E7] mb-3">Dietary Changes</h4>
                    <p className="text-gray-400 mb-2">
                      Eating a diet rich in iron and other nutrients can help prevent and treat certain types of anemia.
                    </p>
                    <ul className="text-gray-400 space-y-1">
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Include iron-rich foods like red meat, beans, and leafy greens</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Combine iron-rich foods with vitamin C sources</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Avoid tea, coffee, and calcium-rich foods with iron sources</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Consider fortified cereals and breads</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#1a1f2e] rounded-lg p-6 border border-[#3BB7E7]/10">
                    <h4 className="text-lg font-semibold text-[#3BB7E7] mb-3">Other Recommendations</h4>
                    <ul className="text-gray-400 space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Manage underlying health conditions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Practice good hygiene to prevent infections</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Get regular exercise to improve circulation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Prioritize rest and manage fatigue</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#3BB7E7] mr-2">•</span>
                        <span>Stay hydrated</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* FAQ Section */}
        <motion.div 
          className="bg-[#232936] rounded-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-[#1a1f2e] rounded-xl overflow-hidden border border-[#3BB7E7]/10"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left"
                >
                  <span className="text-white font-semibold text-lg">{faq.question}</span>
                  {expandedFaq === index ? (
                    <Minus className="text-[#3BB7E7]" />
                  ) : (
                    <Plus className="text-[#3BB7E7]" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <p className="text-gray-400">{faq.answer}</p>
                        <div className="relative h-48 rounded-lg overflow-hidden">
                          <img 
                            src={faq.image}
                            alt={faq.question}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#1a1f2e]">
        <Navbar />
        <Routes>
          <Route path="/" element={<AnimatedRoute><Home /></AnimatedRoute>} />
          <Route path="/detect" element={<AnimatedRoute><DetectAnemia /></AnimatedRoute>} />
          <Route path="/about" element={<AnimatedRoute><AboutUs /></AnimatedRoute>} />
          <Route path="/diet" element={<AnimatedRoute><DietPlan /></AnimatedRoute>} />
          <Route path="/info" element={<AnimatedRoute><InfoHub /></AnimatedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;