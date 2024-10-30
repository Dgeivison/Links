import { FormEvent, useEffect, useState } from "react";
import Header from "../../components/Header";
import Input from "../../components/Input";

import { db } from "../../services/firebaseConnection";
import {
    setDoc,
    doc,
    getDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importar para autenticação

export default function Networks() {
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  const auth = getAuth(); // Obter a instância de autenticação

  useEffect(() => {
    function loadLinks() {
      const userId = auth.currentUser?.uid; // Pegar o ID do usuário logado
      if (!userId) return; // Garantir que o usuário esteja logado

      const docRef = doc(db, "users", userId, "social", "link"); // Modificar a referência
      getDoc(docRef)
        .then((snapshot) => {
          if (snapshot.data() !== undefined) {
            setFacebook(snapshot.data()?.facebook || "");
            setInstagram(snapshot.data()?.instagram || "");
            setYoutube(snapshot.data()?.youtube || "");
          }
        });
    }

    loadLinks();
  }, [auth]);

  function handleRegister(e: FormEvent) {
    e.preventDefault();

    const userId = auth.currentUser?.uid; // Pegar o ID do usuário logado
    if (!userId) return; // Garantir que o usuário esteja logado

    setDoc(doc(db, "users", userId, "social", "link"), { // Modificar para incluir o ID do usuário
      facebook: facebook,
      instagram: instagram,
      youtube: youtube
    })
    .then(() => {
      console.log('CADASTRADO COM SUCESSO!');
    })
    .catch((error) => {
      console.log("ERRO AO CADASTRAR: " + error);
    });
  }

  return (
    <div className="flex flex-col items-center min-h-screen pb-7 py-2">
      <Header />

      <h1 className="text-white font-medium text-2xl mt-8 mb-4">
        Minhas redes sociais
      </h1>

      <form className="flex flex-col max-w-xl w-full" onSubmit={handleRegister}>
        <label className="text-white font-medium mt-3 mb-3">Link do Facebook</label>
        <Input
          type="url"
          placeholder="Digite o URL do Facebook..."
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
        />

        <label className="text-white font-medium mt-3 mb-3">Link do Instagram</label>
        <Input
          type="url"
          placeholder="Digite o URL do Instagram..."
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />

        <label className="text-white font-medium mt-3 mb-3">Link do YouTube</label>
        <Input
          type="url"
          placeholder="Digite o URL do YouTube..."
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
        />

        <button 
          type="submit"
          className="text-white bg-blue-600 h-9 rounded-md items-center justify-center flex mb-7 mt-2 font-medium"
        >
          Salvar links
        </button>
      </form>
    </div>
  );
}
