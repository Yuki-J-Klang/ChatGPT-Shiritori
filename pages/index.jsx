import Head from "next/head";
import styles from "./index.module.css";
import { useState } from "react";

export default function Home() {
  const [wordInput, setWordInput] = useState("");
  const [usedWords, setUsedWords] = useState([]);
  const [resultMsg, setResultMsg] = useState("");

  async function onSubmit(event) {
    event.preventDefault();

    setUsedWords((prev) => [...prev, wordInput]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: wordInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      if (["ん", "ン"].includes(wordInput.slice(-1))) {
        setResultMsg("「ん」または「ン」がついているので、貴方の負けです。");
      } else if (usedWords.includes(wordInput) === true) {
        setResultMsg("既出の単語を使用したので、貴方の負けです。");
      } else if (["ん", "ン"].includes(data.result.slice(-1))) {
        setResultMsg("「ん」または「ン」がついているので、貴方の勝ちです。");
      } else if (usedWords.includes(data.result) === true) {
        setResultMsg("既出の単語を使用したので、貴方の勝ちです。");
      }

      setUsedWords((prev) => [...prev, data.result]);
      setWordInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  // console.log(usedWords);
  return (
    <div className={styles.body}>
      <Head>
        <title>SAHIRITORⅡ</title>
      </Head>
      <header className={styles.header}>
        <h3>SAHIRITORⅡ</h3>
      </header>
      <main className={styles.main}>
        {usedWords.length > 0 && !resultMsg && (
          <p className={styles.font}>{usedWords.join(", ")}</p>
        )}
        {resultMsg && <p className={styles.font}>{resultMsg}</p>}
        <form className={styles.form} onSubmit={onSubmit}>
          <input
            type="text"
            name="word"
            placeholder="Enter a word"
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
          />
          <button type="submit">Send word</button>
        </form>
      </main>
    </div>
  );
}
