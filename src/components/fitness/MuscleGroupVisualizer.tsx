import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';
import * as THREE from 'three';
import { 
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  ZoomInIcon,
  ZoomOutIcon,
  InfoIcon,
  TargetIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  CheckCircleIcon
} from 'lucide-react';

interface MuscleGroup {
  id: string;
  name: string;
  readiness: number;
  lastWorked: string;
  nextRecommended: string;
  status: 'ready' | 'recovering' | 'overworked';
  exercises: string[];
  position: [number, number, number];
  color: string;
}

interface MuscleGroupVisualizerProps {
  selectedMuscleGroup?: string;
  onMuscleSelect?: (muscleGroup: string) => void;
  showReadinessOnly?: boolean;
}

const MuscleGroupVisualizer: React.FC<MuscleGroupVisualizerProps> = ({
  selectedMuscleGroup,
  onMuscleSelect,
  showReadinessOnly = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [muscleData, setMuscleData] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(selectedMuscleGroup || null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewMode, setViewMode] = useState<'front' | 'back' | '3d'>('3d');
  const [rapidApiKey, setRapidApiKey] = useState<string>('');

  useEffect(() => {
    fetchRapidApiKey();
    fetchMuscleReadinessData();
  }, [user]);

  const fetchRapidApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from('configuration')
        .select('value')
        .eq('key', 'rapidapi_key')
        .eq('scope', 'service')
        .single();

      if (error) {
        console.warn('RapidAPI key not found in configuration:', error);
        return;
      }

      setRapidApiKey(data.value.api_key || '');
    } catch (error) {
      console.error('Error fetching RapidAPI key:', error);
    }
  };

  const fetchMuscleReadinessData = async () => {
    try {
      setLoading(true);
      
      // Fetch from RapidAPI if key is available
      if (rapidApiKey) {
        await fetchFromRapidAPI();
      } else {
        // Use mock data for demo
        setMuscleData(getMockMuscleData());
      }
    } catch (error) {
      console.error('Error fetching muscle data:', error);
      setMuscleData(getMockMuscleData());
    } finally {
      setLoading(false);
    }
  };

  const fetchFromRapidAPI = async () => {
    try {
      const response = await fetch('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error('RapidAPI request failed');
      }

      const bodyParts = await response.json();
      
      // Transform API data into muscle readiness data
      const muscleGroups = bodyParts.map((part: string, index: number) => ({
        id: part.toLowerCase().replace(/\s+/g, '-'),
        name: part.charAt(0).toUpperCase() + part.slice(1),
        readiness: Math.floor(Math.random() * 40) + 60, // 60-100%
        lastWorked: getRandomLastWorked(),
        nextRecommended: getNextRecommended(),
        status: getRandomStatus(),
        exercises: [`${part} exercise 1`, `${part} exercise 2`],
        position: getRandomPosition(),
        color: getReadinessColor(Math.floor(Math.random() * 40) + 60)
      }));

      setMuscleData(muscleGroups.slice(0, 12)); // Limit to 12 muscle groups
    } catch (error) {
      console.error('RapidAPI fetch failed:', error);
      setMuscleData(getMockMuscleData());
    }
  };

  const getMockMuscleData = (): MuscleGroup[] => [
    {
      id: 'chest',
      name: 'Chest',
      readiness: 95,
      lastWorked: '2 days ago',
      nextRecommended: 'Ready now',
      status: 'ready',
      exercises: ['Push-ups', 'Bench Press', 'Chest Flyes'],
      position: [0, 0.5, 0.8],
      color: '#10b981'
    },
    {
      id: 'shoulders',
      name: 'Shoulders',
      readiness: 78,
      lastWorked: '1 day ago',
      nextRecommended: 'Tomorrow',
      status: 'recovering',
      exercises: ['Shoulder Press', 'Lateral Raises', 'Front Raises'],
      position: [0, 0.8, 0.6],
      color: '#f59e0b'
    },
    {
      id: 'biceps',
      name: 'Biceps',
      readiness: 88,
      lastWorked: '3 days ago',
      nextRecommended: 'Ready now',
      status: 'ready',
      exercises: ['Bicep Curls', 'Hammer Curls', 'Chin-ups'],
      position: [0.4, 0.3, 0.7],
      color: '#10b981'
    },
    {
      id: 'triceps',
      name: 'Triceps',
      readiness: 65,
      lastWorked: 'Yesterday',
      nextRecommended: 'In 2 days',
      status: 'recovering',
      exercises: ['Tricep Dips', 'Overhead Press', 'Close-grip Push-ups'],
      position: [-0.4, 0.3, 0.7],
      color: '#f59e0b'
    },
    {
      id: 'abs',
      name: 'Core',
      readiness: 92,
      lastWorked: '2 days ago',
      nextRecommended: 'Ready now',
      status: 'ready',
      exercises: ['Planks', 'Crunches', 'Russian Twists'],
      position: [0, 0, 0.9],
      color: '#10b981'
    },
    {
      id: 'legs',
      name: 'Legs',
      readiness: 45,
      lastWorked: 'Yesterday',
      nextRecommended: 'In 3 days',
      status: 'overworked',
      exercises: ['Squats', 'Lunges', 'Leg Press'],
      position: [0, -0.8, 0.5],
      color: '#ef4444'
    }
  ];

  const getRandomLastWorked = () => {
    const options = ['Today', 'Yesterday', '2 days ago', '3 days ago', '4 days ago'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const getNextRecommended = () => {
    const options = ['Ready now', 'Tomorrow', 'In 2 days', 'In 3 days'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const getRandomStatus = (): 'ready' | 'recovering' | 'overworked' => {
    const statuses: ('ready' | 'recovering' | 'overworked')[] = ['ready', 'recovering', 'overworked'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getRandomPosition = (): [number, number, number] => [
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
    Math.random() * 0.5 + 0.5
  ];

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 85) return '#10b981'; // Green
    if (readiness >= 70) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'from-emerald-500 to-teal-600';
      case 'recovering': return 'from-amber-500 to-orange-600';
      case 'overworked': return 'from-red-500 to-pink-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return CheckCircleIcon;
      case 'recovering': return PlayIcon;
      case 'overworked': return AlertTriangleIcon;
      default: return InfoIcon;
    }
  };

  // 3D Muscle Point Component
  const MusclePoint: React.FC<{ muscle: MuscleGroup; isSelected: boolean; onClick: () => void }> = ({ 
    muscle, 
    isSelected, 
    onClick 
  }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
      if (meshRef.current && isSelected) {
        meshRef.current.rotation.y = state.clock.elapsedTime * 2;
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
      }
    });

    return (
      <mesh
        ref={meshRef}
        position={muscle.position}
        onClick={onClick}
        scale={isSelected ? 1.5 : 1}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial 
          color={muscle.color} 
          emissive={muscle.color}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
        />
        {isSelected && (
          <Html distanceFactor={10}>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-white/20 pointer-events-none">
              <div className="text-sm font-semibold text-slate-900">{muscle.name}</div>
              <div className="text-xs text-slate-600">{muscle.readiness}% ready</div>
            </div>
          </Html>
        )}
      </mesh>
    );
  };

  // 3D Body Model Component
  const BodyModel: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame(() => {
      if (groupRef.current && autoRotate) {
        groupRef.current.rotation.y += 0.005;
      }
    });

    return (
      <group ref={groupRef}>
        {/* Simple body wireframe */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.2, 1.5, 8]} />
          <meshStandardMaterial 
            color="#64748b" 
            wireframe 
            transparent 
            opacity={0.3} 
          />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial 
            color="#64748b" 
            wireframe 
            transparent 
            opacity={0.3} 
          />
        </mesh>
        
        {/* Arms */}
        <mesh position={[0.4, 0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 6]} />
          <meshStandardMaterial 
            color="#64748b" 
            wireframe 
            transparent 
            opacity={0.3} 
          />
        </mesh>
        <mesh position={[-0.4, 0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 6]} />
          <meshStandardMaterial 
            color="#64748b" 
            wireframe 
            transparent 
            opacity={0.3} 
          />
        </mesh>
        
        {/* Legs */}
        <mesh position={[0.15, -1.2, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 1, 6]} />
          <meshStandardMaterial 
            color="#64748b" 
            wireframe 
            transparent 
            opacity={0.3} 
          />
        </mesh>
        <mesh position={[-0.15, -1.2, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 1, 6]} />
          <meshStandardMaterial 
            color="#64748b" 
            wireframe 
            transparent 
            opacity={0.3} 
          />
        </mesh>

        {/* Muscle points */}
        {muscleData.map((muscle) => (
          <MusclePoint
            key={muscle.id}
            muscle={muscle}
            isSelected={selectedMuscle === muscle.id}
            onClick={() => {
              setSelectedMuscle(muscle.id);
              onMuscleSelect?.(muscle.id);
            }}
          />
        ))}
      </group>
    );
  };

  const selectedMuscleData = muscleData.find(m => m.id === selectedMuscle);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-slate-50 dark:bg-slate-900 rounded-2xl">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 dark:text-slate-400">Loading muscle readiness data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
            <TargetIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Muscle Readiness</h2>
            <p className="text-slate-600 dark:text-slate-400">Interactive 3D muscle group analysis</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={autoRotate ? 'Stop rotation' : 'Start rotation'}
          >
            {autoRotate ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setSelectedMuscle(null)}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Reset view"
          >
            <RotateCcwIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Visualizer */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-lg overflow-hidden">
            <div className="h-96 relative">
              <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <pointLight position={[-10, -10, -10]} intensity={0.4} />
                
                <BodyModel />
                
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  autoRotate={autoRotate}
                  autoRotateSpeed={1}
                />
              </Canvas>
              
              {/* Overlay Controls */}
              <div className="absolute top-4 left-4 space-y-2">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Click muscle groups to analyze
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>Ready</span>
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span>Recovering</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>Overworked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Muscle Details Panel */}
        <div className="space-y-4">
          {selectedMuscleData ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg"
            >
              <div className="space-y-6">
                {/* Muscle Header */}
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getStatusColor(selectedMuscleData.status)} rounded-xl flex items-center justify-center`}>
                    {React.createElement(getStatusIcon(selectedMuscleData.status), { className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedMuscleData.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 capitalize">
                      {selectedMuscleData.status}
                    </p>
                  </div>
                </div>

                {/* Readiness Score */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Readiness Score</span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedMuscleData.readiness}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <motion.div
                      className={`h-3 rounded-full ${
                        selectedMuscleData.readiness >= 85 ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
                        selectedMuscleData.readiness >= 70 ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                        'bg-gradient-to-r from-red-500 to-pink-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedMuscleData.readiness}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>

                {/* Training Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Last Worked</div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {selectedMuscleData.lastWorked}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Next Session</div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {selectedMuscleData.nextRecommended}
                    </div>
                  </div>
                </div>

                {/* Recommended Exercises */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Recommended Exercises</h4>
                  <div className="space-y-2">
                    {selectedMuscleData.exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{exercise}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedMuscleData.status === 'ready'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg'
                      : selectedMuscleData.status === 'recovering'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg'
                      : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white cursor-not-allowed'
                  }`}
                  disabled={selectedMuscleData.status === 'overworked'}
                >
                  {selectedMuscleData.status === 'ready' && 'Start Workout'}
                  {selectedMuscleData.status === 'recovering' && 'Light Training OK'}
                  {selectedMuscleData.status === 'overworked' && 'Rest Required'}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-2xl flex items-center justify-center mx-auto">
                  <InfoIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Select a Muscle Group
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Click on any muscle point to see detailed readiness analysis
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Muscle List */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">All Muscle Groups</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {muscleData.map((muscle) => (
                <button
                  key={muscle.id}
                  onClick={() => {
                    setSelectedMuscle(muscle.id);
                    onMuscleSelect?.(muscle.id);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    selectedMuscle === muscle.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: muscle.color }}
                    />
                    <span className="font-medium text-slate-900 dark:text-white">
                      {muscle.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {muscle.readiness}%
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {muscle.lastWorked}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overall Readiness Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Ready to Train',
              value: muscleData.filter(m => m.status === 'ready').length,
              total: muscleData.length,
              color: 'text-emerald-600',
              icon: CheckCircleIcon
            },
            {
              label: 'Recovering',
              value: muscleData.filter(m => m.status === 'recovering').length,
              total: muscleData.length,
              color: 'text-amber-600',
              icon: PlayIcon
            },
            {
              label: 'Overworked',
              value: muscleData.filter(m => m.status === 'overworked').length,
              total: muscleData.length,
              color: 'text-red-600',
              icon: AlertTriangleIcon
            },
            {
              label: 'Avg Readiness',
              value: Math.round(muscleData.reduce((sum, m) => sum + m.readiness, 0) / muscleData.length),
              total: 100,
              color: 'text-blue-600',
              icon: TrendingUpIcon
            }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl">
              <div className={`w-8 h-8 mx-auto mb-2 ${stat.color}`}>
                <stat.icon className="w-full h-full" />
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}{stat.label === 'Avg Readiness' ? '%' : `/${stat.total}`}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MuscleGroupVisualizer;