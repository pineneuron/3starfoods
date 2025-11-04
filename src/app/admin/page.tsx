export const dynamic = 'force-dynamic'

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Orders (Today)</div>
          <div className="mt-2 text-3xl font-extrabold">--</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Revenue (Today)</div>
          <div className="mt-2 text-3xl font-extrabold">--</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Products</div>
          <div className="mt-2 text-3xl font-extrabold">--</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Customers</div>
          <div className="mt-2 text-3xl font-extrabold">--</div>
        </div>
      </div>
    </div>
  )
}


