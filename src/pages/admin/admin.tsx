import { FormEvent, useEffect, useState } from "react";
import Header from "../../components/Header";
import Input from "../../components/Input";  
import { FiTrash } from "react-icons/fi";
import { db } from "../../services/firebaseConnection";
import { 
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importar para autenticação

interface LinksProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

export default function Admin() {
  const [nameInput, setNameInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [textColor, setTextColor] = useState("#DCDCDC");
  const [bgColor, setBgColor] = useState("#f10202");
  const [links, setLinks] = useState<LinksProps[]>([]);
  
  const auth = getAuth(); // Obter a instância de autenticação

  useEffect(() => {
    const userId = auth.currentUser?.uid; // Pegar o ID do usuário logado
    if (!userId) return; // Garantir que o usuário esteja logado

    const linksRef = collection(db, "users", userId, "links"); // Modificar a referência
    const queryRef = query(linksRef, orderBy("create", "asc")); 

    const unsub = onSnapshot(queryRef, (snapshot) => {
      const lista: LinksProps[] = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color
        });
      });

      setLinks(lista);
    });

    return () => {
      unsub();
    };
  }, [auth]);

  function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (nameInput === "" || urlInput === "") {
      alert("Preencha todos os campos!");
      return;
    }

    const userId = auth.currentUser?.uid; // Obter o ID do usuário logado
    if (!userId) return; // Garantir que o usuário esteja logado

    addDoc(collection(db, "users", userId, "links"), { // Modificar para incluir o ID do usuário
      name: nameInput,
      url: urlInput,
      bg: bgColor,
      color: textColor,
      create: new Date()
    })
    .then(() => {
      setNameInput("");
      setUrlInput("");
      console.log("CADASTRADO COM SUCESSO!");
    })
    .catch((error) => {
      console.log("ERRO AO CADASTRAR NO BANCO: " + error);
    });
  }

  async function handleDeleteLink(id: string) {
    const userId = auth.currentUser?.uid; // Obter o ID do usuário logado
    if (!userId) return; // Garantir que o usuário esteja logado

    const docRef = doc(db, "users", userId, "links", id); // Modificar para incluir o ID do usuário
    await deleteDoc(docRef);
  }

  return (
    <div className="flex items-center flex-col min-h-screen pb-7 px-2" onSubmit={handleRegister}>
      <Header/>

      <form className="flex flex-col mt-8 mb-3 w-full max-w-xl">
        <label className="text-white font-medium mb-2 mt-2">Nome do Link</label>
        <Input
          placeholder="Digite o nome do link..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <label className="text-white font-medium mb-2 mt-2">URL do Link</label>
        <Input
          type="url"
          placeholder="Digite a url..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />

        <section className="flex my-4 gap-5">
          <div className="flex gap-2">
            <label className="text-white font-medium mb-2 mt-2">Cor do Link</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            /> 
          </div>

          <div className="flex gap-2">
            <label className="text-white font-medium mb-2 mt-2">Fundo do Link</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            /> 
          </div>
        </section>

        {nameInput !== '' && (
          <div className="flex items-center justify-center flex-col mb-7 p-1 border-gray-100/25 border rounded-md">
            <label className="text-white font-medium mb-2 mt-2">Veja como esta ficando:</label>
            <article 
              className="w-11/12 max-w-lg flex flex-col items-center justify-center bg-zinc-900 rounded px-1 py-3"
              style={{ marginBottom: 8, marginTop: 8, backgroundColor: bgColor }}
            >
              <p className="font-medium" style={{ color: textColor }}>{nameInput}</p>
            </article>
          </div>
        )}

        <button type="submit" className="bg-blue-600 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center mb-7">
          Cadastrar
        </button>
      </form>

      <h2 className="font-bold text-white mb-4 text-2xl">
        Meus links
      </h2>

      {links.map((link) => (
        <article 
          key={link.id}
          className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none"
          style={{ backgroundColor: link.bg, color: link.color }}
        >
          <p> {link.name} </p>
          <div>
            <button
              className="border border-dashed p-1 rounded bg-neutral-900"
              onClick={() => handleDeleteLink(link.id)}
            >
              <FiTrash size={18} color="#FFF"/>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
