import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const route = await prisma.route.findUnique({
      where: { slug },
      include: {
        locations: {
          orderBy: { code: 'asc' },
        },
      },
    })

    if (!route) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(route)
  } catch (error) {
    console.error('Error fetching route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch route' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await request.json()
  const { locations } = body

  try {

    const route = await prisma.route.findUnique({
      where: { slug },
    })

    if (!route) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      )
    }

    // Update locations
    for (const location of locations) {
      await prisma.deliveryLocation.upsert({
        where: { 
          code: location.code,
        },
        update: {
          location: location.location,
          delivery: location.delivery,
          lat: location.lat,
          lng: location.lng,
          color: location.color,
          powerMode: location.powerMode,
          descriptionsObj: location.descriptionsObj,
        },
        create: {
          code: location.code,
          location: location.location,
          delivery: location.delivery,
          lat: location.lat,
          lng: location.lng,
          color: location.color,
          powerMode: location.powerMode,
          descriptionsObj: location.descriptionsObj,
          routeId: route.id,
        },
      })
    }

    const updatedRoute = await prisma.route.findUnique({
      where: { slug },
      include: {
        locations: {
          orderBy: { code: 'asc' },
        },
      },
    })

    return NextResponse.json(updatedRoute)
  } catch (error) {
    console.error('Error updating route:', error)
    return NextResponse.json(
      { error: 'Failed to update route' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await request.json()
  const { name, slug: newSlug, description } = body

  try {
    const route = await prisma.route.findUnique({
      where: { slug },
    })

    if (!route) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      )
    }

    // If slug is changing, check if new slug already exists
    if (newSlug && newSlug !== slug) {
      const existingRoute = await prisma.route.findUnique({
        where: { slug: newSlug },
      })

      if (existingRoute) {
        return NextResponse.json(
          { error: `Slug "${newSlug}" already exists. Please use a different slug.` },
          { status: 400 }
        )
      }
    }

    const updatedRoute = await prisma.route.update({
      where: { slug },
      data: {
        name,
        ...(newSlug && { slug: newSlug }),
        description,
      },
    })

    return NextResponse.json(updatedRoute)
  } catch (error) {
    console.error('Error updating route info:', error)
    return NextResponse.json(
      { error: 'Failed to update route info' },
      { status: 500 }
    )
  }
}
