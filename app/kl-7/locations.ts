export type Location = {
  id: number
  name: string
  code: number
  lat: number
  lng: number
  delivery: string
  color?: string
}

export const locations: Location[] = [
  {
    id: 1,
    name: "KPJ Damansara",
    code: 43,
    lat: 3.1319,
    lng: 101.5841,
    delivery: "Daily",
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "KPJ Seremban",
    code: 87,
    lat: 2.7258,
    lng: 101.9424,
    delivery: "Weekly",
    color: "#ef4444",
  },
  {
    id: 3,
    name: "KPJ Ipoh",
    code: 52,
    lat: 4.5975,
    lng: 101.0901,
    delivery: "Daily",
    color: "#10b981",
  },
  {
    id: 4,
    name: "KPJ Johor",
    code: 19,
    lat: 1.4927,
    lng: 103.7414,
    delivery: "Monthly",
    color: "#f59e0b",
  },
  {
    id: 5,
    name: "KPJ Penang",
    code: 64,
    lat: 5.4164,
    lng: 100.3327,
    delivery: "Daily",
    color: "#8b5cf6",
  },
  {
    id: 6,
    name: "KPJ Melaka",
    code: 28,
    lat: 2.1896,
    lng: 102.2501,
    delivery: "Weekly",
    color: "#ec4899",
  },
  {
    id: 7,
    name: "KPJ Kuantan",
    code: 91,
    lat: 3.8077,
    lng: 103.326,
    delivery: "Daily",
    color: "#06b6d4",
  },
  {
    id: 8,
    name: "KPJ Klang",
    code: 35,
    lat: 3.0447,
    lng: 101.4458,
    delivery: "Monthly",
    color: "#84cc16",
  },
]
