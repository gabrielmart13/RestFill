import { useState } from "react";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./login.css";

function Login() {
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!senha.trim()) {
            return;
        }

        try {
            const response = await api.post("/Auth/login", {
                senha: senha,
            });

            const token = response.data.token;

            localStorage.setItem("token", token);

            navigate("/dashboard");
        } catch (error) {
            console.error(error);

            alert("Senha incorreta.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-background" />

            <div className="login-container">

                {/* Logo */}
                <div className="login-brand">
                    <div className="login-logo">
                        <span>♨</span>
                    </div>

                    <h1>
                        REST<span>FILL</span>
                    </h1>

                    <p>Gestão Inteligente de Estoque</p>
                </div>

                {/* Card */}
                <div className="login-card">

                    <div className="login-card-top">
                        <div className="login-card-icon">
                            <span>♨</span>
                        </div>
                    </div>

                    <div className="login-card-content">

                        <h2>Bem-vindo!</h2>

                        <p>Acesse o sistema para continuar</p>

                        <div className="login-divider" />

                        <form onSubmit={handleSubmit}>

                            <label htmlFor="senha">
                                Senha
                            </label>

                            <div className="password-input">

                                <input
                                    id="senha"
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    value={senha}
                                    onChange={(event) =>
                                        setSenha(event.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMostrarSenha((valor) => !valor)
                                    }
                                    aria-label={
                                        mostrarSenha
                                            ? "Ocultar senha"
                                            : "Mostrar senha"
                                    }
                                >
                                    {mostrarSenha ? (
                                        <EyeOff size={21} />
                                    ) : (
                                        <Eye size={21} />
                                    )}
                                </button>

                            </div>

                            <button
                                type="submit"
                                className="login-button"
                            >
                                <span>Entrar</span>
                                <ArrowRight size={21} />
                            </button>

                        </form>

                    </div>
                </div>

                {/* Segurança */}
                <div className="login-security">

                    <span />

                    <div>
                        <ShieldCheck size={18} />
                        <span>
                            Sistema seguro e confiável
                        </span>
                    </div>

                    <span />

                </div>

                {/* Rodapé */}
                <p className="login-footer">
                    © 2025{" "}
                    <strong>RESTFILL</strong>{" "}
                    — Todos os direitos reservados.
                </p>

            </div>
        </div>
    );
}

export default Login;