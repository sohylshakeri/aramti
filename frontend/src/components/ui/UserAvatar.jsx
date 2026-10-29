function hashText(value) {
  return [...value].reduce(
    (hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) | 0,
    0,
  )
}

function getAvatarColors(value) {
  const hash = Math.abs(hashText(value || 'aramti'))
  const hue = hash % 360
  const lightness = 46 + (hash % 14)

  return {
    backgroundColor: `hsl(${hue} 62% ${lightness}%)`,
    color: lightness >= 54 ? 'var(--bg)' : 'var(--text)',
  }
}

function getInitial(user) {
  const source =
    user?.name ||
    user?.displayName ||
    user?.username ||
    user?.email ||
    '?'

  return source.trim().charAt(0).toLocaleUpperCase() || '?'
}

export default function UserAvatar({ user }) {
  const identity =
    user?.email ||
    user?.username ||
    user?.name ||
    user?.displayName ||
    'aramti'

  return (
    <span
      className="user-avatar"
      style={getAvatarColors(identity)}
      aria-hidden="true"
    >
      {getInitial(user)}
    </span>
  )
}
