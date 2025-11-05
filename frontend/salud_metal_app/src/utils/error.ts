export type ParsedApiError = {
  status?: number
  code?: string
  message: string
  details?: Record<string, string> | string[] | string | null
}

export const parseApiError = (err: any): ParsedApiError => {
  const status = err?.response?.status ?? err?.status
  const data = err?.response?.data ?? err?.data

  // Backend format: { success:false, error:{ code, message, details? } }
  const apiError = data?.error
  if (apiError) {
    return {
      status,
      code: apiError.code,
      message: apiError.message || 'Ocurrió un error',
      details: apiError.details ?? null
    }
  }

  // Fallbacks comunes
  const message = data?.message || err?.message || 'Ocurrió un error inesperado'
  return { status, message, details: null }
}
