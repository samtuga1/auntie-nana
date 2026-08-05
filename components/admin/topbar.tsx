import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function AdminTopbar() {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 flex h-14 items-center gap-2 border-b px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
    </header>
  )
}
