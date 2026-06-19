'use client'

import { Check } from 'lucide-react'
import type { CheckoutStep } from '@/types/cart'

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: 'address', label: 'Address' },
  { id: 'payment', label: 'Payment' },
  { id: 'review',  label: 'Review'  },
]

const STEP_ORDER: CheckoutStep[] = ['address', 'payment', 'review']

export function StepIndicator({ currentStep }: { currentStep: CheckoutStep }) {
  const currentIdx = STEP_ORDER.indexOf(currentStep)

  return (
    <nav aria-label="Checkout steps">
      <ol className="flex items-center">
        {STEPS.map((step, i) => {
          const isDone   = i < currentIdx
          const isActive = i === currentIdx

          return (
            <li key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  aria-current={isActive ? 'step' : undefined}
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center
                    border-2 transition-all duration-300
                    ${isDone
                      ? 'bg-[#691626] border-[#691626] text-[#FCFCF7]'
                      : isActive
                        ? 'bg-[#FCFCF7] border-[#691626] text-[#691626]'
                        : 'bg-[#FCFCF7] border-[#691626]/20 text-[#691626]/30'
                    }
                  `}
                >
                  {isDone
                    ? <Check size={16} strokeWidth={3} />
                    : <span className="font-mono-price text-sm font-bold">{i + 1}</span>
                  }
                </div>
                <span className={`font-body text-[11px] font-semibold tracking-wide
                  ${isActive ? 'text-[#691626]' : isDone ? 'text-[#691626]/70' : 'text-[#691626]/30'}`}>
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className={`h-[2px] flex-1 mx-2 rounded-full transition-all duration-500
                  ${i < currentIdx ? 'bg-[#691626]' : 'bg-[#691626]/15'}`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}