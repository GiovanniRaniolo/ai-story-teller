import Head from "next/head";
import style from "@/styles/Home.module.css";
import Header from "@/components/Molecules/Header/Header";
import WindowBox from "@/components/Organism/WindowBox/WindowBox";
import InputBox from "@/components/Molecules/InputBox/InputBox";
import SelectBox from "@/components/Molecules/SelectBox/SelectBox";
import { useState } from "react";
import { listaGeneri, listaStiliNarrativi } from "@/constants/common";
import Button from "@/components/Atoms/Button/Button";
import {
  GenerateContentCandidate,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import SwitchBox from "@/components/Molecules/SwitchBox/SwitchBox";

export default function Home() {
  const [protagonista, setProtagonista] = useState("");
  const [antagonista, setAntagonista] = useState("");
  const [genere, setGenere] = useState("");
  const [personaggiSecondari, setPersonaggiSecondari] = useState(false);
  const [stileNarrativo, setStileNarrativo] = useState("");
  const [breve, setBreve] = useState(false); // Cambiato da "dettagliata" a "breve"
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    const prompt = `genera un racconto ${genere} ${
      breve ? "breve" : "dettagliato"
    }, con il protagonista chiamato ${protagonista}, l'antagonista chiamato ${antagonista}${
      personaggiSecondari ? ", aggiungi uno o più personaggi secondari" : ""
    }. 
    Stile narrativo: ${stileNarrativo}.`;

    console.log("Prompt generato:", prompt); // Debug

    try {
      if (!process.env.NEXT_PUBLIC_API_KEY) {
        console.error("API_KEY non è definita!"); // Debug
        return;
      }

      if (
        protagonista.trim().length <= 0 ||
        antagonista.trim().length <= 0 ||
        genere.trim().length <= 0
      ) {
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      console.log("Response from API:", result); // Debug

      const output = (
        result.response.candidates as GenerateContentCandidate[]
      )[0]?.content?.parts[0]?.text;

      if (output) {
        console.log("Output generated:", output); // Debug
        setResponse(output);
      } else {
        console.error("No output generated.");
        setResponse("Errore nella generazione del contenuto.");
      }
    } catch (error) {
      console.error("Errore durante la generazione:", error); // Debug
      setResponse("Si è verificato un errore durante la generazione.");
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>AI Story Teller</title>
        <meta
          name="description"
          content="AI based app to generate creative stories"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={style.main}>
        <Header title="AI Story Teller" />
        <div className={style.content}>
          <WindowBox title="Story Params">
            <div className={style.container}>
              <InputBox
                label="Nome Protagonista:"
                value={protagonista}
                setValue={setProtagonista}
              />
              <InputBox
                label="Nome Antagonista:"
                value={antagonista}
                setValue={setAntagonista}
              />
              <SelectBox
                label="Genere:"
                list={listaGeneri}
                setAction={setGenere}
              />
              <SwitchBox
                label="Personaggi Secondari:"
                value={personaggiSecondari}
                setValue={setPersonaggiSecondari}
              />
              <SelectBox
                label="Stile Narrativo:"
                list={listaStiliNarrativi}
                setAction={setStileNarrativo}
              />
              <SwitchBox
                label="Storia Breve:" // Cambiato da "Storia Dettagliata" a "Storia Breve"
                value={breve}
                setValue={setBreve}
              />
              <Button
                label="Genera"
                onClick={handleGenerate}
                disabled={
                  protagonista.trim().length <= 0 ||
                  antagonista.trim().length <= 0 ||
                  genere.trim().length <= 0 ||
                  loading
                }
              />
            </div>

            {loading ? (
              <div className={style.loading}>
                <p>loading...</p>
              </div>
            ) : (
              <div className={style.result}>
                {response.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </WindowBox>
        </div>
      </main>
    </>
  );
}
