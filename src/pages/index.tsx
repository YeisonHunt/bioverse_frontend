import { motion } from "framer-motion";
import { ArrowRight, ClipboardCheck, Activity, FileCheck2, Stethoscope, UserCheck, Database, ShieldCheck } from "lucide-react";
import { useRouter } from "next/router";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

const Questionnaire3D = () => (
  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 pointer-events-none">
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 3D Questionnaire Stack */}
      {[...Array(5)].map((_, i) => (
        <motion.g
          key={i}
          initial={{ y: 20 * i, opacity: 0 }}
          animate={{ 
            y: [20 * i, 15 * i, 20 * i],
            opacity: 1
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.2
            },
            opacity: { duration: 0.5, delay: i * 0.2 }
          }}
        >
          {/* Base Rectangle */}
          <rect
            x={40 - i * 2}
            y={40 - i * 2}
            width={120}
            height={160}
            rx={8}
            fill="currentColor"
            fillOpacity={0.1 - i * 0.02}
            stroke="currentColor"
            strokeWidth="0.5"
          />
          {/* Lines representing text */}
          {[...Array(6)].map((_, j) => (
            <line
              key={j}
              x1={55 - i * 2}
              y1={70 + j * 20 - i * 2}
              x2={145 - i * 2}
              y2={70 + j * 20 - i * 2}
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity={0.3 - i * 0.05}
            />
          ))}
          {/* Checkbox elements */}
          {[...Array(4)].map((_, j) => (
            <rect
              key={j}
              x={55 - i * 2}
              y={85 + j * 20 - i * 2}
              width={6}
              height={6}
              rx={1}
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
            />
          ))}
        </motion.g>
      ))}
    </motion.svg>
  </div>
);

//@ts-ignore childer props definition not needed
const FloatingCard = ({ delay = 0, x = 0, y = 0, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="absolute"
    style={{ left: `${50 + x}%`, top: `${50 + y}%` }}
  >
    <motion.div
      animate={{
        y: [-10, 10, -10],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay * 0.5,
      }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
    >
      {children}
    </motion.div>
  </motion.div>
);

export default function Home() {
  const router = useRouter();

  return (
    <div className={`${geist.className} relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900`}>
      {/* Gradient Orbs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
      <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

      <div className="relative z-10 flex min-h-screen">
        {/* Left Content Section */}
        <div className="flex-1 flex flex-col justify-center px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <motion.h1 
              className="text-7xl font-bold mb-6 text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Bioverse
            </motion.h1>
            
            <motion.p 
              className="text-xl mb-8 text-blue-100/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Transform your medical data collection with intelligent, 
              streamlined questionnaires designed for modern healthcare
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                onClick={() => router.push("/login")}
              >
                <span className="relative z-10">Start Your Assessment</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
                
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-25 bg-white"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.button>

              <div className="flex gap-8 text-blue-100/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Build with ❤️ by Yeison C.</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Visual Section */}
        <div className="flex-1 relative">
          <Questionnaire3D />
          
          <FloatingCard x={-20} y={-20}>
            <Activity className="w-8 h-8 text-blue-400" />
          </FloatingCard>
          
          <FloatingCard x={20} y={20}>
            <ClipboardCheck className="w-8 h-8 text-purple-400" />
          </FloatingCard>
          
          <FloatingCard x={-30} y={30}>
            <Stethoscope className="w-8 h-8 text-indigo-400" />
          </FloatingCard>
        </div>
      </div>
    </div>
  );
}