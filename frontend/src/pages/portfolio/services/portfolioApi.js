const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getPortfolioProjects() {
  const response = await fetch(
    `${API_BASE_URL}/portfolio/projects/`,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch portfolio projects.')
  }

  return response.json()
}