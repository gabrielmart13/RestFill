import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";



import {
    CalendarDays,
    Folder,
    Package,
    Pencil,
    Plus,
    Search,
    Tag,
    Trash2,
    WalletCards,
    X,
    AlertTriangle,
} from "lucide-react";

import categoriaService from "../../services/categoriaService";
import produtoService from "../../services/produtoService";

import "./categorias.css";

function Categorias() {
    const navigate = useNavigate();

    const [categorias, setCategorias] = useState([]);
    const [produtos, setProdutos] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [busca, setBusca] = useState("");
    const [ordenacao, setOrdenacao] = useState("nome");

    const [categoriaExcluir, setCategoriaExcluir] = useState(null);
    const [excluindo, setExcluindo] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            setErro("");

            const [categoriasData, produtosData] = await Promise.all([
                categoriaService.listar(),
                produtoService.listar(),
            ]);

            setCategorias(categoriasData);
            setProdutos(produtosData);
        } catch (error) {
            console.error(error);
            setErro("Não foi possível carregar as categorias.");
        } finally {
            setCarregando(false);
        }
    };

    const quantidadeProdutos = produtos.length;

    const valorTotalEstoque = produtos.reduce(
        (total, produto) =>
            total +
            Number(produto.quantidade || 0) *
            Number(produto.custoPorKg || 0),
        0
    );

    const categoriasComDados = useMemo(() => {
        return categorias.map((categoria) => {
            const produtosCategoria = produtos.filter(
                (produto) =>
                    produto.idCategoria === categoria.idCategoria
            );

            const valorCategoria = produtosCategoria.reduce(
                (total, produto) =>
                    total +
                    Number(produto.quantidade || 0) *
                    Number(produto.custoPorKg || 0),
                0
            );

            return {
                ...categoria,
                quantidadeProdutos: produtosCategoria.length,
                valorCategoria,
            };
        });
    }, [categorias, produtos]);

    const categoriasFiltradas = useMemo(() => {
        const resultado = categoriasComDados.filter((categoria) =>
            categoria.nome
                .toLowerCase()
                .includes(busca.toLowerCase())
        );

        return [...resultado].sort((a, b) =>
            a.nome.localeCompare(b.nome)
        );
    }, [categoriasComDados, busca, ordenacao]);

    const excluirCategoria = async () => {
        if (!categoriaExcluir) {
            return;
        }

        try {
            setExcluindo(true);
            setErro("");

            await categoriaService.excluir(
                categoriaExcluir.idCategoria
            );

            setCategorias((categoriasAtuais) =>
                categoriasAtuais.filter(
                    (categoria) =>
                        categoria.idCategoria !==
                        categoriaExcluir.idCategoria
                )
            );

            setCategoriaExcluir(null);
        } catch (error) {
            console.error(error);

            const mensagem =
                error?.response?.data?.message ||
                "Não foi possível excluir a categoria.";

            setErro(mensagem);
        } finally {
            setExcluindo(false);
        }
    };

    const formatarMoeda = (valor) => {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const iconeCategoria = (icone) => {
        switch (icone) {
            case "meat":
                return "🥩";

            case "grain":
                return "🌾";

            case "vegetable":
                return "🥬";

            case "drink":
                return "🥤";

            case "dairy":
                return "🥛";

            default:
                return "◈";
        }
    };

    return (
        <div className="categorias-page">

            <div className="categorias-header">
                <div>
                    <h1>Categorias</h1>
                    <p>
                        Gerencie as categorias de produtos do seu
                        estoque
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={() =>
                        navigate("/categorias/nova")
                    }
                >
                    <Plus size={20} />
                    Nova Categoria
                </button>
            </div>

            {erro && (
                <div className="categoria-error">
                    <AlertTriangle size={20} />
                    <span>{erro}</span>

                    <button
                        onClick={() => setErro("")}
                        aria-label="Fechar erro"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <section className="categoria-stats">

                <div className="categoria-stat-card">
                    <div className="stat-icon">
                        <Folder size={27} />
                    </div>

                    <div>
                        <strong>{categorias.length}</strong>
                        <span>Categorias Cadastradas</span>
                        <small>Total de categorias</small>
                    </div>
                </div>

                <div className="categoria-stat-card">
                    <div className="stat-icon">
                        <Package size={27} />
                    </div>

                    <div>
                        <strong>{quantidadeProdutos}</strong>
                        <span>Produtos</span>
                        <small>Em todas categorias</small>
                    </div>
                </div>

                <div className="categoria-stat-card">
                    <div className="stat-icon">
                        <Tag size={27} />
                    </div>

                    <div>
                        <strong>
                            {formatarMoeda(valorTotalEstoque)}
                        </strong>
                        <span>Valor Total em Estoque</span>
                        <small>Todas categorias</small>
                    </div>
                </div>

                <div className="categoria-stat-card">
                    <div className="stat-icon">
                        <CalendarDays size={27} />
                    </div>

                    <div>
                        <strong>{categorias.length}</strong>
                        <span>Categorias Ativas</span>
                        <small>Ativas no sistema</small>
                    </div>
                </div>

            </section>

            <section className="categorias-container">

                <div className="categorias-filtros">

                    <div className="search-box">
                        <Search size={19} />

                        <input
                            type="text"
                            placeholder="Buscar categoria..."
                            value={busca}
                            onChange={(e) =>
                                setBusca(e.target.value)
                            }
                        />
                    </div>

                    <select defaultValue="todos">
                        <option value="todos">
                            Status (Todos)
                        </option>

                        <option value="ativa">
                            Ativa
                        </option>
                    </select>

                    <select
                        value={ordenacao}
                        onChange={(e) =>
                            setOrdenacao(e.target.value)
                        }
                    >
                        <option value="nome">
                            Ordenar por: Nome (A-Z)
                        </option>
                    </select>

                    <button
                        className="btn-exportar"
                        onClick={() =>
                            window.print()
                        }
                    >
                        ↓
                        Exportar
                    </button>

                </div>

                {carregando ? (
                    <div className="categoria-loading">
                        Carregando categorias...
                    </div>
                ) : categoriasFiltradas.length === 0 ? (
                    <div className="categoria-empty">
                        <Folder size={45} />

                        <h3>
                            Nenhuma categoria encontrada
                        </h3>

                        <p>
                            Tente alterar a busca ou cadastre uma
                            nova categoria.
                        </p>
                    </div>
                ) : (
                    <div className="categoria-table">

                        <div className="categoria-table-header">
                            <span>Categoria</span>
                            <span>Descrição</span>
                            <span>
                                Quantidade de Produtos
                            </span>
                            <span>Status</span>
                            <span>Ações</span>
                        </div>

                        {categoriasFiltradas.map(
                            (categoria) => (
                                <div
                                    className="categoria-table-row"
                                    key={categoria.idCategoria}
                                >

                                    <div className="categoria-name">
                                        <div
                                            className="categoria-icon"
                                            style={{
                                                backgroundColor:
                                                    categoria.cor ||
                                                    "#f3f4f6",
                                            }}
                                        >
                                            {iconeCategoria(
                                                categoria.icone
                                            )}
                                        </div>

                                        <strong>
                                            {categoria.nome}
                                        </strong>
                                    </div>

                                    <span className="categoria-descricao">
                                        {categoria.descricao ||
                                            "Sem descrição"}
                                    </span>

                                    <span>
                                        {
                                            categoria.quantidadeProdutos
                                        }
                                    </span>

                                    <span>
                                        <span className="status-ativa">
                                            Ativa
                                        </span>
                                    </span>

                                    <div className="categoria-acoes">

                                        <button
                                            className="action-edit"
                                            title="Editar categoria"
                                            onClick={() =>
                                                navigate(
                                                    `/categorias/editar/${categoria.idCategoria}`
                                                )
                                            }
                                        >
                                            <Pencil size={19} />
                                        </button>

                                        <button
                                            className="action-delete"
                                            title="Excluir categoria"
                                            onClick={() =>
                                                setCategoriaExcluir(
                                                    categoria
                                                )
                                            }
                                        >
                                            <Trash2 size={19} />
                                        </button>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

                {!carregando &&
                    categoriasFiltradas.length > 0 && (
                        <div className="categoria-footer">

                            <span>
                                Mostrando{" "}
                                {categoriasFiltradas.length}{" "}
                                de {categorias.length} categorias
                            </span>

                        </div>
                    )}

            </section>

            {categoriaExcluir && (
                <div
                    className="modal-overlay"
                    onClick={() =>
                        !excluindo &&
                        setCategoriaExcluir(null)
                    }
                >
                    <div
                        className="delete-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="modal-close"
                            onClick={() =>
                                !excluindo &&
                                setCategoriaExcluir(null)
                            }
                            disabled={excluindo}
                        >
                            <X size={20} />
                        </button>

                        <div className="delete-icon">
                            <AlertTriangle size={30} />
                        </div>

                        <h2>Excluir Categoria</h2>

                        <p>
                            Tem certeza que deseja excluir a
                            categoria
                            <strong>
                                {" "}
                                "{categoriaExcluir.nome}"?
                            </strong>
                        </p>

                        <small>
                            Essa ação não pode ser desfeita.
                        </small>

                        <div className="modal-actions">

                            <button
                                className="btn-cancelar"
                                onClick={() =>
                                    setCategoriaExcluir(null)
                                }
                                disabled={excluindo}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn-excluir"
                                onClick={excluirCategoria}
                                disabled={excluindo}
                            >
                                {excluindo
                                    ? "Excluindo..."
                                    : "Excluir"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default Categorias;