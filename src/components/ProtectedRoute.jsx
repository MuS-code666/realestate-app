import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ログインしていない場合はログイン画面へリダイレクトする
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="center-message">読み込み中...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
