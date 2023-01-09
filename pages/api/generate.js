import { Configuration, OpenAIApi } from "openai";
  
const UserUsedWords = [];
const AiUsedWords = [];

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export default async function (req, res) {

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      }
    });
    return;
  }

  const words = req.body.words || '';
  if (words.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "文字を入れてください。",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(words) || "次は、貴方のターンです。",
      temperature: 0,
    });
    
    UserUsedWords.push = words;
    result = completion.data.choices[0].text;

    if(words === 'ん' || words === 'ン'){
      result = "「ん」または「ン」がついているので、貴方の負けです。";
      res.status(200).json(result);
    } else if(UserUsedWords.includes(words) || AiUsedWords.includes(words)){
      result = "既出の単語を使用したので、貴方の負けです。"
      res.status(200).json(result);
    } else if(result.slice(-1) == 'ん' || result.slice(-1) == 'ン') {
      completion;
      res.status(200).json({ result: completion.data.choices[0].text });
      AiUsedWords.push = result;
    } else if(UserUsedWords.includes(result) || AiUsedWords.includes(result)){
      completion;
      res.status(200).json({ result: completion.data.choices[0].text });
      AiUsedWords.push = result;
    } else {
      res.status(200).json({ result: completion.data.choices[0].text });
      AiUsedWords.push = result;
    }
    

  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(words) {
  const replyWords = words.slice(-1);
  return `Userから送られた単語の最後の音節から始まり、末尾が「ん」にならない単語を1つあげてください。同じ単語は使ってはいけません。
  User: アザラシ
  Ai: 屍
  User: 粘土
  Ai: ドミニカ共和国
  User: クリスマス
  Ai: するめ
  User: ${replyWords}
  Ai:`;
}