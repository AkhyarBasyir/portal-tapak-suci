export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'image'
  | 'file'
  | 'relation'

export interface SelectOption {
  value: string
  label: string
}

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  help?: string
  options?: SelectOption[]
  relation?: { table: string; value: string; label: string }
  bucket?: string
}

export type ColumnType = 'text' | 'badge' | 'date' | 'currency' | 'relation'

export interface ColumnConfig {
  name: string
  label: string
  type?: ColumnType
}

export interface CrudConfig {
  key: string
  table: string
  title: string
  singular: string
  description?: string
  fields: FieldConfig[]
  columns: ColumnConfig[]
  orderBy?: string
  ascending?: boolean
  minRole: 'admin' | 'pengurus'
  deleteRole: 'admin' | 'pengurus'
  disableCreate?: boolean
  hideDelete?: boolean
}
