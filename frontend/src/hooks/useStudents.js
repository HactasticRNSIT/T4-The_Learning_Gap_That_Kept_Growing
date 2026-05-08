import { useCallback, useEffect, useState } from 'react'
import { getStudents } from '../services/studentService'

export function useStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getStudents()
      setStudents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    getStudents()
      .then((data) => {
        if (!ignore) {
          setStudents(data)
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  return { students, loading, error, refresh }
}
