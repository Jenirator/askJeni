import { SkillLevel } from '@prisma/client'
import Chip from '@/components/ui/Chip'

interface SkillChipProps {
  name: string
  level: SkillLevel
}

const LEVEL_VARIANT: Record<SkillLevel, 'learning' | 'confident' | 'verified'> = {
  LEARNING: 'learning',
  CONFIDENT: 'confident',
  VERIFIED: 'verified',
}

const LEVEL_SUFFIX: Record<SkillLevel, string> = {
  LEARNING: '',
  CONFIDENT: '',
  VERIFIED: ' ✓',
}

export default function SkillChip({ name, level }: SkillChipProps) {
  return (
    <Chip
      label={`${name}${LEVEL_SUFFIX[level]}`}
      variant={LEVEL_VARIANT[level]}
    />
  )
}
