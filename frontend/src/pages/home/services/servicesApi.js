const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getServices() {
  const response = await fetch(
    `${API_BASE_URL}/services/`,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch services.')
  }

  return response.json()
}