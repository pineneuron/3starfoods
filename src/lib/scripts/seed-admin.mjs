import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    console.error('ADMIN_EMAIL env not set')
    process.exit(1)
  }
  const user = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (user) {
    await prisma.user.update({ where: { id: user.id }, data: { role: Prisma.$Enums.Role.ADMIN } })
    console.log(`Promoted existing user ${adminEmail} to ADMIN`)
  } else {
    const created = await prisma.user.create({ data: { email: adminEmail, role: Prisma.$Enums.Role.ADMIN } })
    console.log(`Created ADMIN user ${created.email}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
