import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 text-center text-white">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-cyan-200">404</p>
        <h1 className="mt-4 text-4xl font-black">Signal not found</h1>
        <p className="mt-3 text-slate-400">The route you opened is outside the AstraLearn interface.</p>
        <Link to="/home" className="primary-button mt-8">
          Go Home
        </Link>
      </div>
    </main>
  )
}

export default NotFound
