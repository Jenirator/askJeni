'use client'

import { useState } from 'react'
import { X, Video, MapPin, Phone, Check } from 'lucide-react'
import type { PipelineApplication } from '@/lib/mock-data'

type Format = 'video' | 'in-person' | 'phone'
type Duration = 30 | 45 | 60

const SLOTS = [
  { id: 's1', day: 'Mon 30 Jun', time: '9:00 AM'  },
  { id: 's2', day: 'Mon 30 Jun', time: '2:00 PM'  },
  { id: 's3', day: 'Tue 1 Jul',  time: '10:00 AM' },
  { id: 's4', day: 'Tue 1 Jul',  time: '3:00 PM'  },
  { id: 's5', day: 'Wed 2 Jul',  time: '9:00 AM'  },
  { id: 's6', day: 'Wed 2 Jul',  time: '2:00 PM'  },
  { id: 's7', day: 'Thu 3 Jul',  time: '11:00 AM' },
]

const FORMAT_OPTIONS: { key: Format; label: string; icon: React.ReactNode; sub: string }[] = [
  { key: 'video',      label: 'Video call',  icon: <Video size={15} />,   sub: 'Google Meet / Teams' },
  { key: 'in-person',  label: 'In-person',   icon: <MapPin size={15} />,  sub: 'At your office'      },
  { key: 'phone',      label: 'Phone call',  icon: <Phone size={15} />,   sub: 'Voice only'          },
]

const DURATION_OPTIONS: Duration[] = [30, 45, 60]

interface Props {
  app: PipelineApplication
  onConfirm: (details: { format: Format; slots: string[]; duration: Duration; message: string }) => void
  onClose: () => void
}

export default function InterviewModal({ app, onConfirm, onClose }: Props) {
  const [format, setFormat] = useState<Format>('video')
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set())
  const [duration, setDuration] = useState<Duration>(45)
  const [message, setMessage] = useState(
    `Hi ${app.candidateName.split(' ')[0]}, we've reviewed your Skills Passport and would love to invite you to an interview for the Junior Software Engineer role at Peach Payments. Please let us know which of the proposed times works best for you.`
  )
  const [sent, setSent] = useState(false)

  function toggleSlot(id: string) {
    setSelectedSlots(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < 3) {
        next.add(id)
      }
      return next
    })
  }

  function handleSend() {
    setSent(true)
    setTimeout(() => {
      onConfirm({
        format,
        slots: Array.from(selectedSlots),
        duration,
        message,
      })
    }, 1000)
  }

  const canSend = selectedSlots.size > 0

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-navy">Schedule interview</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {app.candidateName} · {app.institution} · {app.city}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-navy p-1 mt-0.5">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-6">

          {/* Format */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Interview format</p>
            <div className="grid grid-cols-3 gap-2">
              {FORMAT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setFormat(opt.key)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 px-2 transition-all text-center ${
                    format === opt.key
                      ? 'border-navy bg-navy text-white shadow-sm'
                      : 'border-border text-gray-500 hover:border-navy/40'
                  }`}
                >
                  <span className={format === opt.key ? 'text-white' : 'text-gray-400'}>{opt.icon}</span>
                  <span className="text-xs font-semibold">{opt.label}</span>
                  <span className={`text-[10px] ${format === opt.key ? 'text-white/60' : 'text-gray-400'}`}>{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Duration</p>
            <div className="flex gap-2">
              {DURATION_OPTIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 text-sm font-semibold py-2 rounded-xl border transition-all ${
                    duration === d
                      ? 'border-navy bg-navy text-white'
                      : 'border-border text-gray-500 hover:border-navy/40'
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          {/* Time slots */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Proposed time slots</p>
              <p className="text-[11px] text-gray-400">
                {selectedSlots.size}/3 selected
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SLOTS.map(slot => {
                const selected = selectedSlots.has(slot.id)
                const disabled = !selected && selectedSlots.size >= 3
                return (
                  <button
                    key={slot.id}
                    onClick={() => toggleSlot(slot.id)}
                    disabled={disabled}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                      selected
                        ? 'border-blue bg-blue/5 text-navy'
                        : disabled
                        ? 'border-border bg-gray-50 text-gray-300 cursor-not-allowed'
                        : 'border-border text-gray-600 hover:border-blue/40'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                      selected ? 'bg-blue border-blue' : 'border-gray-300'
                    }`}>
                      {selected && <Check size={10} color="white" strokeWidth={3} />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold leading-tight">{slot.day}</p>
                      <p className="text-[11px] text-gray-400">{slot.time}</p>
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">Offer up to 3 slots — the candidate will confirm which works best.</p>
          </div>

          {/* Message */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Message to candidate</p>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              className="w-full border border-border rounded-xl px-3.5 py-3 text-sm text-navy resize-none focus:outline-none focus:border-blue/40 focus:ring-1 focus:ring-blue/20"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 pb-5">
          <button onClick={onClose}
            className="flex-1 border border-border text-gray-500 text-sm font-semibold py-2.5 rounded-btn hover:border-navy/40 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!canSend || sent}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-btn transition-all ${
              sent
                ? 'bg-green-500 text-white'
                : canSend
                ? 'bg-navy text-white hover:opacity-90'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {sent ? (
              <><Check size={15} /> Invitation sent!</>
            ) : (
              <>Send invitation →</>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
