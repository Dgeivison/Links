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
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importar para autenticação

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
  const [userId, setUserId] = useState<string | null>(null); // Armazenar o ID do usuário

  const auth = getAuth();

  useEffect(() => {
    // Monitorar mudanças de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Armazenar o ID do usuário logado
      } else {
        setUserId(null); // Usuário não está logado
        setLinks([]); // Limpar links se o usuário não estiver logado
      }
    });

    return () => unsubscribe(); // Limpar o listener ao desmontar o componente
  }, [auth]);

  useEffect(() => {
    async function loadLinks() {
      if (!userId) return; // Não carregar links se o usuário não estiver logado

      try {
        const linksRef = collection(db, "users", userId, "links");
        const queryRef = query(linksRef, orderBy("create", "asc"));

        const snapshot = await getDocs(queryRef);
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color
        }));

        setLinks(lista);
      } catch (error) {
        console.error("Erro ao carregar links:", error);
      }
    }

    loadLinks();
  }, [userId]); // Recarregar links quando o userId mudar

  useEffect(() => {
    async function loadSocialLinks() {
      try {
        const docRef = doc(db, "social", "link");
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setSocialLinks({
            facebook: snapshot.data()?.facebook,
            instagram: snapshot.data()?.instagram,
            youtube: snapshot.data()?.youtube,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar links sociais:", error);
      }
    }

    loadSocialLinks();
  }, []); // Carregar links sociais apenas uma vez

  return (
    <div className="flex flex-col w-full py-4 items-center justify-center">
      <h1 className="md:text-4xl text-3xl font-bold text-white mt-20">My Links</h1>
      <span className="text-green-50 mb-5 mt-5 text-2xl">Veja meus links ⬇️</span>

      <main className="flex flex-col w-11/12 max-w-xl text-center">
        {links.map((link) => (
          <section
            style={{ backgroundColor: link.bg }}
            key={link.id}
            className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer">
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <p
                style={{ color: link.color }}
                className="text-base md:text-lg">
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
