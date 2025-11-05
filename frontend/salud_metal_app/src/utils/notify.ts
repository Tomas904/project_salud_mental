import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import type { AxiosError } from 'axios'
import { parseApiError } from './error'

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true
})

export const notifySuccess = (message: string) => toast.fire({ icon: 'success', title: message })
export const notifyInfo = (message: string) => toast.fire({ icon: 'info', title: message })
export const notifyWarning = (message: string) => toast.fire({ icon: 'warning', title: message })
export const notifyErrorMessage = (message: string) => toast.fire({ icon: 'error', title: message })

export const notifyApiError = (err: AxiosError | any) => {
  const parsed = parseApiError(err)
  const status = parsed.status

  // 422: mostrar modal con detalle de validación si existe
  if (status === 422 && parsed.details) {
    let html = ''
    if (parsed.details && typeof parsed.details === 'object' && !Array.isArray(parsed.details)) {
      // details como objeto { campo: mensaje }
      const items = Object.entries(parsed.details as Record<string, string>)
        .map(([k,v]) => `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</li>`) 
        .join('')
      html = `<ul style="text-align:left;line-height:1.6;margin:0;padding-left:18px">${items}</ul>`
    } else if (Array.isArray(parsed.details)) {
      const items = (parsed.details as string[])
        .map(v => `<li>${escapeHtml(String(v))}</li>`) 
        .join('')
      html = `<ul style="text-align:left;line-height:1.6;margin:0;padding-left:18px">${items}</ul>`
    }
    Swal.fire({ icon: 'error', title: parsed.message || 'Error de validación', html })
    return
  }

  // Resto: toast simple con el mensaje
  notifyErrorMessage(parsed.message)
}

// Mostrar un modal (no toast) con el mensaje del backend. Útil dentro de flujos con Swal propio.
export const showApiError = async (err: AxiosError | any, opts?: { title?: string }) => {
  const parsed = parseApiError(err)
  const title = opts?.title || parsed.message || 'Error'
  if (parsed.status === 422 && parsed.details) {
    let html = ''
    if (parsed.details && typeof parsed.details === 'object' && !Array.isArray(parsed.details)) {
      const items = Object.entries(parsed.details as Record<string, string>)
        .map(([k,v]) => `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</li>`)
        .join('')
      html = `<ul style="text-align:left;line-height:1.6;margin:0;padding-left:18px">${items}</ul>`
    } else if (Array.isArray(parsed.details)) {
      const items = (parsed.details as string[])
        .map(v => `<li>${escapeHtml(String(v))}</li>`) 
        .join('')
      html = `<ul style="text-align:left;line-height:1.6;margin:0;padding-left:18px">${items}</ul>`
    }
    await Swal.fire({ icon: 'error', title, html })
    return
  }
  await Swal.fire({ icon: 'error', title, text: parsed.message })
}

function escapeHtml(input: string){
  return input
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;')
}
