import { getCategoryMeta } from '@/lib/categories'
import { cn } from '@/lib/utils'

interface Props {
  category: string
  small?: boolean
}

export function CategoryBadge({ category, small = false }: Props) {
  const meta = getCategoryMeta(category)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium capitalize',
        small ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
      )}
      style={{
        backgroundColor: meta.markerColor + '20',
        color: meta.markerColor,
        border: `1px solid ${meta.markerColor}40`,
      }}
    >
      {meta.name}
    </span>
  )
}
