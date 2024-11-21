'use client'

import { motion } from 'framer-motion'

export default function LoadingComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:text-black">
      <div className="text-4xl font-bold mb-8 text-slate-950 dark:text-white-300">
        quizscribe
      </div>
      <div className="relative w-64 h-2 bg-slate-200 rounded-full overflow-hidden dark:bg-slate-100">
        <motion.div
          className="absolute top-0 left-0 h-full bg-slate-950 dark:bg-slate-200  "
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      <p className="mt-4 text-slate-950 dark:text-slate-950">Loading...</p>
    </div>
  )
}