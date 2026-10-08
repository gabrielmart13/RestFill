import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import categoriaService from "../../services/categoriaService";

import "./categoriaform.css";

import {
    ArrowLeft,
    Check,
    Leaf,
    Milk,
    Package,
    Pill,
    Salad,
    Sparkles,
    Wine,
} from "lucide-react";


function CategoriaForm({ modo = "criar" }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const editando = modo === "editar";

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [icone, setIcone] = useState("grain");
    const [cor, setCor] = useState("#E53935");

    const [carregando, setCarregando] = useState(editando);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!editando) {
            return;
        }

        const carregarCategoria = async () => {
            try {
                setCarregando(true);
                setErro("");

                const categoria =
                    await categoriaService.buscarPorId(id);

                setNome(categoria.nome || "");
                setDescricao(categoria.descricao || "");
                setIcone(categoria.icone || "grain");
                setCor(categoria.cor || "#E53935");
            } catch (error) {
                console.error(error);

                setErro(
                    error?.response?.data?.message ||
                    "Não foi possível carregar a categoria."
                );
            } finally {
                setCarregando(false);
            }
        };

        carregarCategoria();
    }, [editando, id]);

    const cores = [
        "#E53935",
        "#FF7A00",
        "#F4C542",
        "#12A8A8",
        "#6256D8",
        "#A6A6A6",
    ];

    const icones = [
        {
            valor: "grain",
            componente: Leaf,
        },
        {
            valor: "oil",
            componente: Wine,
        },
        {
            valor: "meat",
            componente: Package,
        },
        {
            valor: "dairy",
            componente: Milk,
        },
        {
            valor: "vegetable",
            componente: Salad,
        },
        {
            valor: "canned",
            componente: Package,
        },
        {
            valor: "spice",
            componente: Sparkles,
        },
        {
            valor: "drink",
            componente: Wine,
        },
    ];

    const salvar = async (event) => {
        event.preventDefault();

        setErro("");

        if (!nome.trim()) {
            setErro("Informe o nome da categoria.");
            return;
        }

        try {
            setSalvando(true);

            const dados = {
                nome: nome.trim(),
                descricao: descricao.trim() || null,
                icone,
                cor,
            };

            if (editando) {
                await categoriaService.atualizar(id, dados);
            } else {
                await categoriaService.criar(dados);
            }

            navigate("/categorias");
        } catch (error) {
            console.error(error);

            setErro(
                error?.response?.data?.message ||
                "Não foi possível salvar a categoria."
            );
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) {
        return (
            <div className="categoria-form-loading">
                Carregando categoria...
            </div>
        );
    }

    return (
        <div className="categoria-form-page">

            <div className="categoria-form-breadcrumb">
                <span>Categorias</span>
                <span>›</span>
                <strong>
                    {editando
                        ? "Editar Categoria"
                        : "Nova Categoria"}
                </strong>
            </div>

            <div className="categoria-form-header">

                <div>
                    <h1>
                        {editando
                            ? "Editar Categoria"
                            : "Nova Categoria"}
                    </h1>

                    <p>
                        {editando
                            ? "Altere as informações da categoria conforme necessário."
                            : "Preencha as informações para cadastrar uma nova categoria."}
                    </p>
                </div>

                <button
                    className="btn-voltar-categorias"
                    onClick={() =>
                        navigate("/categorias")
                    }
                >
                    <ArrowLeft size={17} />
                    Voltar para Categorias
                </button>

            </div>

            {erro && (
                <div className="categoria-form-error">
                    {erro}
                </div>
            )}

            <form
                className="categoria-form"
                onSubmit={salvar}
            >

                <section className="form-card">

                    <div className="form-card-title">
                        <h2>Informações Básicas</h2>
                    </div>

                    <div className="form-group">

                        <label>
                            Nome da Categoria
                            <span>*</span>
                        </label>

                        <input
                            type="text"
                            value={nome}
                            onChange={(event) =>
                                setNome(event.target.value)
                            }
                            placeholder="Ex.: Grãos"
                            maxLength={50}
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Descrição
                            <small>(opcional)</small>
                        </label>

                        <textarea
                            value={descricao}
                            onChange={(event) =>
                                setDescricao(
                                    event.target.value
                                )
                            }
                            placeholder="Ex.: Arroz, feijão, lentilha, milho, trigo e outros grãos."
                            maxLength={255}
                            rows={4}
                        />

                        <div className="character-count">
                            {descricao.length}/255
                        </div>

                    </div>

                    <div className="form-group">

                        <label>
                            Ícone da Categoria
                        </label>

                        <div className="icon-options">

                            {icones.map(
                                ({
                                    valor,
                                    componente: Icon,
                                }) => (
                                    <button
                                        type="button"
                                        key={valor}
                                        className={`icon-option ${icone === valor
                                                ? "selected"
                                                : ""
                                            }`}
                                        onClick={() =>
                                            setIcone(valor)
                                        }
                                        aria-label={`Ícone ${valor}`}
                                    >
                                        <Icon size={22} />
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                </section>

                <section className="form-card">

                    <div className="form-card-title">
                        <h2>Informações Adicionais</h2>
                    </div>

                    <div className="form-group">

                        <label>
                            Status
                            <span>*</span>
                        </label>

                        <select defaultValue="ativa">
                            <option value="ativa">
                                Ativa
                            </option>
                        </select>

                    </div>

                    <div className="form-group">

                        <label>
                            Cor da Categoria
                        </label>

                        <div className="color-options">

                            {cores.map((corOpcao) => (
                                <button
                                    type="button"
                                    key={corOpcao}
                                    className={`color-option ${cor === corOpcao
                                            ? "selected"
                                            : ""
                                        }`}
                                    style={{
                                        backgroundColor:
                                            corOpcao,
                                    }}
                                    onClick={() =>
                                        setCor(corOpcao)
                                    }
                                    aria-label={`Selecionar cor ${corOpcao}`}
                                >
                                    {cor === corOpcao && (
                                        <Check
                                            size={16}
                                            color="white"
                                        />
                                    )}
                                </button>
                            ))}

                        </div>

                    </div>

                </section>

                <div className="categoria-form-actions">

                    <button
                        type="button"
                        className="btn-form-cancelar"
                        onClick={() =>
                            navigate("/categorias")
                        }
                        disabled={salvando}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="btn-form-salvar"
                        disabled={salvando}
                    >
                        {salvando
                            ? "Salvando..."
                            : editando
                                ? "Salvar Alterações"
                                : "Salvar Categoria"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default CategoriaForm;