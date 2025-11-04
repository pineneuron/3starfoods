import { prisma } from '@/lib/db'
import { createCategory, updateCategory, deleteCategory, toggleCategoryActive, reorderCategories } from './actions'
import CategoriesClient from './CategoriesClient'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams
  const q = (sp?.q || '').trim()
  const categories = await prisma.category.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { slug: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  const parents = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  type WithParentId = { parentId?: string | null }
  const categoriesWithParent = categories.map((c) => {
    const pid = (c as unknown as WithParentId).parentId || null
    const parentName = pid ? parents.find((p) => p.id === pid)?.name ?? null : null
    return { ...c, parentName }
  })

  return (
    <CategoriesClient
      q={q}
      categories={categoriesWithParent}
      parents={parents}
      actions={{ createCategory, updateCategory, deleteCategory, toggleCategoryActive, reorderCategories }}
    />
  )
}
