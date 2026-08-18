import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#050505]">

      {/* Subtle atmosphere */}

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5FF]/[0.035] blur-[150px]" />
      </div>

      {/* Main */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-[1400px] items-center px-5 py-12 sm:px-8 sm:py-14 lg:py-16">

        <div className="w-full">

          {/* Eyebrow */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mb-5 flex items-center gap-3 sm:mb-6"
          >

            <span className="h-2 w-2 rounded-full bg-[#00E5FF]" />

            <span className="text-xs font-medium uppercase tracking-[0.22em] text-gray-400">
              Next Generation Electronics
            </span>

          </motion.div>

          {/* Giant Heading */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.25,
              duration: 1,
            }}
            className="pointer-events-none"
          >

            <h1 className="max-w-[1200px] text-[14vw] font-black leading-[0.78] tracking-[-0.075em] text-white sm:text-[12vw] lg:text-[10vw]">

              TECHNOLOGY

              <span className="block text-gray-500">
                FOR WHAT'S
              </span>

              <span className="block text-[#00E5FF]">
                NEXT.
              </span>

            </h1>

          </motion.div>

          {/* Bottom Hero Content */}

          <div className="mt-8 flex flex-col gap-6 border-t border-white/10 pt-5 sm:mt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:pt-6">

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.7,
                duration: 0.8,
              }}
              className="max-w-md text-sm leading-6 text-gray-500 sm:text-base"
            >
              Premium electronics, powerful gaming gear
              and intelligent technology designed for the
              next generation.
            </motion.p>

            <motion.a
              href="#products"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.8,
                duration: 0.8,
              }}
              className="group flex w-fit items-center gap-3 border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
            >

              Explore Products

              <ArrowDownRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
              />

            </motion.a>

          </div>

        </div>

      </div>

      {/* Bottom label */}

      <div className="absolute bottom-5 right-6 z-20 hidden text-[10px] uppercase tracking-[0.3em] text-gray-600 sm:right-8 md:block">

      </div>

    </section>
  );
}

export default Hero;