const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ''
).replace(/\/+$/, '')

export async function getHomeStats() {
  const response = await fetch(
    `${API_BASE_URL}/api/home-stats/`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  )

  const contentType =
    response.headers.get('content-type') || ''

  const payload = contentType.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    throw new Error(
      payload?.detail ||
        `Failed to load home statistics: ${response.status}`,
    )
  }

  if (!Array.isArray(payload)) {
    throw new Error(
      'The home statistics API returned an invalid response.',
    )
  }

  return payload
}

export async function getCustomerMapData() {
  const response = await fetch(
    `${API_BASE_URL}/api/customer-map/`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  )

  const contentType =
    response.headers.get('content-type') || ''

  const payload = contentType.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    throw new Error(
      payload?.detail ||
        `Failed to load customer map: ${response.status}`,
    )
  }

  if (
    !payload ||
    !Array.isArray(payload.clients) ||
    !Array.isArray(payload.testimonials)
  ) {
    throw new Error(
      'The customer map API returned an invalid response.',
    )
  }

  return payload
}

