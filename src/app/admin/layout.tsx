import { ReactNode } from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Geist, Geist_Mono } from 'next/font/google'
import { LayoutDashboard, FolderTree, Package, ShoppingCart, Ticket, Settings, FileText, Search, ChevronDown, ChevronRight, Dot, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import Breadcrumb from './Breadcrumb'
import { ThemeToggle, AccountMenu } from './TopbarActions'
import SidebarToggle from './SidebarToggle'
import * as Collapsible from '@radix-ui/react-collapsible'

const fontSans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const fontMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role
  if (!session || role !== 'ADMIN') {
    redirect('/auth/login')
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${fontSans.variable} ${fontMono.variable} font-sans font-normal`}>
      <div className="grid grid-cols-[240px_1fr] min-h-screen admin-grid">
        <aside className="sticky top-0 h-screen bg-[oklch(.985 0 0)] border-r border-gray-200 flex flex-col">
          <div className="h-14 flex items-center px-4">
            <LayoutDashboard className="h-5 w-5 text-[#030e55] mr-2" />
            <span className="text-[15px] font-extrabold tracking-tight text-[#030e55] sidebar-label">3 Star Foods</span>
          </div>
          <nav className="p-2 pt-0 space-y-0.5">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 sidebar-label">Overview</div>
            <Link href="/admin" className={cn("flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors")}>
              <LayoutDashboard className="h-4 w-4" />
              <span className="sidebar-label">Dashboard</span>
            </Link>
            <Collapsible.Root>
              <Collapsible.Trigger className={cn("w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors")}> 
                <span className="inline-flex items-center gap-2">
                  <FolderTree className="h-4 w-4" />
                  <span className="sidebar-label">Categories</span>
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Collapsible.Trigger>
              <Collapsible.Content className="pl-8 pr-2 py-1 space-y-1">
                <Link href="/admin/categories#add" scroll={false} className="flex items-center gap-2 px-2 py-1 rounded-md text-[13px] text-gray-700 hover:bg-gray-100">
                  <Dot className="h-4 w-4 text-gray-400" />
                  <span className="sidebar-label">Add New</span>
                </Link>
                <Link href="/admin/categories" className="flex items-center gap-2 px-2 py-1 rounded-md text-[13px] text-gray-700 hover:bg-gray-100">
                  <Dot className="h-4 w-4 text-gray-400" />
                  <span className="sidebar-label">All Categories</span>
                </Link>
              </Collapsible.Content>
            </Collapsible.Root>
            <Collapsible.Root>
              <Collapsible.Trigger className={cn("w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors")}> 
                <span className="inline-flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="sidebar-label">Products</span>
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Collapsible.Trigger>
              <Collapsible.Content className="pl-8 pr-2 py-1 space-y-1">
                <Link href="/admin/products#add" scroll={false} className="flex items-center gap-2 px-2 py-1 rounded-md text-[13px] text-gray-700 hover:bg-gray-100">
                  <Dot className="h-4 w-4 text-gray-400" />
                  <span className="sidebar-label">Add New</span>
                </Link>
                <Link href="/admin/products" className="flex items-center gap-2 px-2 py-1 rounded-md text-[13px] text-gray-700 hover:bg-gray-100">
                  <Dot className="h-4 w-4 text-gray-400" />
                  <span className="sidebar-label">All Products</span>
                </Link>
              </Collapsible.Content>
            </Collapsible.Root>
            <Collapsible.Root>
              <Collapsible.Trigger className={cn("w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors")}> 
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="sidebar-label">Users</span>
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Collapsible.Trigger>
              <Collapsible.Content className="pl-8 pr-2 py-1 space-y-1">
                <Link href="/admin/users#add" scroll={false} className="flex items-center gap-2 px-2 py-1 rounded-md text-[13px] text-gray-700 hover:bg-gray-100">
                  <Dot className="h-4 w-4 text-gray-400" />
                  <span className="sidebar-label">Add New</span>
                </Link>
                <Link href="/admin/users" className="flex items-center gap-2 px-2 py-1 rounded-md text-[13px] text-gray-700 hover:bg-gray-100">
                  <Dot className="h-4 w-4 text-gray-400" />
                  <span className="sidebar-label">All Users</span>
                </Link>
              </Collapsible.Content>
            </Collapsible.Root>
            <Link href="/admin/orders" className={cn("flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors")}> 
              <ShoppingCart className="h-4 w-4" />
              <span className="sidebar-label">Orders</span>
            </Link>
            <Link href="/admin/coupons" className={cn("flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors")}>
              <Ticket className="h-4 w-4" />
              <span className="sidebar-label">Coupons</span>
            </Link>
            
            <Link href="/admin/settings" className={cn("flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors")}>
              <Settings className="h-4 w-4" />
              <span className="sidebar-label">Settings</span>
            </Link>
            {false && (
              <Link href="/admin/audit-logs" className={cn("flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors")}>
                <FileText className="h-4 w-4" />
                <span>Audit Logs</span>
              </Link>
            )}
          </nav>

          <div className="mt-auto p-3 border-t border-t-[oklch(.922_0_0)]">
            <Link href="/admin" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-100">
              <div className="h-9 w-9 rounded-full bg-[#7c6cff] text-white flex items-center justify-center text-[12px] font-semibold">
                {session?.user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-gray-900 truncate">{session?.user?.name ?? 'Account'}</div>
                <div className="text-[12px] text-gray-500 truncate">{session?.user?.email ?? 'user@example.com'}</div>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-gray-500" />
            </Link>
          </div>
        </aside>
        <main className="min-h-screen bg-white">
          <header className="h-14 border-b border-gray-200 flex items-center px-5 justify-between">
            <div className="flex items-center gap-2">
              <SidebarToggle />
              <Breadcrumb />
            </div>
            <div className="flex items-center gap-3">
              <form action="/admin" className="hidden md:flex items-center relative">
                <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
                <input
                  name="_search"
                  placeholder="Search..."
                  className={cn("h-9 w-64 pl-8 pr-3 border border-[oklch(.922_0_0)] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1")}
                />
              </form>
              <ThemeToggle />
              <AccountMenu name={session?.user?.name} email={session?.user?.email} />
            </div>
          </header>
          <div className="p-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
