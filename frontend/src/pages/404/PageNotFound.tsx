import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { ROUTE } from '@/core/constants/path'

const PageNotFound = () => {
  return (
    <div className='flex relative flex-col justify-center items-center min-h-screen bg-workspace-gradient dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      {/* Animated background elements */}
      <motion.div
        className='overflow-hidden absolute inset-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute rounded-full'
            style={{
              width: `${(i + 1) * 150}px`,
              height: `${(i + 1) * 150}px`,
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? 'rgba(0, 64, 128, 0.14)' : 'rgba(234, 244, 255, 0.55)'
              } 0%, transparent 70%)`
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.2, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut'
            }}
          />
        ))}
      </motion.div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className='absolute w-2 h-2 bg-brand-primary rounded-full'
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Content */}
      <div className='relative z-10 text-center'>
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 1
          }}
        >
          <h1 className='text-9xl font-bold text-brand-primary dark:text-blue-300'>404</h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className='mt-4 text-3xl font-semibold text-gray-800 dark:text-gray-200'>Không tìm thấy trang</h2>
          <p className='mt-2 text-lg text-gray-600 dark:text-gray-400'>Trang bạn đang tìm kiếm không tồn tại.</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            to={ROUTE.PUBLIC.HOME}
            className='inline-flex gap-2 items-center px-8 py-4 mt-8 text-lg font-semibold text-white bg-brand-primary rounded-lg shadow-lg transition-all group hover:scale-105 hover:bg-brand-primary-hover hover:shadow-xl'
          >
            <motion.svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2.5}
              stroke='currentColor'
              className='w-6 h-6'
              initial={{ x: 0 }}
              animate={{ x: [-4, 4, -4] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18' />
            </motion.svg>
            <span>Quay lại Trang chủ</span>
          </Link>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className='absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-white dark:from-gray-900'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      />
    </div>
  )
}

export default PageNotFound
