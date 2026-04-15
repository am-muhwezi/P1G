import { AppShell } from "@/components/layout/AppShell"
import { BuyerTopBar } from "@/components/layout/AppShell"

export function BuyerPlaceholder({ title }: { title: string }) {
  return (
    <AppShell>
      <BuyerTopBar />
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 p-8">
        <div className="text-5xl mb-4">🚧</div>
        <h2 className="text-xl font-bold text-gray-600 mb-1">{title}</h2>
        <p className="text-sm text-center max-w-xs">This section is under development. Backend wiring coming soon.</p>
      </div>
    </AppShell>
  )
}

export function SellerPlaceholder({ title }: { title: string }) {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 p-8">
        <div className="text-5xl mb-4">🚧</div>
        <h2 className="text-xl font-bold text-gray-600 mb-1">{title}</h2>
        <p className="text-sm text-center max-w-xs">This section is under development. Backend wiring coming soon.</p>
      </div>
    </AppShell>
  )
}

export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 p-8">
        <div className="text-5xl mb-4">🚧</div>
        <h2 className="text-xl font-bold text-gray-600 mb-1">{title}</h2>
        <p className="text-sm text-center max-w-xs">This admin section is under development. Backend wiring coming soon.</p>
      </div>
    </AppShell>
  )
}
