import { useAuthStore } from '@/stores/auth'

const BASE_URL = '/api'

export async function loginUser(username, password) {
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)

  const loginUrl = `${BASE_URL}/auth/login`

  if (!username || !password) {
    throw new Error('Username and password are required')
  }

  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })

    const text = await response.text()
    let parsed = null
    try {
      parsed = JSON.parse(text)
    } catch {
      console.warn('[loginUser] Response not valid JSON:', text)
    }

    if (!response.ok) {
      handleErrorResponse(response, parsed)
    }

    return parsed
  } catch (err) {
    throw err
  }
}

export async function fetchWithAuth(url, options = {}) {
  const auth = useAuthStore()

  if (!options.headers) {
    options.headers = {}
  }

  // Attach access token
  if (auth.token) {
    options.headers['Authorization'] = `Bearer ${auth.token}`
  }

  let res = await fetch(url, options)

  // If access token expired
  if (res.status === 401 && auth.refreshToken) {
    console.warn('Access token expired, trying to refresh...')
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auth.refreshToken),
      })

      if (!refreshRes.ok) {
        // Refresh token invalid — logout
        console.warn('Refresh failed:', await refreshRes.text())
        auth.logout()
        throw new Error('Session expired. Please log in again.')
      } else {
        console.log('Refresh successful')
      }

      const data = await refreshRes.json()
      auth.updateToken(data.access_token)

      // Retry original request with new token
      options.headers['Authorization'] = `Bearer ${data.access_token}`
      res = await fetch(url, options)
    } catch (err) {
      console.error('Token refresh threw error:', err)
      auth.logout()
      throw new Error('Session expired. Please log in again.')
    }
  }

  // If refresh token is missing or also failed before retry
  if (res.status === 401 && !auth.refreshToken) {
    auth.logout()
    throw new Error('Session expired. Please log in again.')
  }

  return res
}

export async function registerUser(username, password) {
  const registerUrl = `${BASE_URL}/auth/register`

  if (!username || !password) {
    throw new Error('Username and password are required')
  }

  try {
    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const text = await response.text()
    let parsed = null
    try {
      parsed = JSON.parse(text)
    } catch {
      console.warn('[registerUser] Response not valid JSON:', text)
    }

    if (!response.ok) {
      handleErrorResponse(response, parsed)
    }

    return parsed
  } catch (err) {
    console.error('[registerUser] Error during registration:', err)
    throw err
  }
}

function handleErrorResponse(response, parsed) {
  const message = parsed?.detail || `Unexpected error (${response.status})`

  throw new Error(message)
}
