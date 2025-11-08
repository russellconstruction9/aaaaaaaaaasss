import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error.message)
          navigate('/login?error=auth_callback_failed')
          return
        }

        if (data?.session) {
          console.log('User confirmed and logged in:', data.session.user)
          navigate('/')
        } else {
          navigate('/login?message=email_confirmed')
        }
      } catch (err) {
        console.error('Unexpected auth callback error:', err)
        navigate('/login?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="auth-callback">
      <div className="loading-spinner">
        <p>Confirming your account...</p>
      </div>
    </div>
  )
}