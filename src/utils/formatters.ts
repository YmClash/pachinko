export const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString()
}

export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

export const formatModelName = (modelName: string): string => {
  // Convert model names like "llama2:latest" to "Llama 2"
  return modelName
    .replace(/:.*$/, '') // Remove version tag
    .replace(/(\d+)/, ' $1') // Add space before numbers
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
}

export const generateConversationTitle = (firstMessage: string): string => {
  // Generate a title from the first message
  const cleaned = firstMessage.trim()
  if (cleaned.length <= 50) return cleaned
  
  // Try to find a natural break point
  const punctuation = ['. ', '? ', '! ']
  for (const p of punctuation) {
    const index = cleaned.indexOf(p)
    if (index > 0 && index < 50) {
      return cleaned.substring(0, index + 1)
    }
  }
  
  // Otherwise truncate at word boundary
  const words = cleaned.split(' ')
  let title = ''
  for (const word of words) {
    if (title.length + word.length > 47) break
    title += word + ' '
  }
  
  return title.trim() + '...'
}