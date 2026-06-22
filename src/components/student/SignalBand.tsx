import { SignalBand as SignalBandType } from '@/types'
import { formatRand } from '@/lib/utils'
import { MapPin, DollarSign, GraduationCap, Code2, Calendar } from 'lucide-react'

interface SignalBandProps {
  signals: SignalBandType
}

export default function SignalBand({ signals }: SignalBandProps) {
  const items = [
    { icon: MapPin, label: signals.city },
    { icon: DollarSign, label: signals.salaryExpectation ? formatRand(signals.salaryExpectation) : null },
    { icon: GraduationCap, label: signals.institution ? `${signals.institution} · ${signals.graduationYear}` : null },
    { icon: Code2, label: signals.topSkills?.join(', ') || null },
    { icon: Calendar, label: signals.availableFrom ? `Available ${signals.availableFrom}` : null },
  ].filter(i => i.label)

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map(({ icon: Icon, label }, i) => (
        <div key={i} className="flex items-center gap-1.5 text-sm text-gray-600">
          <Icon size={14} className="text-blue shrink-0" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
