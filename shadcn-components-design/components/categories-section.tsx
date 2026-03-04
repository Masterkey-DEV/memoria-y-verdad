"use client";
import { useCategoryStore } from "@/store/useCategoryStore";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Users, LayoutGrid } from "lucide-react";
const categories = [
  { id: "comunidad", label: "Comunidad", icon: Users },
  { id: "educacion", label: "Educación", icon: GraduationCap },
  { id: "empleo", label: "Empleo", icon: Briefcase },
];

export function CategoriesSection() {
  const { selectedCategoryName, setCategory } = useCategoryStore();

  return (
    <section className="px-4 py-3">
      <div className="flex flex-wrap gap-3">
        <Badge
          variant={selectedCategoryName === null ? "default" : "outline"}
          onClick={() => setCategory(null)}
          className="cursor-pointer px-4 py-2 rounded-full"
        >
          Todos
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat.label}
            variant={selectedCategoryName === cat.id ? "default" : "outline"}
            onClick={() => setCategory(cat.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-colors"
          >
            <cat.icon className="h-4 w-4" />
            {cat.label}
          </Badge>
        ))}
      </div>
    </section>
  );
}
