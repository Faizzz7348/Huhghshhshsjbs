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

  // Delete existing locations to prevent duplicates
  await prisma.deliveryLocation.deleteMany({})

  // Add sample delivery locations for KL-7 route (Data A)
  const kl7Locations = await prisma.deliveryLocation.createMany({
    data: [
      {
        routeId: kl7Route.id,
        code: 101,
        location: 'KPJ Damansara Specialist Hospital',
        delivery: 'Daily',
        lat: 3.1319,
        lng: 101.5841,
        color: '#3b82f6',
        powerMode: 'daily'
      },
      {
        routeId: kl7Route.id,
        code: 102,
        location: 'Gleneagles Hospital Kuala Lumpur',
        delivery: 'Daily',
        lat: 3.1583,
        lng: 101.7107,
        color: '#ef4444',
        powerMode: 'daily'
      },
      {
        routeId: kl7Route.id,
        code: 103,
        location: 'Pantai Hospital Kuala Lumpur',
        delivery: 'Weekly',
        lat: 3.1282,
        lng: 101.6571,
        color: '#10b981',
        powerMode: 'weekday'
      },
      {
        routeId: kl7Route.id,
        code: 104,
        location: 'Prince Court Medical Centre',
        delivery: 'Daily',
        lat: 3.1468,
        lng: 101.6933,
        color: '#f59e0b',
        powerMode: 'daily'
      },
      {
        routeId: kl7Route.id,
        code: 105,
        location: 'Sunway Medical Centre',
        delivery: 'Weekly',
        lat: 3.0738,
        lng: 101.6065,
        color: '#8b5cf6',
        powerMode: 'alt1'
      }
    ]
  })

  // Add sample delivery locations for SL-1 route (Data B)
  const sl1Locations = await prisma.deliveryLocation.createMany({
    data: [
      {
        routeId: sl1Route.id,
        code: 201,
        location: 'Selayang Hospital',
        delivery: 'Daily',
        lat: 3.2567,
        lng: 101.6496,
        color: '#ec4899',
        powerMode: 'daily'
      },
      {
        routeId: sl1Route.id,
        code: 202,
        location: 'Columbia Asia Hospital - Setapak',
        delivery: 'Weekly',
        lat: 3.1947,
        lng: 101.7259,
        color: '#06b6d4',
        powerMode: 'weekday'
      },
      {
        routeId: sl1Route.id,
        code: 203,
        location: 'Kepong Specialist Hospital',
        delivery: 'Daily',
        lat: 3.1926,
        lng: 101.6374,
        color: '#84cc16',
        powerMode: 'daily'
      },
      {
        routeId: sl1Route.id,
        code: 204,
        location: 'Kuala Lumpur Hospital',
        delivery: 'Daily',
        lat: 3.1726,
        lng: 101.6976,
        color: '#f97316',
        powerMode: 'daily'
      },
      {
        routeId: sl1Route.id,
        code: 205,
        location: 'Sentosa Medical Centre',
        delivery: 'Monthly',
        lat: 3.2059,
        lng: 101.6473,
        color: '#14b8a6',
        powerMode: 'alt2'
      }
    ]
  })

  console.log('✅ Sample locations created:', { kl7Locations, sl1Locations })
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
