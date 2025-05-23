import { useEffect } from "react";
import { BarChart, Wrench, Brain } from "lucide-react";

const services = [
  // Full Form Calculators
  { icon: Wrench, title: "Startup Cost Calculator", desc: "Estimate your initial capital requirements for launching a business.", color: "from-blue-500 to-cyan-400" },
  { icon: Wrench, title: "Burn Rate Calculator", desc: "Determine how quickly your startup is spending capital.", color: "from-blue-500 to-cyan-400" },
  { icon: Wrench, title: "Revenue & Expenses Projection", desc: "Forecast revenues and expenses over a 24-month period.", color: "from-blue-500 to-cyan-400" },
  { icon: Wrench, title: "Cash Flow Projection", desc: "Project your cash inflows and outflows for the next 24 months.", color: "from-blue-500 to-cyan-400" },
  { icon: Wrench, title: "Profitability Calculator", desc: "Analyze your profit margins and break-even point.", color: "from-blue-500 to-cyan-400" },
  { icon: Wrench, title: "Break-Even Analysis", desc: "Identify the sales volume needed to cover your costs.", color: "from-blue-500 to-cyan-400" },
  { icon: Wrench, title: "Liquidity Ratios", desc: "Compute current and quick ratios to assess your short-term solvency.", color: "from-blue-500 to-cyan-400" },
  { icon: Wrench, title: "Profitability Ratios", desc: "Calculate gross, operating, and net profit margins.", color: "from-blue-500 to-cyan-400" },
  { icon: Wrench, title: "Leverage Ratios", desc: "Measure debt levels relative to equity and assets.", color: "from-blue-500 to-cyan-400" },
  { icon: Wrench, title: "Growth Ratios", desc: "Assess year-over-year growth in sales, profits, and assets.", color: "from-blue-500 to-cyan-400" },

  // Quick Tools
  { icon: Wrench, title: "Quick Calculations", desc: "Perform single-step financial computations quickly.", color: "from-yellow-400 to-orange-400" },

  // Tools & Documents
  { icon: BarChart, title: "Planning Documents", desc: "Guides and templates to structure your business strategy.", color: "from-fuchsia-500 to-pink-400" },
  { icon: Brain, title: "Calculator Guides", desc: "Step-by-step instructions for using each calculator.", color: "from-green-400 to-emerald-400" },
  { icon: Brain, title: "Financial Concepts", desc: "Key business finance concepts explained clearly.", color: "from-green-400 to-emerald-400" },
  { icon: Brain, title: "Industry Benchmarks", desc: "Standard performance metrics for your sector.", color: "from-green-400 to-emerald-400" },
  { icon: Brain, title: "How-to Guides", desc: "Practical tutorials for core business tasks.", color: "from-green-400 to-emerald-400" },
  { icon: Brain, title: "Case Studies", desc: "Real-world examples of successful business operations.", color: "from-green-400 to-emerald-400" },
  { icon: Brain, title: "Startup Guides", desc: "Comprehensive manuals for launching new ventures.", color: "from-green-400 to-emerald-400" },
];


import { motion, useAnimation } from "framer-motion";

function InfiniteScroller({ cards }: { cards: typeof services }) {
  const controls = useAnimation();
  // Duplicate the cards for seamless looping
  const cardSet = [...cards, ...cards];
  const CARD_WIDTH = 320; // w-80
  const GAP = 24; // space-x-6
  const TOTAL_WIDTH = cardSet.length * (CARD_WIDTH + GAP);

  // Start the animation
  const startAnimation = () => {
    controls.start({
      x: [0, -(cardSet.length / 2) * (CARD_WIDTH + GAP)],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 130, // Scroll speed (lower = faster)
        ease: "linear"
      }
    });
  };

  useEffect(() => {
    startAnimation();
    // eslint-disable-next-line
  }, []);

  return (
    <motion.div
      className="flex space-x-6"
      style={{ width: TOTAL_WIDTH }}
      animate={controls}
      onMouseEnter={() => controls.stop()}
      onMouseLeave={startAnimation}
    >
      {cardSet.map((srv, i) => (
        <div
          key={srv.title + i}
          className={`flex-shrink-0 w-80 group p-6 rounded-3xl bg-gradient-to-br ${srv.color} shadow-2xl hover:shadow-2xl hover:scale-105 transition-transform duration-300 relative`}
        >
          <div className="absolute right-6 top-6 opacity-10 text-white text-8xl pointer-events-none">
            <BarChart className="h-24 w-24" />
          </div>
          <div className="relative z-10 flex flex-col items-start">
            <span className="inline-flex items-center justify-center rounded-full bg-white/20 p-3 mb-4 animate-pulse">
              <BarChart className="h-8 w-8 text-white drop-shadow" />
            </span>
            <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{srv.title}</h3>
            <p className="text-white/90 mb-0 drop-shadow-sm">{srv.desc}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function Services() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-fuchsia-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        viewport={{ once: true }}
      >
        Our Services
      </motion.h2>
      <div className="relative py-8 overflow-hidden">
        {/* Infinite horizontal scroller */}
        <InfiniteScroller cards={services} />
      </div>
    </section>
  );
}
