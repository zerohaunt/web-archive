enum ConfigKey {
  shouldShowRecent = 'config/should_show_recent',
  aiTag = 'config/ai_tag',
}

interface AITagConfig {
  tagLanguage: 'en' | 'zh'
  apiUrl: string
  apiKey: string
  model: string
  preferredTags: string[]
}

export { ConfigKey, AITagConfig }
