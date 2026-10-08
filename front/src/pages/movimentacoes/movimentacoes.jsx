import { useEffect, useMemo, useState } from "react";
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    CalendarDays,
    ChevronDown,
    Download,
    Package,
    Plus,
    Search,
    Wallet,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import movimentacaoService from "../../services/movimentacaoService";
import produtoService from "../../services/produtoService";
import unidadeMedidaService from "../../services/unidadeMedidaService";

import "./movimentacao.css";

function Movimentacoes() {
    const navigate = useNavigate();

    const [movimentacoes, setMovimentacoes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [unidades, setUnidades] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [busca, setBusca] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState("");
    const [produtoFiltro, setProdutoFiltro] = useState("");
    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");

    const [pagina, setPagina] = useState(1);

    const itensPorPagina = 8;

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
        tipoFiltro,
        produtoFiltro,
        dataInicial,
        dataFinal,
    ]);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            setErro("");

            const [
                movimentacoesDados,
                produtosDados,
                unidadesDados,
            ] = await Promise.all([
                movimentacaoService.listar(),
                produtoService.listar(),
                unidadeMedidaService.listar(),
            ]);

            setMovimentacoes(
                movimentacoesDados || []
            );

            setProdutos(
                produtosDados || []
            );

            setUnidades(
                unidadesDados || []
            );
        } catch (error) {
            setErro(
                error?.response?.data?.message ||
                "Não foi possível carregar as movimentações."
            );
        } finally {
            setCarregando(false);
        }
    };

    // =========================================================
    // MAPAS
    // =========================================================

    const produtosMap = useMemo(() => {
        const mapa = {};

        produtos.forEach((produto) => {
            mapa[produto.idProduto] = produto;
        });

        return mapa;
    }, [produtos]);

    const unidadesMap = useMemo(() => {
        const mapa = {};

        unidades.forEach((unidade) => {
            mapa[unidade.idUnidadeMedida] = unidade;
        });

        return mapa;
    }, [unidades]);

    // =========================================================
    // FUNÇÕES AUXILIARES
    // =========================================================

    const obterProduto = (idProduto) => {
        return produtosMap[idProduto];
    };

    const obterUnidadeProduto = (idProduto) => {
        const produto = obterProduto(idProduto);

        if (!produto) {
            return "-";
        }

        const unidade =
            unidadesMap[produto.idUnidadeMedida];

        return unidade?.nome || "-";
    };

    const formatarData = (data) => {
        if (!data) {
            return "-";
        }

        return new Date(data).toLocaleDateString(
            "pt-BR"
        );
    };

    const formatarHora = (data) => {
        if (!data) {
            return "-";
        }

        return new Date(data).toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const formatarNumero = (valor) => {
        return Number(valor || 0).toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }
        );
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

    const normalizarTipo = (tipo) => {
        return String(tipo || "")
            .trim()
            .toUpperCase();
    };

    const ehEntrada = (movimentacao) => {
        return (
            normalizarTipo(
                movimentacao.tipo
            ) === "ENTRADA"
        );
    };

    // =========================================================
    // FILTROS
    // =========================================================

    const movimentacoesFiltradas = useMemo(() => {
        return movimentacoes.filter(
            (movimentacao) => {
                const produto = obterProduto(
                    movimentacao.idProduto
                );

                const nomeProduto =
                    produto?.nome || "";

                const observacao =
                    movimentacao.observacao || "";

                const textoBusca =
                    `${nomeProduto} ${observacao}`
                        .toLowerCase();

                const correspondeBusca =
                    !busca ||
                    textoBusca.includes(
                        busca.toLowerCase()
                    );

                const tipo =
                    normalizarTipo(
                        movimentacao.tipo
                    );

                const correspondeTipo =
                    !tipoFiltro ||
                    tipo === tipoFiltro;

                const correspondeProduto =
                    !produtoFiltro ||
                    String(
                        movimentacao.idProduto
                    ) === String(produtoFiltro);

                let correspondeDataInicial = true;
                let correspondeDataFinal = true;

                if (
                    dataInicial &&
                    movimentacao.data
                ) {
                    const inicio = new Date(
                        `${dataInicial}T00:00:00`
                    );

                    correspondeDataInicial =
                        new Date(
                            movimentacao.data
                        ) >= inicio;
                }

                if (
                    dataFinal &&
                    movimentacao.data
                ) {
                    const fim = new Date(
                        `${dataFinal}T23:59:59`
                    );

                    correspondeDataFinal =
                        new Date(
                            movimentacao.data
                        ) <= fim;
                }

                return (
                    correspondeBusca &&
                    correspondeTipo &&
                    correspondeProduto &&
                    correspondeDataInicial &&
                    correspondeDataFinal
                );
            }
        );
    }, [
        movimentacoes,
        produtosMap,
        busca,
        tipoFiltro,
        produtoFiltro,
        dataInicial,
        dataFinal,
    ]);

    // =========================================================
    // ORDENAÇÃO
    // =========================================================

    const movimentacoesOrdenadas = useMemo(() => {
        return [...movimentacoesFiltradas].sort(
            (a, b) =>
                new Date(b.data) -
                new Date(a.data)
        );
    }, [movimentacoesFiltradas]);

    // =========================================================
    // PAGINAÇÃO
    // =========================================================

    const totalPaginas = Math.ceil(
        movimentacoesOrdenadas.length /
        itensPorPagina
    );

    const movimentacoesPagina =
        movimentacoesOrdenadas.slice(
            (pagina - 1) * itensPorPagina,
            pagina * itensPorPagina
        );

    // =========================================================
    // RESUMOS
    // =========================================================

    const entradas = movimentacoes.filter(
        (movimentacao) =>
            ehEntrada(movimentacao)
    );

    const saidas = movimentacoes.filter(
        (movimentacao) =>
            !ehEntrada(movimentacao)
    );

    const quantidadeEntradas =
        entradas.reduce(
            (total, movimentacao) =>
                total +
                Number(
                    movimentacao.quantidade || 0
                ),
            0
        );

    const quantidadeSaidas =
        saidas.reduce(
            (total, movimentacao) =>
                total +
                Number(
                    movimentacao.quantidade || 0
                ),
            0
        );

    const valorEntradas =
        entradas.reduce(
            (total, movimentacao) =>
                total +
                Number(
                    movimentacao.custo || 0
                ),
            0
        );

    const valorSaidas =
        saidas.reduce(
            (total, movimentacao) =>
                total +
                Number(
                    movimentacao.custo || 0
                ),
            0
        );

    const mudarPagina = (novaPagina) => {
        if (
            novaPagina < 1 ||
            novaPagina > totalPaginas
        ) {
            return;
        }

        setPagina(novaPagina);
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="movimentacoes-page">

            {/* CABEÇALHO */}

            <div className="movimentacoes-header">

                <div>
                    <h1>
                        Movimentações
                    </h1>

                    <p>
                        Acompanhe as entradas e saídas do seu estoque
                    </p>
                </div>

                <button
                    className="movimentacoes-nova-button"
                    type="button"
                    onClick={() =>
                        navigate(
                            "/movimentacoes/nova"
                        )
                    }
                >
                    <Plus size={20} />
                    Nova Movimentação
                </button>

            </div>

            {/* ERRO */}

            {erro && (
                <div className="movimentacoes-error">
                    {erro}
                </div>
            )}

            {/* CARDS */}

            <div className="movimentacoes-cards">

                <div className="movimentacao-card">

                    <div className="movimentacao-card-icon entrada">
                        <ArrowUp size={24} />
                    </div>

                    <div className="movimentacao-card-content">
                        <strong>
                            {entradas.length}
                        </strong>

                        <span>
                            Entradas
                        </span>

                        <small>
                            +{" "}
                            {formatarNumero(
                                quantidadeEntradas
                            )}
                        </small>
                    </div>

                </div>

                <div className="movimentacao-card">

                    <div className="movimentacao-card-icon saida">
                        <ArrowDown size={24} />
                    </div>

                    <div className="movimentacao-card-content">
                        <strong>
                            {saidas.length}
                        </strong>

                        <span>
                            Saídas
                        </span>

                        <small>
                            -{" "}
                            {formatarNumero(
                                quantidadeSaidas
                            )}
                        </small>
                    </div>

                </div>

                <div className="movimentacao-card">

                    <div className="movimentacao-card-icon neutro">
                        <Package size={24} />
                    </div>

                    <div className="movimentacao-card-content">
                        <strong>
                            {movimentacoes.length}
                        </strong>

                        <span>
                            Total de Movimentações
                        </span>

                        <small>
                            Histórico completo
                        </small>
                    </div>

                </div>

                <div className="movimentacao-card">

                    <div className="movimentacao-card-icon valor">
                        <Wallet size={24} />
                    </div>

                    <div className="movimentacao-card-content">
                        <strong>
                            {formatarMoeda(
                                valorEntradas
                            )}
                        </strong>

                        <span>
                            Valor de Entradas
                        </span>

                        <small>
                            Total registrado
                        </small>
                    </div>

                </div>

                <div className="movimentacao-card">

                    <div className="movimentacao-card-icon valor">
                        <Wallet size={24} />
                    </div>

                    <div className="movimentacao-card-content">
                        <strong>
                            {formatarMoeda(
                                valorSaidas
                            )}
                        </strong>

                        <span>
                            Valor de Saídas
                        </span>

                        <small>
                            Total registrado
                        </small>
                    </div>

                </div>

            </div>

            {/* TABELA */}

            <div className="movimentacoes-container">

                {/* FILTROS */}

                <div className="movimentacoes-filtros">

                    <div className="movimentacoes-busca">
                        <Search size={19} />

                        <input
                            type="text"
                            placeholder="Buscar por produto, observação..."
                            value={busca}
                            onChange={(event) =>
                                setBusca(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div className="movimentacoes-select">

                        <select
                            value={tipoFiltro}
                            onChange={(event) =>
                                setTipoFiltro(
                                    event.target.value
                                )
                            }
                        >
                            <option value="">
                                Tipo (Todos)
                            </option>

                            <option value="ENTRADA">
                                Entrada
                            </option>

                            <option value="SAIDA">
                                Saída
                            </option>
                        </select>

                        <ChevronDown size={17} />

                    </div>

                    <div className="movimentacoes-select">

                        <select
                            value={produtoFiltro}
                            onChange={(event) =>
                                setProdutoFiltro(
                                    event.target.value
                                )
                            }
                        >
                            <option value="">
                                Todos os produtos
                            </option>

                            {produtos.map(
                                (produto) => (
                                    <option
                                        key={
                                            produto.idProduto
                                        }
                                        value={
                                            produto.idProduto
                                        }
                                    >
                                        {produto.nome}
                                    </option>
                                )
                            )}

                        </select>

                        <ChevronDown size={17} />

                    </div>

                    <div className="movimentacoes-data">

                        <CalendarDays size={18} />

                        <input
                            type="date"
                            value={dataInicial}
                            onChange={(event) =>
                                setDataInicial(
                                    event.target.value
                                )
                            }
                        />

                        <span>
                            →
                        </span>

                        <input
                            type="date"
                            value={dataFinal}
                            onChange={(event) =>
                                setDataFinal(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <button
                        className="movimentacoes-exportar"
                        type="button"
                    >
                        <Download size={18} />
                        Exportar
                    </button>

                </div>

                {/* CONTEÚDO */}

                {carregando ? (
                    <div className="movimentacoes-loading">
                        Carregando movimentações...
                    </div>

                ) : movimentacoesPagina.length === 0 ? (

                    <div className="movimentacoes-vazio">

                        <Package size={42} />

                        <h3>
                            Nenhuma movimentação encontrada
                        </h3>

                        <p>
                            Tente alterar os filtros ou registre uma nova movimentação.
                        </p>

                    </div>

                ) : (

                    <>

                        <div className="movimentacoes-table-wrapper">

                            <table className="movimentacoes-table">

                                <thead>
                                    <tr>
                                        <th>
                                            Data
                                        </th>

                                        <th>
                                            Tipo
                                        </th>

                                        <th>
                                            Produto
                                        </th>

                                        <th>
                                            Quantidade
                                        </th>

                                        <th>
                                            Unidade
                                        </th>

                                        <th>
                                            Custo
                                        </th>

                                        <th>
                                            Observação
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {movimentacoesPagina.map(
                                        (
                                            movimentacao
                                        ) => {

                                            const entrada =
                                                ehEntrada(
                                                    movimentacao
                                                );

                                            const produto =
                                                obterProduto(
                                                    movimentacao.idProduto
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        movimentacao.idMovimentacao
                                                    }
                                                >

                                                    <td>
                                                        <div className="movimentacao-data-cell">

                                                            <strong>
                                                                {formatarData(
                                                                    movimentacao.data
                                                                )}
                                                            </strong>

                                                            <span>
                                                                {formatarHora(
                                                                    movimentacao.data
                                                                )}
                                                            </span>

                                                        </div>
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                entrada
                                                                    ? "movimentacao-tipo entrada"
                                                                    : "movimentacao-tipo saida"
                                                            }
                                                        >

                                                            {entrada ? (
                                                                <ArrowUp
                                                                    size={15}
                                                                />
                                                            ) : (
                                                                <ArrowDown
                                                                    size={15}
                                                                />
                                                            )}

                                                            {entrada
                                                                ? "Entrada"
                                                                : "Saída"}

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <div className="movimentacao-produto">

                                                            <div className="movimentacao-produto-image">
                                                                <Package
                                                                    size={21}
                                                                />
                                                            </div>

                                                            <span>
                                                                {produto?.nome ||
                                                                    "Produto não encontrado"}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td>

                                                        <strong
                                                            className={
                                                                entrada
                                                                    ? "quantidade entrada"
                                                                    : "quantidade saida"
                                                            }
                                                        >
                                                            {entrada
                                                                ? "+"
                                                                : "-"}{" "}
                                                            {formatarNumero(
                                                                movimentacao.quantidade
                                                            )}
                                                        </strong>

                                                    </td>

                                                    <td>
                                                        {obterUnidadeProduto(
                                                            movimentacao.idProduto
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatarMoeda(
                                                            movimentacao.custo
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span className="movimentacao-observacao">
                                                            {movimentacao.observacao ||
                                                                "-"}
                                                        </span>
                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* PAGINAÇÃO */}

                        <div className="movimentacoes-paginacao">

                            <button
                                type="button"
                                disabled={
                                    pagina === 1
                                }
                                onClick={() =>
                                    mudarPagina(
                                        pagina - 1
                                    )
                                }
                            >
                                <ArrowLeft size={17} />
                            </button>

                            {Array.from(
                                {
                                    length:
                                        totalPaginas,
                                },
                                (_, index) =>
                                    index + 1
                            )
                                .slice(
                                    0,
                                    5
                                )
                                .map(
                                    (
                                        numeroPagina
                                    ) => (
                                        <button
                                            key={
                                                numeroPagina
                                            }
                                            type="button"
                                            className={
                                                pagina ===
                                                    numeroPagina
                                                    ? "ativo"
                                                    : ""
                                            }
                                            onClick={() =>
                                                mudarPagina(
                                                    numeroPagina
                                                )
                                            }
                                        >
                                            {
                                                numeroPagina
                                            }
                                        </button>
                                    )
                                )}

                            {totalPaginas > 5 && (
                                <>
                                    <span>
                                        ...
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            mudarPagina(
                                                totalPaginas
                                            )
                                        }
                                    >
                                        {
                                            totalPaginas
                                        }
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                disabled={
                                    pagina ===
                                    totalPaginas ||
                                    totalPaginas === 0
                                }
                                onClick={() =>
                                    mudarPagina(
                                        pagina + 1
                                    )
                                }
                            >
                                <ArrowRight size={17} />
                            </button>

                            <span className="movimentacoes-contagem">
                                Mostrando{" "}
                                {movimentacoesPagina.length}{" "}
                                de{" "}
                                {
                                    movimentacoesOrdenadas.length
                                }{" "}
                                movimentações
                            </span>

                        </div>

                    </>
                )}

            </div>

        </div>
    );
}

export default Movimentacoes;