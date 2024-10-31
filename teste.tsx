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