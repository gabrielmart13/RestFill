import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./produtos.css";
import {
    AlertTriangle,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Download,
    Package,
    Pencil,
    Plus,
    Search,
    Tag,
    Trash2,
    X,
} from "lucide-react";

import produtoService from "../../services/produtoService";
import categoriaService from "../../services/categoriaService";
import unidadeMedidaService from "../../services/unidadeMedidaService";

import "./produtos.css";

function Produtos() {
    const navigate = useNavigate();

    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const [unidadeFiltro, setUnidadeFiltro] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("");

    const [pagina, setPagina] = useState(1);

    const [produtoExcluir, setProdutoExcluir] = useState(null);
    const [excluindo, setExcluindo] = useState(false);

    const produtosPorPagina = 8;

    // =========================================================
    // CARREGAR DADOS
    // =========================================================

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        setPagina(1);
    }, [
        busca,
        categoriaFiltro,
        unidadeFiltro,
        statusFiltro,
    ]);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            setErro("");

            const [
                produtosDados,
                categoriasDados,
                unidadesDados,
            ] = await Promise.all([
                produtoService.listar(),
                categoriaService.listar(),
                unidadeMedidaService.listar(),
            ]);

            setProdutos(produtosDados || []);
            setCategorias(categoriasDados || []);
            setUnidades(unidadesDados || []);
        } catch (error) {
            console.error(error);

            setErro(
                "Não foi possível carregar os dados dos produtos."
            );
        } finally {
            setCarregando(false);
        }
    };

    // =========================================================
    // AUXILIARES
    // =========================================================

    const obterCategoria = (idCategoria) => {
        return categorias.find(
            (categoria) =>
                categoria.idCategoria === idCategoria
        );
    };

    const obterUnidade = (idUnidadeMedida) => {
        return unidades.find(
            (unidade) =>
                unidade.idUnidadeMedida === idUnidadeMedida
        );
    };

    const obterStatus = (produto) => {
        const hoje = new Date();
        const validade = new Date(produto.validade);

        hoje.setHours(0, 0, 0, 0);
        validade.setHours(0, 0, 0, 0);

        const diferenca =
            (validade - hoje) /
            (1000 * 60 * 60 * 24);

        if (diferenca < 0) {
            return {
                tipo: "vencido",
                texto: "Vencido",
            };
        }

        if (diferenca <= 7) {
            return {
                tipo: "vencendo",
                texto: "Vencendo",
            };
        }

        if (
            Number(produto.quantidade) <=
            Number(produto.quantidadeMinima)
        ) {
            return {
                tipo: "atencao",
                texto: "Atenção",
            };
        }

        return {
            tipo: "ok",
            texto: "OK",
        };
    };

    const formatarMoeda = (valor) => {
        return Number(valor || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL",
            }
        );
    };

    const formatarData = (data) => {
        if (!data) {
            return "-";
        }

        return new Date(data).toLocaleDateString(
            "pt-BR"
        );
    };

    const formatarQuantidade = (quantidade) => {
        return Number(
            quantidade || 0
        ).toLocaleString("pt-BR", {
            maximumFractionDigits: 2,
        });
    };

    // =========================================================
    // FILTROS
    // =========================================================

    const produtosFiltrados = useMemo(() => {
        return produtos.filter((produto) => {
            const nomeProduto =
                produto.nome?.toLowerCase() || "";

            const termo =
                busca.toLowerCase().trim();

            const correspondeBusca =
                !termo ||
                nomeProduto.includes(termo);

            const correspondeCategoria =
                !categoriaFiltro ||
                String(produto.idCategoria) ===
                String(categoriaFiltro);

            const correspondeUnidade =
                !unidadeFiltro ||
                String(produto.idUnidadeMedida) ===
                String(unidadeFiltro);

            const status = obterStatus(produto);

            const correspondeStatus =
                !statusFiltro ||
                status.tipo === statusFiltro;

            return (
                correspondeBusca &&
                correspondeCategoria &&
                correspondeUnidade &&
                correspondeStatus
            );
        });
    }, [
        produtos,
        busca,
        categoriaFiltro,
        unidadeFiltro,
        statusFiltro,
    ]);

    // =========================================================
    // PAGINAÇÃO
    // =========================================================

    const totalPaginas = Math.max(
        1,
        Math.ceil(
            produtosFiltrados.length /
            produtosPorPagina
        )
    );

    const produtosPagina =
        produtosFiltrados.slice(
            (pagina - 1) * produtosPorPagina,
            pagina * produtosPorPagina
        );

    // =========================================================
    // ESTATÍSTICAS
    // =========================================================

    const estoqueBaixo = produtos.filter(
        (produto) =>
            Number(produto.quantidade) <=
            Number(produto.quantidadeMinima)
    );

    const validadeProxima = produtos.filter(
        (produto) => {
            const hoje = new Date();
            const validade = new Date(
                produto.validade
            );

            hoje.setHours(0, 0, 0, 0);
            validade.setHours(0, 0, 0, 0);

            const diferenca =
                (validade - hoje) /
                (1000 * 60 * 60 * 24);

            return (
                diferenca >= 0 &&
                diferenca <= 7
            );
        }
    );

    const valorTotalEstoque =
        produtos.reduce(
            (total, produto) => {
                return (
                    total +
                    Number(
                        produto.quantidade || 0
                    ) *
                    Number(
                        produto.custoPorKg || 0
                    )
                );
            },
            0
        );

    // =========================================================
    // EXCLUIR PRODUTO
    // =========================================================

    const excluirProduto = async () => {
        if (!produtoExcluir) {
            return;
        }

        try {
            setExcluindo(true);
            setErro("");

            await produtoService.excluir(
                produtoExcluir.idProduto
            );

            setProdutos(
                (produtosAtuais) =>
                    produtosAtuais.filter(
                        (produto) =>
                            produto.idProduto !==
                            produtoExcluir.idProduto
                    )
            );

            setProdutoExcluir(null);

            if (
                produtosPagina.length === 1 &&
                pagina > 1
            ) {
                setPagina(
                    (paginaAtual) =>
                        paginaAtual - 1
                );
            }
        } catch (error) {
            console.error(error);

            const mensagem =
                error?.response?.data?.message ||
                "Não foi possível excluir o produto.";

            setErro(mensagem);
        } finally {
            setExcluindo(false);
        }
    };

    // =========================================================
    // EXPORTAR CSV
    // =========================================================

    const exportarCSV = () => {
        if (produtosFiltrados.length === 0) {
            return;
        }

        const cabecalho = [
            "Produto",
            "Categoria",
            "Quantidade",
            "Unidade",
            "Validade",
            "Valor Unitario",
            "Valor Total",
            "Status",
        ];

        const linhas = produtosFiltrados.map(
            (produto) => {
                const categoria =
                    obterCategoria(
                        produto.idCategoria
                    );

                const unidade =
                    obterUnidade(
                        produto.idUnidadeMedida
                    );

                const status =
                    obterStatus(produto);

                const valorTotal =
                    Number(
                        produto.quantidade || 0
                    ) *
                    Number(
                        produto.custoPorKg || 0
                    );

                return [
                    produto.nome,
                    categoria?.nome || "-",
                    produto.quantidade,
                    unidade?.nome || "-",
                    formatarData(
                        produto.validade
                    ),
                    produto.custoPorKg,
                    valorTotal,
                    status.texto,
                ];
            }
        );

        const csv = [
            cabecalho,
            ...linhas,
        ]
            .map((linha) =>
                linha
                    .map((valor) => {
                        const texto =
                            String(
                                valor ?? ""
                            ).replace(
                                /"/g,
                                '""'
                            );

                        return `"${texto}"`;
                    })
                    .join(";")
            )
            .join("\n");

        const blob = new Blob(
            ["\uFEFF" + csv],
            {
                type:
                    "text/csv;charset=utf-8;",
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download =
            "restfill-produtos.csv";

        link.click();

        URL.revokeObjectURL(url);
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="produtos-page">

            {/* HEADER */}
            <header className="produtos-header">
                <div>
                    <h1>Produtos</h1>

                    <p>
                        Gerencie os produtos do seu
                        estoque
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={() =>
                        navigate(
                            "/produtos/novo"
                        )
                    }
                >
                    <Plus size={19} />
                    Novo Produto
                </button>
            </header>

            {/* ERRO */}
            {erro && (
                <div className="produtos-error">
                    <AlertTriangle size={20} />

                    <span>{erro}</span>

                    <button
                        onClick={() =>
                            setErro("")
                        }
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* ESTATÍSTICAS */}
            <section className="produtos-stats">

                <div className="produto-stat-card">
                    <div className="stat-icon">
                        <Package size={27} />
                    </div>

                    <div>
                        <strong>
                            {produtos.length}
                        </strong>

                        <span>
                            Produtos em Estoque
                        </span>

                        <small>
                            Total cadastrados
                        </small>
                    </div>
                </div>

                <div className="produto-stat-card">
                    <div className="stat-icon">
                        <AlertTriangle
                            size={27}
                        />
                    </div>

                    <div>
                        <strong>
                            {estoqueBaixo.length}
                        </strong>

                        <span>
                            Estoque Baixo
                        </span>

                        <small>
                            Requer atenção
                        </small>
                    </div>
                </div>

                <div className="produto-stat-card">
                    <div className="stat-icon">
                        <CalendarDays
                            size={27}
                        />
                    </div>

                    <div>
                        <strong>
                            {validadeProxima.length}
                        </strong>

                        <span>
                            Validade Próxima
                        </span>

                        <small>
                            Até 7 dias
                        </small>
                    </div>
                </div>

                <div className="produto-stat-card">
                    <div className="stat-icon">
                        <Package size={27} />
                    </div>

                    <div>
                        <strong>
                            {formatarMoeda(
                                valorTotalEstoque
                            )}
                        </strong>

                        <span>
                            Valor Total do Estoque
                        </span>

                        <small>
                            Custo atual
                        </small>
                    </div>
                </div>

                <div className="produto-stat-card">
                    <div className="stat-icon">
                        <Tag size={27} />
                    </div>

                    <div>
                        <strong>
                            {categorias.length}
                        </strong>

                        <span>
                            Categorias
                        </span>

                        <small>
                            Cadastradas
                        </small>
                    </div>
                </div>

            </section>

            {/* CONTEÚDO */}
            <section className="produtos-content">

                {/* FILTROS */}
                <div className="produtos-filtros">

                    <div className="search-box">
                        <Search size={19} />

                        <input
                            type="text"
                            value={busca}
                            onChange={(event) =>
                                setBusca(
                                    event.target.value
                                )
                            }
                            placeholder="Buscar produto..."
                        />

                        {busca && (
                            <button
                                onClick={() =>
                                    setBusca("")
                                }
                            >
                                <X size={17} />
                            </button>
                        )}
                    </div>

                    <select
                        value={categoriaFiltro}
                        onChange={(event) =>
                            setCategoriaFiltro(
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            Todas as categorias
                        </option>

                        {categorias.map(
                            (categoria) => (
                                <option
                                    key={
                                        categoria.idCategoria
                                    }
                                    value={
                                        categoria.idCategoria
                                    }
                                >
                                    {categoria.nome}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        value={unidadeFiltro}
                        onChange={(event) =>
                            setUnidadeFiltro(
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            Todas as unidades
                        </option>

                        {unidades.map(
                            (unidade) => (
                                <option
                                    key={
                                        unidade.idUnidadeMedida
                                    }
                                    value={
                                        unidade.idUnidadeMedida
                                    }
                                >
                                    {unidade.nome}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        value={statusFiltro}
                        onChange={(event) =>
                            setStatusFiltro(
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            Status (Todos)
                        </option>

                        <option value="ok">
                            OK
                        </option>

                        <option value="atencao">
                            Atenção
                        </option>

                        <option value="vencendo">
                            Vencendo
                        </option>

                        <option value="vencido">
                            Vencido
                        </option>
                    </select>

                    <button
                        className="btn-exportar"
                        onClick={exportarCSV}
                    >
                        <Download size={18} />
                        Exportar
                    </button>

                </div>

                {/* TABELA */}
                <div className="produtos-tabela">

                    <div className="tabela-header">
                        <span>Produto</span>
                        <span>Categoria</span>
                        <span>Quantidade</span>
                        <span>Unidade</span>
                        <span>Validade</span>
                        <span>Valor Unitário</span>
                        <span>Valor Total</span>
                        <span>Status</span>
                        <span>Ações</span>
                    </div>

                    {carregando ? (
                        <div className="tabela-vazia">
                            <div className="spinner" />

                            <span>
                                Carregando produtos...
                            </span>
                        </div>
                    ) : produtosPagina.length === 0 ? (
                        <div className="tabela-vazia">
                            <Package size={42} />

                            <strong>
                                Nenhum produto encontrado
                            </strong>

                            <span>
                                Tente alterar os filtros
                                ou cadastrar um novo
                                produto.
                            </span>
                        </div>
                    ) : (
                        produtosPagina.map(
                            (produto) => {
                                const categoria =
                                    obterCategoria(
                                        produto.idCategoria
                                    );

                                const unidade =
                                    obterUnidade(
                                        produto.idUnidadeMedida
                                    );

                                const status =
                                    obterStatus(
                                        produto
                                    );

                                const valorTotal =
                                    Number(
                                        produto.quantidade ||
                                        0
                                    ) *
                                    Number(
                                        produto.custoPorKg ||
                                        0
                                    );

                                return (
                                    <div
                                        className="tabela-row"
                                        key={
                                            produto.idProduto
                                        }
                                    >

                                        <div className="produto-nome">
                                            <div className="produto-imagem">
                                                <Package
                                                    size={20}
                                                />
                                            </div>

                                            <strong>
                                                {
                                                    produto.nome
                                                }
                                            </strong>
                                        </div>

                                        <span>
                                            {
                                                categoria?.nome ||
                                                "-"
                                            }
                                        </span>

                                        <span>
                                            {formatarQuantidade(
                                                produto.quantidade
                                            )}
                                        </span>

                                        <span>
                                            {
                                                unidade?.nome ||
                                                "-"
                                            }
                                        </span>

                                        <span>
                                            {formatarData(
                                                produto.validade
                                            )}
                                        </span>

                                        <span>
                                            {formatarMoeda(
                                                produto.custoPorKg
                                            )}
                                        </span>

                                        <span className="valor-total">
                                            {formatarMoeda(
                                                valorTotal
                                            )}
                                        </span>

                                        <span>
                                            <span
                                                className={`status-badge status-${status.tipo}`}
                                            >
                                                {
                                                    status.texto
                                                }
                                            </span>
                                        </span>

                                        <div className="acoes">

                                            <button
                                                className="btn-editar"
                                                title="Editar produto"
                                                onClick={() =>
                                                    navigate(
                                                        `/produtos/editar/${produto.idProduto}`
                                                    )
                                                }
                                            >
                                                <Pencil
                                                    size={18}
                                                />
                                            </button>

                                            <button
                                                className="btn-excluir"
                                                title="Excluir produto"
                                                onClick={() =>
                                                    setProdutoExcluir(
                                                        produto
                                                    )
                                                }
                                            >
                                                <Trash2
                                                    size={18}
                                                />
                                            </button>

                                        </div>

                                    </div>
                                );
                            }
                        )
                    )}

                    {/* PAGINAÇÃO */}
                    {!carregando &&
                        produtosFiltrados.length > 0 && (
                            <div className="tabela-footer">

                                <div className="paginacao">

                                    <button
                                        disabled={
                                            pagina === 1
                                        }
                                        onClick={() =>
                                            setPagina(
                                                (
                                                    paginaAtual
                                                ) =>
                                                    Math.max(
                                                        1,
                                                        paginaAtual -
                                                        1
                                                    )
                                            )
                                        }
                                    >
                                        <ChevronLeft
                                            size={18}
                                        />
                                    </button>

                                    {Array.from(
                                        {
                                            length:
                                                totalPaginas,
                                        },
                                        (_, index) =>
                                            index + 1
                                    )
                                        .filter(
                                            (numero) =>
                                                numero <= 3 ||
                                                numero ===
                                                totalPaginas
                                        )
                                        .map(
                                            (
                                                numero,
                                                index,
                                                array
                                            ) => (
                                                <span
                                                    key={
                                                        numero
                                                    }
                                                    className="pagina-wrapper"
                                                >

                                                    {index >
                                                        0 &&
                                                        numero -
                                                        array[
                                                        index -
                                                        1
                                                        ] >
                                                        1 && (
                                                            <span className="pagina-pontos">
                                                                ...
                                                            </span>
                                                        )}

                                                    <button
                                                        className={
                                                            pagina ===
                                                                numero
                                                                ? "pagina-ativa"
                                                                : ""
                                                        }
                                                        onClick={() =>
                                                            setPagina(
                                                                numero
                                                            )
                                                        }
                                                    >
                                                        {
                                                            numero
                                                        }
                                                    </button>

                                                </span>
                                            )
                                        )}

                                    <button
                                        disabled={
                                            pagina ===
                                            totalPaginas
                                        }
                                        onClick={() =>
                                            setPagina(
                                                (
                                                    paginaAtual
                                                ) =>
                                                    Math.min(
                                                        totalPaginas,
                                                        paginaAtual +
                                                        1
                                                    )
                                            )
                                        }
                                    >
                                        <ChevronRight
                                            size={18}
                                        />
                                    </button>

                                </div>

                                <span className="resultado-paginacao">

                                    Mostrando{" "}

                                    {Math.min(
                                        (pagina - 1) *
                                        produtosPorPagina +
                                        1,
                                        produtosFiltrados.length
                                    )}

                                    {" "}a{" "}

                                    {Math.min(
                                        pagina *
                                        produtosPorPagina,
                                        produtosFiltrados.length
                                    )}

                                    {" "}de{" "}

                                    {produtosFiltrados.length}

                                    {" "}produtos

                                </span>

                            </div>
                        )}

                </div>

            </section>

            {/* MODAL DE EXCLUSÃO */}
            {produtoExcluir && (
                <div
                    className="modal-overlay"
                    onClick={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setProdutoExcluir(null);
                        }
                    }}
                >

                    <div className="modal-excluir">

                        <button
                            className="modal-fechar"
                            onClick={() =>
                                setProdutoExcluir(null)
                            }
                        >
                            <X size={20} />
                        </button>

                        <div className="modal-icone">
                            <AlertTriangle
                                size={28}
                            />
                        </div>

                        <h2>
                            Excluir Produto
                        </h2>

                        <p>
                            Tem certeza que deseja
                            excluir o produto
                        </p>

                        <strong>
                            "{produtoExcluir.nome}"
                        </strong>

                        <span>
                            Essa ação não pode ser
                            desfeita.
                        </span>

                        <div className="modal-acoes">

                            <button
                                className="btn-cancelar"
                                onClick={() =>
                                    setProdutoExcluir(
                                        null
                                    )
                                }
                                disabled={excluindo}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn-confirmar-exclusao"
                                onClick={
                                    excluirProduto
                                }
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

export default Produtos;