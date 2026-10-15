'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { confirmSubscription } from '@/app/actions'
import { PAYPAL_CLIENT_ID } from '@/lib/paypal-plans'

type PayPalButtons = {
  render: (element: HTMLElement) => Promise<void>
  close?: () => Promise<void>
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        style?: Record<string, string | number>
        createSubscription: (data: unknown, actions: { subscription: { create: (input: { plan_id: string; custom_id?: string }) => Promise<string> } }) => Promise<string>
        onApprove: (data: { subscriptionID?: string | null }) => Promise<void>
        onError?: (error: unknown) => void
        onCancel?: () => void
      }) => PayPalButtons
    }
  }
}

const SDK_URL = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription&currency=CAD&components=buttons`

let sdkPromise: Promise<void> | null = null
function loadSdk() {
  if (window.paypal) return Promise.resolve()
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SDK_URL
      script.dataset.sdkIntegrationSource = 'button-factory'
      script.onload = () => resolve()
      script.onerror = () => {
        sdkPromise = null
        reject(new Error('PayPal could not load'))
      }
      document.head.appendChild(script)
    })
  }
  return sdkPromise
}

export function PayPalSubscribeButton({ planId, userId }: { planId: string; userId: number }) {
  const container = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [state, setState] = useState<'loading' | 'ready' | 'saving' | 'done' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let buttons: PayPalButtons | null = null
    let cancelled = false

    loadSdk()
      .then(async () => {
        if (cancelled || !container.current || !window.paypal) return
        container.current.innerHTML = ''
        buttons = window.paypal.Buttons({
          style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'subscribe', height: 45 },
          createSubscription: (_data, actions) => actions.subscription.create({ plan_id: planId, custom_id: String(userId) }),
          onApprove: async (data) => {
            setState('saving')
            const result = await confirmSubscription(data.subscriptionID ?? '')
            setState(result.error ? 'error' : 'done')
            setMessage(result.error ?? result.message ?? '')
            router.refresh()
          },
          onCancel: () => setMessage('No problem — you can subscribe whenever you’re ready.'),
          onError: (error) => {
            console.error('[bgw] PayPal error', error)
            setState('error')
            setMessage('Something went wrong with PayPal. Please try again, or contact support.')
          },
        })
        await buttons.render(container.current)
        if (!cancelled) setState('ready')
      })
      .catch(() => {
        if (cancelled) return
        setState('error')
        setMessage('PayPal could not load. Please check your connection and refresh the page.')
      })

    return () => {
      cancelled = true
      buttons?.close?.().catch(() => {})
    }
  }, [planId, userId, router])

  return (
    <div>
      {state === 'loading' && <p className="mb-3 text-sm text-[#8992a7]">Loading PayPal…</p>}
      {state === 'saving' && <p className="mb-3 text-sm font-semibold text-[#3067f1]">Confirming your payment…</p>}
      <div ref={container} className={state === 'saving' || state === 'done' ? 'hidden' : 'max-w-[420px]'} />
      {message && (
        <p role="status" className={`mt-3 text-sm font-medium ${state === 'error' ? 'text-[#b42318]' : 'text-[#23835e]'}`}>{message}</p>
      )}
    </div>
  )
}
