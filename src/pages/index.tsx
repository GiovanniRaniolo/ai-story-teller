import Head from "next/head";
import style from "@/styles/Home.module.scss";
import Header from "@/components/Molecules/Header/Header";
import WindowBox from "@/components/Organism/WindowBox/WindowBox";
import InputBox from "@/components/Molecules/InputBox/InputBox";
import SelectBox from "@/components/Molecules/SelectBox/SelectBox";
import { useState } from "react";
import { listaGeneri, listaStiliNarrativi } from "@/constants/common";
import { FinaleAlternativo } from "@/types/common";
import Button from "@/components/Atoms/Button/Button";
import SwitchBox from "@/components/Molecules/SwitchBox/SwitchBox";
import Loader from "@/components/Atoms/Loader/Loader";
import Toast from "@/components/Atoms/Toast/Toast";
import Slider from "@/components/Molecules/Slider/Slider"; // Importa il componente Slider

export default function Home() {
  const [title, setTitle] = useState("");
  const [protagonista, setProtagonista] = useState("");
  const [antagonista, setAntagonista] = useState("");
  const [ambientazione, setAmbientazione] = useState("");
  const [genere, setGenere] = useState("");
  const [personaggiSecondari, setPersonaggiSecondari] = useState(false);
  const [stileNarrativo, setStileNarrativo] = useState("");
  const [breve, setBreve] = useState(false);
  const [puntiDiVistaMultipli, setPuntiDiVistaMultipli] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [finali, setFinali] = useState<FinaleAlternativo[]>([]); // Stato per i finali
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
    if (
      title.trim().length === 0 ||
      protagonista.trim().length === 0 ||
      genere.trim().length === 0
    ) {
      showToast(
        "Attenzione",
        "Tutti i campi sono obbligatori!",
        "#FFA500",
        "warning.svg"
      );
      setLoading(false);
      return;
    }

    setLoading(true);

    const prompt = `genera un racconto ${genere} dal titolo "${title}", racconto ${
      breve ? "molto breve" : "lungo e dettagliato"
    }, con il protagonista chiamato ${protagonista}${
      antagonista ? `, l'antagonista chiamato ${antagonista}` : ""
    }${personaggiSecondari ? ", aggiungi uno o più personaggi secondari" : ""}.
    Stile narrativo: ${stileNarrativo}.
    Ambientazione: ${ambientazione}.
    ${
      puntiDiVistaMultipli
        ? "Include diversi punti di vista dei personaggi."
        : ""
    }
        Scrivi una storia con finali alternativi. I finali alternativi devono essere elencati come segue:

**Finali Alternativi**

1. Titolo del Finale 1
Descrizione del Finale 1.

2. Titolo del Finale 2
Descrizione del Finale 2.

3. Titolo del Finale 3
Descrizione del Finale 3.

Ogni finale deve essere preceduto da un numero e da un punto, e la descrizione deve seguire su una nuova linea.`;

    try {
      const response = await fetch("/api/generate", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      console.log("API Response:", data);

      if (response.ok && data.story) {
        console.log("Output generated:", data.story);
        setResponse(data.story);
        setFinali(data.finals || []);
        showToast(
          "Successo",
          "Storia generata con successo!",
          "#4BB543",
          "success.svg"
        );
      } else {
        console.error("Errore nella generazione del contenuto:", data.message);
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
    setLoading(false);
  };

  const handleVoice = () => {
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = "it-IT";
    setIsPlaying(true);
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      setIsPlaying(false);
    };
  };

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
                label="Titolo Racconto:"
                value={title}
                setValue={setTitle}
              />
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
              <InputBox
                label="Luogo o Ambientazione:"
                value={ambientazione}
                setValue={setAmbientazione}
              />
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
            </div>
            <div className={style.container}>
              <SwitchBox
                label="Personaggi Secondari:"
                value={personaggiSecondari}
                setValue={setPersonaggiSecondari}
              />
              <SwitchBox
                label="Storia Breve:"
                value={breve}
                setValue={setBreve}
              />
              <SwitchBox
                label="Punti di Vista Multipli:"
                value={puntiDiVistaMultipli}
                setValue={setPuntiDiVistaMultipli}
              />
            </div>
            <div className={style.container}>
              <Button
                label="Genera"
                onClick={handleGenerate}
                disabled={
                  title.trim().length <= 0 ||
                  protagonista.trim().length <= 0 ||
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
                {response.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("##")) {
                    const title = paragraph.replace(/^##\s*/, "");
                    return <h1 key={index}>{title}</h1>;
                  }
                  return <p key={index}>{paragraph}</p>;
                })}
              </div>
            )}
            <div className={style.result}>
              <h1>Finali Alternativi</h1>
            </div>
            {/* Aggiungi il componente Slider per visualizzare i finali alternativi */}
            {!loading && finali.length > 0 && <Slider finals={finali} />}
            {!loading && response && (
              <div className={style.container}>
                <Button
                  label={isPlaying ? "Stop" : "Riproduci"}
                  onClick={isPlaying ? handleStopVoice : handleVoice}
                  disabled={loading || response.trim().length === 0}
                />
              </div>
            )}

            <Toast toastList={toastList} removeToast={removeToast} />
          </WindowBox>
        </div>
      </main>
    </>
  );
}
