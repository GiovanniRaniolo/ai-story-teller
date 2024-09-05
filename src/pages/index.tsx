import Head from "next/head";
import style from "@/styles/Home.module.css";
import Header from "@/components/Molecules/Header/Header";
import WindowBox from "@/components/Organism/WindowBox/WindowBox";
import InputBox from "@/components/Molecules/InputBox/InputBox";
import SelectBox from "@/components/Molecules/SelectBox/SelectBox";
import { useState } from "react";
import { listaGeneri, listaStiliNarrativi } from "@/constants/common";
import Button from "@/components/Atoms/Button/Button";
import SwitchBox from "@/components/Molecules/SwitchBox/SwitchBox";
import Loader from "@/components/Atoms/Loader/Loader";
import Toast from "@/components/Atoms/Toast/Toast";

export default function Home() {
  const [protagonista, setProtagonista] = useState("");
  const [antagonista, setAntagonista] = useState("");
  const [genere, setGenere] = useState("");
  const [personaggiSecondari, setPersonaggiSecondari] = useState(false);
  const [stileNarrativo, setStileNarrativo] = useState("");
  const [breve, setBreve] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [isPlaying, setIsPlaying] = useState(false); // Stato per la sintesi vocale

  const [toastList, setToastList] = useState<
    Array<{
      id: number;
      title: string;
      description: string;
      backgroundColor: string;
      icon: string;
    }>
  >([]);

  const showToast = (
    title: string,
    description: string,
    backgroundColor: string,
    icon: string
  ) => {
    const id = Math.floor(Math.random() * 1000);
    const newToast = {
      id,
      title,
      description,
      backgroundColor,
      icon: `/icons/${icon}`,
    };

    setToastList((prevToastList) => [...prevToastList, newToast]);
  };

  const removeToast = (id: number) => {
    setToastList((prevToastList) =>
      prevToastList.filter((toast) => toast.id !== id)
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    const prompt = `genera un racconto ${genere} ${
      breve ? "molto breve" : "lungo e dettagliato"
    }, con il protagonista chiamato ${protagonista}, l'antagonista chiamato ${antagonista}${
      personaggiSecondari ? ", aggiungi uno o più personaggi secondari" : ""
    }. 
    Stile narrativo: ${stileNarrativo}.`;

    console.log("Prompt generato:", prompt);

    if (
      protagonista.trim().length > 0 &&
      antagonista.trim().length > 0 &&
      genere.trim().length > 0
    ) {
      try {
        const response = await fetch("/api/generate", {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ prompt }),
        });

        const data = await response.json();

        if (response.ok && data.message) {
          console.log("Output generated:", data.message);
          setResponse(data.message);

          showToast(
            "Successo",
            "Storia generata con successo!",
            "#4BB543",
            "success.svg"
          );
        } else {
          console.error(
            "Errore nella generazione del contenuto:",
            data.message
          );
          setResponse("Errore nella generazione del contenuto.");

          showToast(
            "Errore",
            "Errore nella generazione del contenuto.",
            "#FF0000",
            "error.svg"
          );
        }
      } catch (error) {
        console.error("Errore durante la generazione:", error);
        setResponse("Si è verificato un errore durante la generazione.");

        showToast(
          "Errore",
          "Si è verificato un errore durante la generazione.",
          "#FF0000",
          "error.svg"
        );
      }
    } else {
      showToast(
        "Attenzione",
        "Tutti i campi sono obbligatori!",
        "#FFA500",
        "warning.svg"
      );
    }

    setLoading(false);
  };

  // Funzione per avviare la sintesi vocale
  const handleVoice = () => {
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = "it-IT";
    setIsPlaying(true);
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      setIsPlaying(false);
    };
  };

  // Funzione per fermare la sintesi vocale
  const handleStopVoice = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
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
          <WindowBox title="Parametri">
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
              <SwitchBox
                label="Personaggi Secondari:"
                value={personaggiSecondari}
                setValue={setPersonaggiSecondari}
              />
            </div>
            <div className={style.container}>
              <SelectBox
                label="Genere:"
                list={listaGeneri}
                setAction={setGenere}
              />
              <SelectBox
                label="Stile Narrativo:"
                list={listaStiliNarrativi}
                setAction={setStileNarrativo}
              />
              <SwitchBox
                label="Storia Breve:"
                value={breve}
                setValue={setBreve}
              />
            </div>

            <div className={style.container}>
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
              <div className={style.container}>
                <Loader />
              </div>
            ) : (
              <div className={style.result}>
                {response.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
            {/* Pulsante per avviare la sintesi vocale */}
            {!loading && response && (
              <div className={style.container}>
                <Button
                  label={isPlaying ? "Stop" : "Riproduci"}
                  onClick={isPlaying ? handleStopVoice : handleVoice}
                  disabled={loading || response.trim().length === 0}
                />
              </div>
            )}
          </WindowBox>
        </div>

        {/* Componente Toast */}
        <Toast toastList={toastList} removeToast={removeToast} />
      </main>
    </>
  );
}
