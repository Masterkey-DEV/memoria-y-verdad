import { GraduationCap, Briefcase, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const categories = [
  { label: "Education", icon: GraduationCap },
  { label: "Jobs", icon: Briefcase },
  { label: "Community", icon: Users },
]

export function CategoriesSection() {
  return (
    <section className="px-4 py-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Categories</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <Badge
            key={cat.label}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-foreground border-border hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
          >
            <cat.icon className="h-4 w-4" />
            {cat.label}
          </Badge>
        ))}
      </div>
    </section>
  )
}
