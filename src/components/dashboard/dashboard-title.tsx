import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface DashboardTitleProps {
  title: string
  description?: string
  showAvatar?: boolean
  className?: string
}

export function DashboardTitle({ title, description, showAvatar = false, className }: DashboardTitleProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-[hsl(var(--muted-foreground))] mt-1 max-w-2xl">{description}</p>}
      </div>
      {showAvatar && (
        <Avatar className="h-10 w-10 border border-[hsl(var(--border))]">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback className="bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">JD</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

