import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      },
    });
    return;
  }

  const word = req.body.word || "";

  if (word.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "文字を入れてください。",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(word),
      temperature: 0,
    });

    res.json({
      result: completion.data.choices[0].text.trim().replaceAll("\n", ""),
    });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(word) {
  const replyWord = word;
  const lastWord = replyWord.slice(-1);

  return `
  しりとり中です。
  「${lastWord}」から始まる単語を返してください。
  最後の文字が「ん」または「ン」になってはいけません。
  暴言や悪口、汚い言葉は禁止です。
  `;
}
