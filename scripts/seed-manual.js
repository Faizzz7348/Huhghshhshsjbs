// Simple manual seed script
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting manual seed...')

  // Create KL-7 route
  const kl7Route = await prisma.route.upsert({
    where: { slug: 'kl-7' },
    update: {},
    create: {
      name: 'KL 7 - 3PVK04',
      slug: 'kl-7',
      description: 'Route VM KL 7'
    }
  })
  console.log('✅ KL-7 route created:', kl7Route)

  // Create SL-1 route
  const sl1Route = await prisma.route.upsert({
    where: { slug: 'sl-1' },
    update: {},
    create: {
      name: 'SL 1 - 3AVS01',
      slug: 'sl-1',
      description: 'Route VM SL 1'
    }
  })
  console.log('✅ SL-1 route created:', sl1Route)

  // List all routes
  const allRoutes = await prisma.route.findMany()
  console.log('\n📋 All routes in database:')
  allRoutes.forEach(route => {
    console.log(`  - ${route.name} (${route.slug})`)
  })

  console.log('\n✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
