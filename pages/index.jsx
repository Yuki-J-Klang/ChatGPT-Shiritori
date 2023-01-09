import Head from "next/head";
import styles from "./index.module.css";
import { useState } from "react";

export default function Home() {
  const [wordsInput, setWordsInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ words: wordsInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setWordsInput("");
    } catch(error) {
      
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.body}>
      <Head>
        <title>SAHIRITORⅡ</title>
      </Head>
      <header className={styles.header}>
        <h3>SAHIRITORⅡ</h3>
      </header>
      <main className={styles.main}>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="words"
            placeholder="Enter an words"
            value={wordsInput}
            onChange={(e) => setWordsInput(e.target.value)}
          />
          <input 
            type="submit" 
            value="Send words"
          />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
