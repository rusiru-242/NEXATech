import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Award, Gauge, ShieldCheck } from "lucide-react";
import Reveal from "../Reveal";

const capabilities = [
  {
    id: "01",
    title: "AI-Powered Shopping",
    desc: "Ask natural language questions and get instantaneous hardware recommendations customized to your budget.",
    icon: Sparkles,
  },
  {
    id: "02",
    title: "Curated Technology",
    desc: "Explore authentic electronics from verified manufacturers, complete with full manufacturer warranty backing.",
    icon: Award,
  },
  {
    id: "03",
    title: "Built for Performance",
    desc: "Rigorous thermal and benchmark verification ensuring your laptops, GPUs, and peripherals perform at peak.",
    icon: Gauge,
  },
  {
    id: "04",
    title: "Secure Shopping & Delivery",
    desc: "End-to-end encrypted card processing via Stripe, flexible Cash on Delivery, and live order tracking.",
    icon: ShieldCheck,
  },
];

export function WhyShopWithUs() {
  return (
    <section id="about" className="relative px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#00E5FF]"
            >
              The NexaTech Standard
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl"
            >
              WHY SHOP WITH US.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-gray-400 sm:text-sm"
            >
              We bridge state-of-the-art electronics with effortless ordering,
              authentic warranties, and dedicated guidance.
            </motion.p>
          </div>
        </Reveal>

        {/* Capability Rows Container */}
        <div className="mt-16 sm:mt-24 border-t border-white/10">
          {capabilities.map((cap, idx) => (
            <WhyShopRow key={cap.id} cap={cap} isLast={idx === capabilities.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyShopRow({ cap, isLast }) {
  const rowRef = useRef(null);

  // Track when the row crosses the screen from 85% down to 25% height
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 0.85", "start 0.25"],
  });

  // Overall row opacity (fades in as it enters, dims slightly as it leaves top)
  const rowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.35, 1, 1, 0.55]);

  // Text swap animation
  // yOld moves out of view up (-100%)
  const yOld = useTransform(scrollYProgress, [0.15, 0.5], ["0%", "-100%"]);
  // yNew moves into view from bottom (100% -> 0%)
  const yNew = useTransform(scrollYProgress, [0.15, 0.5], ["100%", "0%"]);

  // Icon animation
  const iconScale = useTransform(scrollYProgress, [0.2, 0.5], [0.9, 1]);
  const iconColor = useTransform(scrollYProgress, [0.2, 0.5], ["rgba(156, 163, 175, 1)", "rgba(0, 229, 255, 1)"]); // text-gray-400 to cyan
  const iconBorder = useTransform(scrollYProgress, [0.2, 0.5], ["rgba(255, 255, 255, 0.1)", "rgba(0, 229, 255, 0.4)"]); 
  
  // Divider highlight line
  const lineWidth = useTransform(scrollYProgress, [0.2, 0.7], ["0%", "20%"]);

  return (
    <motion.div
      ref={rowRef}
      style={{ opacity: rowOpacity }}
      className="relative group grid grid-cols-1 items-center gap-4 py-10 sm:grid-cols-12 sm:gap-8 sm:py-14"
    >
      <div className="flex items-center gap-4 sm:col-span-5">
        <motion.span 
          style={{ color: iconColor }}
          className="font-mono text-sm font-bold transition-colors duration-300"
        >
          //{cap.id}
        </motion.span>
        
        {/* Overflow hidden container for swap text effect */}
        <div className="relative h-10 sm:h-12 overflow-hidden flex flex-1 items-center">
          <motion.h3 
            style={{ y: yOld }}
            className="absolute inset-0 flex items-center text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            {cap.title}
          </motion.h3>
          <motion.h3 
            style={{ y: yNew }}
            className="absolute inset-0 flex items-center text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            {cap.title}
          </motion.h3>
        </div>
      </div>

      <motion.p 
        className="text-[13px] leading-relaxed text-gray-400 sm:col-span-6 sm:text-sm sm:leading-7"
      >
        {cap.desc}
      </motion.p>

      <div className="flex justify-start sm:justify-end sm:col-span-1">
        <motion.div 
          style={{ scale: iconScale, borderColor: iconBorder, color: iconColor }}
          className="flex h-12 w-12 items-center justify-center rounded-xl border bg-white/[0.02]"
        >
          <cap.icon size={20} />
        </motion.div>
      </div>

      {/* Base Divider */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-white/10" />
      
      {/* Cyan Animated Divider Highlight */}
      <motion.div 
        style={{ width: lineWidth }}
        className="absolute bottom-0 left-0 h-px bg-[#00E5FF]" 
      />
    </motion.div>
  );
}

export default WhyShopWithUs;
