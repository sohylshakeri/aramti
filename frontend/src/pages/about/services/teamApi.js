const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ''
).replace(/\/+$/, '')

export async function getTeamMembers() {
  const response = await fetch(`${API_BASE_URL}/team/`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch team members. Status: ${response.status}`
    )
  }

  const data = await response.json()

  // پشتیبانی از پاسخ معمولی و پاسخ صفحه‌بندی‌شده DRF
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data.results)) {
    return data.results
  }

  throw new Error('Invalid team members response.')
}