import { Button } from "@/components/ui/button";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Calculator, Home, Sparkles } from "lucide-react";
import { useEffect } from "react";

export default function Hero() {
  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: { duration: 8, repeat: Infinity, ease: "linear" },
    });
  }, [controls]);

  return (
    <section className="relative flex flex-col items-center justify-center py-20 px-4 overflow-hidden text-center">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 -z-10 blur-2xl opacity-70"
        animate={controls}
        style={{
          background:
            "linear-gradient(120deg, #a78bfa 0%, #f472b6 50%, #38bdf8 100%)",
          backgroundSize: "200% 200%",
        }}
      />
      {/* Sparkles */}
      <AnimatePresence>
        {[...Array(7)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute"
            initial={{
              opacity: 0,
              scale: 0.8,
              x: Math.random() * 700 - 350,
              y: Math.random() * 120 - 60,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1.3, 0.8],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 3,
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{ left: "50%", top: "50%" }}
          >
            <Sparkles className="h-8 w-8 text-purple-400 drop-shadow-lg" />
          </motion.span>
        ))}
      </AnimatePresence>
      <span className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform -rotate-6"></div>
        <Calculator className="h-20 w-20 text-primary relative animate-bounce" />
      </span>
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        Make Smarter Business Decisions
      </motion.h1>
      <motion.p
        className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto drop-shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        Leverage powerful financial tools and insights to drive your business growth.
      </motion.p>
      
      {/* <motion.div
        className="mt-8 flex gap-4 justify-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      >
        <Button
          size="lg"
          className="relative text-lg font-semibold px-8 py-4 rounded-full shadow-xl bg-gradient-to-br from-fuchsia-500 via-blue-500 to-cyan-400 text-white overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
        > */}
          {/* <motion.span
            className="absolute left-0 top-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Glow effect */}
            {/* <span className="absolute inset-0 bg-purple-400/30 blur-2xl rounded-full animate-pulse" />
          </motion.span> */} 
          {/* <span className="relative z-10 flex items-center gap-2">
            <Sparkles className="h-6 w-6 animate-spin-slow text-purple-200 drop-shadow" />
            Get Started
          </span> */}
        {/* </Button> */}
        {/* <Button
          size="lg"
          variant="outline"
          className="relative text-lg font-semibold px-8 py-4 rounded-full shadow-lg group"
        >
          Learn More
        </Button> */}
      {/* </motion.div> */}
    </section>
  );
}
