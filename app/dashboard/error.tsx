'use client'

import { ErrorPage } from '@/components/ErrorMessage'
import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <ErrorPage
      title="Gagal Memuat Dashboard"
      message={error.message || 'Terjadi kesalahan saat memuat dashboard. Silakan coba lagi.'}
      onRetry={reset}
    />
  )
}
