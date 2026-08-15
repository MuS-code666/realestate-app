import { supabase } from './supabaseClient'

const TABLE_NAME = 'properties'

// 物件一覧を取得する
// RLSにより自分が登録した物件のみが返る
export async function fetchProperties() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 物件を新規登録する（user_idはDB側でauth.uid()から自動設定される）
export async function createProperty({ name, rent, area, layout }) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({ name, rent, area, layout })
    .select()
    .single()

  if (error) throw error
  return data
}

// 物件情報を更新する
export async function updateProperty(id, { name, rent, area, layout }) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ name, rent, area, layout })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// 物件を削除する
export async function deleteProperty(id) {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id)
  if (error) throw error
}
