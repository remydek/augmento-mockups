import Anthropic from '@anthropic-ai/sdk'

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

if (!apiKey) {
  console.error('VITE_ANTHROPIC_API_KEY is not set in environment variables')
}

const client = new Anthropic({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
})

export async function generateQuizContent(topic) {
  if (!apiKey) {
    throw new Error('API key not configured. Please add VITE_ANTHROPIC_API_KEY to your environment variables.')
  }
  const prompt = `Generate a quiz question and rewards about "${topic}".

Please respond with ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "question": "A challenging quiz question about ${topic}",
  "answers": [
    "Correct answer",
    "Wrong answer 1",
    "Wrong answer 2"
  ],
  "correctAnswerIndex": 0,
  "rewards": [
    {
      "title": "Premium reward related to ${topic}",
      "coins": 250,
      "imageUrl": "https://example.com/image1.jpg"
    },
    {
      "title": "Mid-tier reward related to ${topic}",
      "coins": 150,
      "imageUrl": "https://example.com/image2.jpg"
    },
    {
      "title": "Basic reward related to ${topic}",
      "coins": 50,
      "imageUrl": "https://example.com/image3.jpg"
    },
    {
      "title": "Exclusive experience related to ${topic}",
      "coins": 999,
      "imageUrl": "https://example.com/image4.jpg"
    }
  ]
}

Requirements:
- Question should be engaging and moderately challenging
- Provide exactly 3 answers, with the correct one first
- Rewards should be creative and related to the topic
- Use realistic coin values (50-999)
- For imageUrl, use actual working URLs from unsplash.com for relevant images (format: https://images.unsplash.com/photo-[id]?w=400)
- Make sure all rewards are thematically connected to ${topic}

Return ONLY the JSON, nothing else.`

  try {
    const message = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const responseText = message.content[0].text
    console.log('AI Response:', responseText)

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const data = JSON.parse(jsonMatch[0])

    // Validate the response structure
    if (!data.question || !Array.isArray(data.answers) || data.answers.length !== 3 || !Array.isArray(data.rewards)) {
      throw new Error('Invalid response structure from AI')
    }

    // Generate relevant Google Images-style URLs based on reward titles
    data.rewards = data.rewards.map((reward, index) => {
      // Create a search-friendly query from the reward title
      const searchQuery = encodeURIComponent(reward.title)
      // Use Unsplash source API which provides actual photos based on search terms
      return {
        ...reward,
        imageUrl: `https://source.unsplash.com/400x400/?${searchQuery}`
      }
    })

    return data
  } catch (error) {
    console.error('Error generating quiz content:', error)
    throw error
  }
}
