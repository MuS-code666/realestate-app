import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { dummyProperties } from '../data/dummyProperties'

export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="properties-page">
      <header className="properties-header">
        <div>
          <h1>物件一覧</h1>
          <p className="logged-in-user">{user?.email} でログイン中</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          ログアウト
        </button>
      </header>

      <div className="property-grid">
        {dummyProperties.map((property) => (
          <div className="property-card" key={property.id}>
            <h2>{property.name}</h2>
            <p className="property-rent">家賃：{property.rent}</p>
            <p className="property-area">エリア：{property.area}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
