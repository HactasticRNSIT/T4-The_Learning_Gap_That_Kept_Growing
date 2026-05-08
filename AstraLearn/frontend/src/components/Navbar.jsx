// src/components/Navbar.jsx

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className='sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-lg'
    >
      <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
        <Link to='/' className='text-2xl font-bold text-primary'>
          AstraLearn
        </Link>

        <div className='flex items-center gap-6'>
          <Link to='/' className='hover:text-primary'>Home</Link>
          <Link to='/dashboard' className='hover:text-primary'>Dashboard</Link>
          <Link to='/login' className='hover:text-primary'>Login</Link>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar