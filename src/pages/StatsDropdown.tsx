import { useMemo } from 'react'
import { ValuesByYear } from '../types'
import InlineDropdown from '../components/InlineDropdown'
import { StatsDropdownWrapper } from './StatsDropdown.styled'
import SimpleTimeseries from '../components/SimpleTimeseries'

type StatsDropdownProps = {
  data: [string, ValuesByYear][]
  color: number[]
  labelKey?: string
}

function StatsDropdown({
  data,
  color,
  labelKey = 'region',
}: StatsDropdownProps) {
  const items = useMemo(() => {
    return data.map((entry) => ({
      data: entry[1],
      label: labelKey === 'region' ? entry[1].region?.label : entry[0], // TODO this is species id, grab name?,
    }))
  }, [data, labelKey])
  return (
    <InlineDropdown items={items}>
      <StatsDropdownWrapper>
        {items.slice(0, 10).map((d) => (
          <li key={d.label}>
            {d.label}
            <SimpleTimeseries data={d.data} color={color} />
          </li>
        ))}
      </StatsDropdownWrapper>
    </InlineDropdown>
  )
}

export default StatsDropdown
