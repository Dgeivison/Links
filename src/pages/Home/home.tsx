import { useEffect, useState } from "react";
import Social from "../../components/Social";
import { db } from "../../services/firebaseConnection";
import { 
  getDocs,
  collection,
  orderBy,
  query,
  doc,
  getDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importar para autenticação

interface LinksProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

interface SocialLinksProps {
  facebook: string;
  instagram: string;
  youtube: string;
}

import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Home() {
  const [links, setLinks] = useState<LinksProps[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinksProps>();

  const auth = getAuth(); // Obter a instância de autenticação

  useEffect(() => {
    function loadLinks() {
      const userId = auth.currentUser?.uid; // Pegar o ID do usuário logado
      if (!userId) return; // Garantir que o usuário esteja logado

      const linksRef = collection(db, "users", userId, "links"); // Modificar a referência
      const queryRef = query(linksRef, orderBy("create", "asc"));

      getDocs(queryRef)
        .then((snapshot) => {
          let lista: LinksProps[] = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              name: doc.data().name,
              url: doc.data().url,
              bg: doc.data().bg,
              color: doc.data().color,
            });
          });

          setLinks(lista);
        });
    }

    loadLinks();
  }, [auth]);

  useEffect(() => {
    function loadSocialLinks() {
      const docRef = doc(db, "social", "link");
      getDoc(docRef)
        .then((snapshot) => {
          if (snapshot.data() !== undefined) {
            setSocialLinks({
              facebook: snapshot.data()?.facebook,
              instagram: snapshot.data()?.instagram,
              youtube: snapshot.data()?.youtube,
            });
          }
        });
    }

    loadSocialLinks();
  }, []);

  return (
    <div className="flex flex-col w-full py-4 items-center justify-center">
      <h1 className="md:text-4xl text-3xl font-bold text-white mt-20">My Links</h1>
      <span className="text-green-50 mb-5 mt-5 text-2xl">Veja meus links ⬇️</span>

      <main className="flex flex-col w-11/12 max-w-xl text-center">
        {links.map((link) => (
          <section
            style={{ backgroundColor: link.bg }}
            key={link.id}
            className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer"
          >
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <p
                style={{ color: link.color }}
                className="text-base md:text-lg"
              >
                {link.name}
              </p>
            </a>
          </section>
        ))}

        {socialLinks && Object.keys(socialLinks).length > 0 && (
          <footer className="flex justify-center gap-3 my-4">
            <Social url={socialLinks.facebook}>
              <FaFacebook size={35} color="#FFF" />
            </Social>

            <Social url={socialLinks.instagram}>
              <FaInstagram size={35} color="#FFF" />
            </Social>

            <Social url={socialLinks.youtube}>
              <FaWhatsapp size={35} color="#FFF" />
            </Social>
          </footer>
        )}
      </main>
    </div>
  );
}
