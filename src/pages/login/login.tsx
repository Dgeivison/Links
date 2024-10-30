import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { FormEvent, useState } from "react";
import { auth } from "../../services/firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Para armazenar mensagens de erro
    const navigate = useNavigate();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        // Verificação de e-mail
        const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/;
        if (!emailPattern.test(email)) {
            setError("Por favor, insira um e-mail válido (@gmail, @hotmail, @outlook ou @yahoo).");
            return;
        }

        if (email === '' || password === '') {
            alert("Preencha todos os campos!");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log("LOGADO COM SUCESSO!");
                navigate("/admin", { replace: true });
            }).catch((error) => {
                console.log(error);
                setError("Erro ao logar: " + error.message);
            });
    }

    return (
        <div className="flex w-full h-screen items-center justify-center flex-col">
            <Link to="/">
                <h1 className="mt-11 text-white mb-7 font-bold text-5xl">
                    Dev
                    <span className="bg-gradient-to-t from-yellow-500 to-orange-500 bg-clip-text text-transparent">Link</span>
                </h1>
            </Link>

            <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col px-2">
                <Input
                    placeholder="Digite seu email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError(''); // Limpa o erro ao digitar
                    }}
                />

                <Input
                    placeholder="*********"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError(''); // Limpa o erro ao digitar
                    }}
                />

                {error && <p className="text-red-500">{error}</p>} {/* Mensagem de erro */}

                <button 
                    type="submit"
                    className="h-9 bg-blue-600 rounded border-0 text-lg text-white">
                    Acessar
                </button>
            </form>
        </div>
    );
}
