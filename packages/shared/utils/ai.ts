import type { AITagConfig } from 'types/config'

export type GenerateTagProps = {
  title: string
  pageDesc: string
} & AITagConfig

interface GenerateTagResponse {
  choices: [
    {
      message: {
        content: string
        role: string
      }
    },
  ]
  created: number
  id: string
  model: string
  usage: {
    completion_tokens: number
    prompt_tokens: number
    total_tokens: number
  }
}

function generateChatCompletion(tagLanguage: string, preferredTags: string[]): string {
  switch (tagLanguage) {
    case 'zh':
      return `你会给输入的内容做出哪些tag? 请遵循以下规则:
              1. 大部分tag使用中文
              2. 保持常用的英文专业术语和缩写原样不变(如: AI, CSS, React, Vue等)
              3. 不要将品牌名称翻译为中文(如: Microsoft, Google等)
              4. 请优先使用这些标签，并根据内容补充其他相关标签: [${preferredTags.join(', ')}]
              5. 返回格式必须是: {"tags": ["tag1", "tag2", ...]} 
              6. 不要返回其他任何解释性文字
              7. 请注意，标签应该是与内容相关的关键词，而不是对内容的解释
              `
    case 'en':
    default:
      return `What tags would you give to the input content? Please follow these rules:
              1. Use English for most tags
              2. Keep common technical terms and abbreviations as-is
              3. Keep brand names in their original form
              4. Please prioritize these tags and add other relevant tags based on the content: [${preferredTags.join(', ')}]
              5. Return format must be: {"tags": ["tag1", "tag2", ...]}
              6. Do not return any explanatory text
              7. Note that tags should be keywords related to the content, not explanations of the content
              `
  }
}

export async function generateTag(props: GenerateTagProps): Promise<Array<string>> {
  const res = await fetch(props.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.apiKey}`,
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: generateChatCompletion(props.tagLanguage, props.preferredTags),
        },
        {
          role: 'user',
          content: JSON.stringify({
            title: props.title,
            pageDesc: props.pageDesc,
          }),
        },
      ],
      model: props.model,
    }),
  })

  if (!res.ok) {
    const content = await res.json()
    throw new Error(content.error.message)
  }

  try {
    const data = await res.json() as GenerateTagResponse
    const content = data.choices[0].message.content
    const tagJson = JSON.parse(content)
    return tagJson.tags
  }
  catch (error) {
    throw new Error('Failed to parse response')
  }
}
