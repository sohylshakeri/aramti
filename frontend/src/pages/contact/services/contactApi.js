const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


export async function getContactServices() {
  const response = await fetch(
    `${API_BASE_URL}/services/`,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch services.')
  }

  return response.json()
}

export async function submitContactForm(formData) {
  const response = await fetch(
    `${API_BASE_URL}/contact/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    },
  )

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(
      errorData.detail ||
      'Failed to submit contact form.',
    )
  }

  return response.json()
}