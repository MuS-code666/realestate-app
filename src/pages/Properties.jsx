import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/properties'
import PropertyForm from '../components/PropertyForm'

export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // フォームの表示状態：'none'（非表示）/ 'create'（新規登録）/ 'edit'（編集）
  const [formMode, setFormMode] = useState('none')
  const [editingProperty, setEditingProperty] = useState(null)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const data = await fetchProperties()
      setProperties(data)
    } catch (error) {
      setErrorMessage('物件情報の取得に失敗しました：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const handleCreate = async (values) => {
    setSubmitting(true)
    setErrorMessage('')
    try {
      const created = await createProperty(values)
      setProperties((prev) => [created, ...prev])
      setFormMode('none')
    } catch (error) {
      setErrorMessage('物件の登録に失敗しました：' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (values) => {
    setSubmitting(true)
    setErrorMessage('')
    try {
      const updated = await updateProperty(editingProperty.id, values)
      setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setFormMode('none')
      setEditingProperty(null)
    } catch (error) {
      setErrorMessage('物件の更新に失敗しました：' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('この物件を削除しますか？')
    if (!confirmed) return

    setErrorMessage('')
    try {
      await deleteProperty(id)
      setProperties((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      setErrorMessage('物件の削除に失敗しました：' + error.message)
    }
  }

  const startCreate = () => {
    setEditingProperty(null)
    setFormMode('create')
  }

  const startEdit = (property) => {
    setEditingProperty(property)
    setFormMode('edit')
  }

  const closeForm = () => {
    setFormMode('none')
    setEditingProperty(null)
  }

  return (
    <div className="properties-page">
      <header className="properties-header">
        <div>
          <h1>物件一覧</h1>
          <p className="logged-in-user">{user?.email} でログイン中</p>
        </div>
        <div className="header-actions">
          <button className="primary-button" onClick={startCreate}>
            新規登録
          </button>
          <button className="logout-button" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {formMode !== 'none' && (
        <PropertyForm
          initialValues={formMode === 'edit' ? editingProperty : null}
          onSubmit={formMode === 'edit' ? handleUpdate : handleCreate}
          onCancel={closeForm}
          submitting={submitting}
        />
      )}

      {loading ? (
        <p>読み込み中...</p>
      ) : properties.length === 0 ? (
        <p>登録されている物件がありません。「新規登録」から追加してください。</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <h2>{property.name}</h2>
              <p className="property-rent">家賃：{property.rent.toLocaleString()}円</p>
              <p className="property-area">エリア：{property.area}</p>
              <p className="property-layout">間取り：{property.layout}</p>
              <div className="property-card-actions">
                <button onClick={() => startEdit(property)}>編集</button>
                <button className="danger-button" onClick={() => handleDelete(property.id)}>
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
