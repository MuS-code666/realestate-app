import { createClient } from '@supabase/supabase-js'

// SupabaseのURLとキーは環境変数（.env）から取得する
// .envはGitの管理対象外（.gitignoreに追加済み）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabaseの接続情報が設定されていません。.envファイルを確認してください。'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
