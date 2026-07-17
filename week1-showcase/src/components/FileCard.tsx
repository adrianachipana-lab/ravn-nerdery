import { SquareIcon } from './SquareIcon'
import { MemberDots } from './MemberDots'

interface FileCardProps {
  name: string
  date: string
  members?: number
  memberColors?: string[]
  showMenu?: boolean
  doubleIcon?: boolean
}

export function FileCard({ name, date, members = 2, memberColors, showMenu = true, doubleIcon }: FileCardProps) {
  return (
    <div className="file-card">
      <div className="file-card__header">
        <SquareIcon color="#FF9F00" double={doubleIcon} />
        <MemberDots count={memberColors ? memberColors.length : members} colors={memberColors} />
        {showMenu && <button type="button" className="file-card__menu">&#8942;</button>}
      </div>
      <p className="file-card__name">{name}</p>
      <p className="file-card__date">Created: {date}</p>
    </div>
  )
}
