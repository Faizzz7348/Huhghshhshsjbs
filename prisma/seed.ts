import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create routes
  const kl7Route = await prisma.route.upsert({
    where: { slug: 'kl-7' },
    update: {},
    create: {
      name: 'KL 7 - 3PVK04',
      slug: 'kl-7',
      description: 'Route VM KL 7'
    }
  })

  const sl1Route = await prisma.route.upsert({
    where: { slug: 'sl-1' },
    update: {},
    create: {
      name: 'SL 1 - 3AVS01',
      slug: 'sl-1',
      description: 'Route VM SL 1'
    }
  })

  console.log('✅ Routes created:', { kl7Route, sl1Route })

  // You can add sample delivery locations here
  // Example:
  /*
  await prisma.deliveryLocation.createMany({
    data: [
      {
        routeId: kl7Route.id,
        code: 1,
        location: 'Sample Location 1',
        delivery: 'Sample Delivery 1',
        lat: 3.1390,
        lng: 101.6869,
        color: 'blue',
        powerMode: 'daily'
      }
    ]
  })
  */

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
