import { useEffect, useState } from "react";

import {
    AlertTriangle,
    CalendarDays,
    Download,
    Info,
    Package,
    Search,
    ShoppingCart,
    SlidersHorizontal,
    Trash2,
} from "lucide-react";

import produtoService from "../../services/produtoService";
import categoriaService from "../../services/categoriaService";
import unidadeMedidaService from "../../services/unidadeMedidaService";
import movimentacaoService from "../../services/movimentacaoService";

import "./gastosprodutos.css";

const gerentePadrao = 1;

function normalizarData(data) {
    if (!data) {
        return "";
    }

    return String(data).substring(0, 10);
}

function formatarData(data) {
    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatarNumero(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function obterSegundaFeira(data = new Date()) {
    const resultado = new Date(data);
    const dia = resultado.getDay();

    const diferenca = dia === 0 ? -6 : 1 - dia;

    resultado.setDate(resultado.getDate() + diferenca);
    resultado.setHours(0, 0, 0, 0);

    return resultado;
}

function obterChaveData(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function obterDiasSemana(inicio) {
    return Array.from({ length: 7 }, (_, indice) => {
        const data = new Date(inicio);
        data.setDate(inicio.getDate() + indice);

        return data;
    });
}

function obterNomeDia(data) {
    return data.toLocaleDateString("pt-BR", {
        weekday: "short",
    }).replace(".", "");
}

function obterEmojiProduto(nome) {
    const nomeNormalizado = String(nome || "").toLowerCase();

    if (nomeNormalizado.includes("arroz")) {
        return "🍚";
    }

    if (
        nomeNormalizado.includes("frango") ||
        nomeNormalizado.includes("peito")
    ) {
        return "🍗";
    }

    if (nomeNormalizado.includes("oleo") ||
        nomeNormalizado.includes("óleo")) {
        return "🫗";
    }

    if (nomeNormalizado.includes("tomate")) {
        return "🍅";
    }

    if (nomeNormalizado.includes("alface")) {
        return "🥬";
    }

    if (nomeNormalizado.includes("queijo")) {
        return "🧀";
    }

    if (nomeNormalizado.includes("feijao") ||
        nomeNormalizado.includes("feijão")) {
        return "🫘";
    }

    if (nomeNormalizado.includes("batata")) {
        return "🥔";
    }

    return "📦";
}

function GastosProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [movimentacoes, setMovimentacoes] = useState([]);

    const [semanaInicio, setSemanaInicio] = useState(
        obterSegundaFeira()
    );

    const [quantidades, setQuantidades] = useState({});

    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const [unidadeFiltro, setUnidadeFiltro] = useState("");

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarDados() {
            try {
                setCarregando(true);
                setErro("");

                const [
                    produtosApi,
                    categoriasApi,
                    unidadesApi,
                    movimentacoesApi,
                ] = await Promise.all([
                    produtoService.listar(),
                    categoriaService.listar(),
                    unidadeMedidaService.listar(),
                    movimentacaoService.listar(),
                ]);

                setProdutos(produtosApi || []);
                setCategorias(categoriasApi || []);
                setUnidades(unidadesApi || []);
                setMovimentacoes(movimentacoesApi || []);
            } catch (error) {
                console.error(error);
                setErro(
                    "Não foi possível carregar os dados dos gastos."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, []);

    useEffect(() => {
        if (movimentacoes.length === 0) {
            return;
        }

        const novasQuantidades = {};

        movimentacoes.forEach((movimentacao) => {
            if (
                String(movimentacao.tipo || "").toUpperCase() !==
                "SAIDA"
            ) {
                return;
            }

            const data = normalizarData(
                movimentacao.data
            );

            const inicio = obterChaveData(
                semanaInicio
            );

            const fimData = new Date(semanaInicio);
            fimData.setDate(
                fimData.getDate() + 6
            );

            const fim = obterChaveData(fimData);

            if (data < inicio || data > fim) {
                return;
            }

            const chave =
                `${movimentacao.idProduto}_${data}`;

            novasQuantidades[chave] =
                Number(movimentacao.quantidade || 0);
        });

        setQuantidades(novasQuantidades);
    }, [movimentacoes, semanaInicio]);

    const diasSemana = obterDiasSemana(
        semanaInicio
    );

    const semanaFim = diasSemana[6];

    function obterCategoria(idCategoria) {
        return categorias.find(
            (categoria) =>
                categoria.idCategoria === idCategoria
        );
    }

    function obterUnidade(idUnidade) {
        return unidades.find(
            (unidade) =>
                unidade.idUnidadeMedida === idUnidade
        );
    }

    function obterQuantidade(
        idProduto,
        data
    ) {
        const chave =
            `${idProduto}_${obterChaveData(data)}`;

        return quantidades[chave] ?? "";
    }

    function atualizarQuantidade(
        idProduto,
        data,
        valor
    ) {
        const chave =
            `${idProduto}_${obterChaveData(data)}`;

        setQuantidades((estadoAtual) => ({
            ...estadoAtual,
            [chave]: valor,
        }));

        setMensagem("");
        setErro("");
    }

    function limparProduto(idProduto) {
        setQuantidades((estadoAtual) => {
            const novoEstado = {
                ...estadoAtual,
            };

            diasSemana.forEach((data) => {
                const chave =
                    `${idProduto}_${obterChaveData(data)}`;

                novoEstado[chave] = "";
            });

            return novoEstado;
        });

        setMensagem(
            "Os valores do produto foram removidos desta semana."
        );
    }

    function alterarSemana(event) {
        const [ano, mes, dia] =
            event.target.value.split("-").map(Number);

        const novaData = new Date(
            ano,
            mes - 1,
            dia
        );

        setSemanaInicio(
            obterSegundaFeira(novaData)
        );

        setMensagem("");
    }

    function importarSemanaAnterior() {
        const semanaAnterior = new Date(
            semanaInicio
        );

        semanaAnterior.setDate(
            semanaAnterior.getDate() - 7
        );

        const novoEstado = {};

        movimentacoes.forEach((movimentacao) => {
            if (
                String(movimentacao.tipo || "").toUpperCase() !==
                "SAIDA"
            ) {
                return;
            }

            const dataMovimentacao = new Date(
                `${normalizarData(movimentacao.data)}T12:00:00`
            );

            const diferenca =
                Math.floor(
                    (
                        dataMovimentacao -
                        semanaAnterior
                    ) /
                    (1000 * 60 * 60 * 24)
                );

            if (
                diferenca < 0 ||
                diferenca > 6
            ) {
                return;
            }

            const novaData = new Date(
                semanaInicio
            );

            novaData.setDate(
                novaData.getDate() + diferenca
            );

            const chave =
                `${movimentacao.idProduto}_${obterChaveData(
                    novaData
                )}`;

            novoEstado[chave] =
                Number(
                    movimentacao.quantidade || 0
                );
        });

        setQuantidades(novoEstado);

        setMensagem(
            "Dados da semana anterior importados."
        );
    }

    function produtosFiltrados() {
        const texto = busca
            .trim()
            .toLowerCase();

        return produtos.filter((produto) => {
            const correspondeBusca =
                !texto ||
                produto.nome
                    .toLowerCase()
                    .includes(texto);

            const correspondeCategoria =
                !categoriaFiltro ||
                String(produto.idCategoria) ===
                String(categoriaFiltro);

            const correspondeUnidade =
                !unidadeFiltro ||
                String(
                    produto.idUnidadeMedida
                ) === String(unidadeFiltro);

            return (
                correspondeBusca &&
                correspondeCategoria &&
                correspondeUnidade
            );
        });
    }

    function obterTotalProduto(idProduto) {
        return diasSemana.reduce(
            (total, data) => {
                return (
                    total +
                    Number(
                        obterQuantidade(
                            idProduto,
                            data
                        ) || 0
                    )
                );
            },
            0
        );
    }

    function obterCustoProduto(produto) {
        return (
            obterTotalProduto(
                produto.idProduto
            ) *
            Number(produto.custoPorKg || 0)
        );
    }

    function obterProdutosComConsumo() {
        return produtos.filter(
            (produto) =>
                obterTotalProduto(
                    produto.idProduto
                ) > 0
        );
    }

    function obterTotalGeral() {
        return produtos.reduce(
            (total, produto) =>
                total +
                obterTotalProduto(
                    produto.idProduto
                ),
            0
        );
    }

    function obterCustoTotal() {
        return produtos.reduce(
            (total, produto) =>
                total +
                obterCustoProduto(
                    produto
                ),
            0
        );
    }

    function obterEstoqueBaixo() {
        return produtos.filter(
            (produto) =>
                Number(produto.quantidade || 0) <=
                Number(
                    produto.quantidadeMinima || 0
                )
        ).length;
    }

    async function salvarSemana() {
        try {
            setSalvando(true);
            setMensagem("");
            setErro("");

            const existentes = new Set();

            movimentacoes.forEach((movimentacao) => {
                if (
                    String(
                        movimentacao.tipo || ""
                    ).toUpperCase() !== "SAIDA"
                ) {
                    return;
                }

                const data = normalizarData(
                    movimentacao.data
                );

                const inicio =
                    obterChaveData(
                        semanaInicio
                    );

                const fimData = new Date(
                    semanaInicio
                );

                fimData.setDate(
                    fimData.getDate() + 6
                );

                const fim =
                    obterChaveData(fimData);

                if (
                    data >= inicio &&
                    data <= fim
                ) {
                    existentes.add(
                        `${movimentacao.idProduto}_${data}`
                    );
                }
            });

            let novosLancamentos = 0;

            for (const produto of produtos) {
                for (const data of diasSemana) {
                    const quantidade = Number(
                        obterQuantidade(
                            produto.idProduto,
                            data
                        ) || 0
                    );

                    if (quantidade <= 0) {
                        continue;
                    }

                    const chave =
                        `${produto.idProduto}_${obterChaveData(
                            data
                        )}`;

                    if (existentes.has(chave)) {
                        continue;
                    }

                    await movimentacaoService.criar({
                        idProduto:
                            produto.idProduto,
                        quantidade,
                        tipo: "SAIDA",
                        data: `${obterChaveData(
                            data
                        )}T12:00:00`,
                        observacao:
                            "Consumo semanal do cardápio.",
                        idGerente:
                            gerentePadrao,
                        custo:
                            quantidade *
                            Number(
                                produto.custoPorKg ||
                                0
                            ),
                    });

                    novosLancamentos += 1;
                }
            }

            const atualizadas =
                await movimentacaoService.listar();

            setMovimentacoes(
                atualizadas || []
            );

            setMensagem(
                novosLancamentos > 0
                    ? `${novosLancamentos} lançamento(s) salvo(s) com sucesso.`
                    : "A semana já possui os lançamentos informados."
            );
        } catch (error) {
            console.error(error);

            setErro(
                "Não foi possível salvar a semana."
            );
        } finally {
            setSalvando(false);
        }
    }

    const produtosVisiveis =
        produtosFiltrados();

    const produtosComConsumo =
        obterProdutosComConsumo();

    const totalGasto = obterCustoTotal();
    const totalProdutos =
        produtosComConsumo.length;
    const estoqueBaixo =
        obterEstoqueBaixo();
    const totalUnidades =
        obterTotalGeral();

    if (carregando) {
        return (
            <div className="gastos-loading">
                <div className="gastos-spinner"></div>
                <span>
                    Carregando gastos...
                </span>
            </div>
        );
    }

    return (
        <div className="gastos-page">
            <header className="gastos-header">
                <div>
                    <h1>
                        Gastos de Produtos (Semanal)
                    </h1>

                    <p>
                        Registre o consumo dos produtos
                        utilizados no cardápio durante a
                        semana.
                    </p>
                </div>

                <div className="gastos-header-actions">
                    <div className="gastos-week-picker">
                        <CalendarDays
                            size={18}
                        />

                        <span>
                            {formatarData(
                                semanaInicio
                            )}{" "}
                            -{" "}
                            {formatarData(
                                semanaFim
                            )}
                        </span>

                        <input
                            type="date"
                            value={obterChaveData(
                                semanaInicio
                            )}
                            onChange={
                                alterarSemana
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className="btn-salvar-semana"
                        onClick={
                            salvarSemana
                        }
                        disabled={salvando}
                    >
                        <Download size={17} />

                        {salvando
                            ? "Salvando..."
                            : "Salvar Semana"}
                    </button>
                </div>
            </header>

            {erro && (
                <div className="gastos-alerta erro">
                    <span>{erro}</span>
                </div>
            )}

            {mensagem && (
                <div className="gastos-alerta sucesso">
                    <span>{mensagem}</span>
                </div>
            )}

            <section className="gastos-resumo">
                <div className="gastos-stat">
                    <div className="gastos-stat-icon">
                        <ShoppingCart
                            size={25}
                        />
                    </div>

                    <div>
                        <strong>
                            {formatarMoeda(
                                totalGasto
                            )}
                        </strong>

                        <span>
                            Total Gasto na Semana
                        </span>

                        <small>
                            Custo total baseado no
                            consumo informado
                        </small>
                    </div>
                </div>

                <div className="gastos-stat">
                    <div className="gastos-stat-icon">
                        <Package size={25} />
                    </div>

                    <div>
                        <strong>
                            {totalProdutos}
                        </strong>

                        <span>
                            Produtos Registrados
                        </span>

                        <small>
                            Produtos com consumo
                            informado
                        </small>
                    </div>
                </div>

                <div className="gastos-stat">
                    <div className="gastos-stat-icon">
                        <AlertTriangle
                            size={25}
                        />
                    </div>

                    <div>
                        <strong>
                            {estoqueBaixo}
                        </strong>

                        <span>
                            Produtos com Estoque Baixo
                        </span>

                        <small>
                            Atenção para reposição
                        </small>
                    </div>
                </div>

                <div className="gastos-stat">
                    <div className="gastos-stat-icon">
                        <CalendarDays
                            size={25}
                        />
                    </div>

                    <div>
                        <strong>7 dias</strong>

                        <span>
                            Período da Semana
                        </span>

                        <small>
                            {formatarData(
                                semanaInicio
                            )}{" "}
                            até{" "}
                            {formatarData(
                                semanaFim
                            )}
                        </small>
                    </div>
                </div>
            </section>

            <section className="gastos-table-card">
                <div className="gastos-filtros">
                    <div className="gastos-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Buscar produto..."
                            value={busca}
                            onChange={(event) =>
                                setBusca(
                                    event.target
                                        .value
                                )
                            }
                        />
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

                    <button
                        type="button"
                        className="btn-filtrar"
                    >
                        <SlidersHorizontal
                            size={17}
                        />
                        Filtrar
                    </button>

                    <button
                        type="button"
                        className="btn-importar"
                        onClick={
                            importarSemanaAnterior
                        }
                    >
                        <Download size={17} />
                        Importar da Semana Anterior
                    </button>
                </div>

                <div className="gastos-info">
                    <div className="gastos-info-icon">
                        <Info size={17} />
                    </div>

                    <div>
                        <strong>
                            Informe a quantidade utilizada de
                            cada produto durante a semana para
                            manter o cardápio.
                        </strong>

                        <p>
                            Esses dados serão utilizados para
                            calcular os gastos e prever quando
                            os produtos acabarão.
                        </p>
                    </div>
                </div>

                <div className="gastos-table-wrapper">
                    <table className="gastos-table">
                        <thead>
                            <tr>
                                <th className="col-produto">
                                    Produto
                                </th>

                                <th>
                                    Categoria
                                </th>

                                <th>
                                    Unidade
                                </th>

                                <th>
                                    Estoque
                                    <br />
                                    Atual
                                </th>

                                <th>
                                    Custo
                                    <br />
                                    Unitário
                                </th>

                                {diasSemana.map(
                                    (dia) => (
                                        <th
                                            key={obterChaveData(
                                                dia
                                            )}
                                        >
                                            {obterNomeDia(
                                                dia
                                            )}

                                            <br />

                                            {dia.toLocaleDateString(
                                                "pt-BR",
                                                {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                }
                                            )}
                                        </th>
                                    )
                                )}

                                <th>
                                    Total
                                    <br />
                                    Utilizado
                                </th>

                                <th>
                                    Custo
                                    <br />
                                    Total
                                </th>

                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {produtosVisiveis.map(
                                (produto) => {
                                    const categoria =
                                        obterCategoria(
                                            produto.idCategoria
                                        );

                                    const unidade =
                                        obterUnidade(
                                            produto.idUnidadeMedida
                                        );

                                    const totalProduto =
                                        obterTotalProduto(
                                            produto.idProduto
                                        );

                                    const custoProduto =
                                        obterCustoProduto(
                                            produto
                                        );

                                    return (
                                        <tr
                                            key={
                                                produto.idProduto
                                            }
                                        >
                                            <td className="produto-coluna">
                                                <div className="produto-identidade">
                                                    <div className="produto-imagem">
                                                        {obterEmojiProduto(
                                                            produto.nome
                                                        )}
                                                    </div>

                                                    <strong>
                                                        {
                                                            produto.nome
                                                        }
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                {categoria?.nome ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {unidade?.nome ||
                                                    unidade?.tipo ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {formatarNumero(
                                                    produto.quantidade
                                                )}
                                            </td>

                                            <td>
                                                {formatarMoeda(
                                                    produto.custoPorKg
                                                )}
                                            </td>

                                            {diasSemana.map(
                                                (
                                                    dia
                                                ) => (
                                                    <td
                                                        key={`${produto.idProduto}-${obterChaveData(
                                                            dia
                                                        )}`}
                                                    >
                                                        <input
                                                            className="quantidade-dia"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={obterQuantidade(
                                                                produto.idProduto,
                                                                dia
                                                            )}
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                atualizarQuantidade(
                                                                    produto.idProduto,
                                                                    dia,
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                )
                                            )}

                                            <td className="total-utilizado">
                                                {formatarNumero(
                                                    totalProduto
                                                )}{" "}
                                                {unidade?.nome ||
                                                    ""}
                                            </td>

                                            <td className="custo-total">
                                                {formatarMoeda(
                                                    custoProduto
                                                )}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn-limpar-produto"
                                                    title="Limpar semana"
                                                    onClick={() =>
                                                        limparProduto(
                                                            produto.idProduto
                                                        )
                                                    }
                                                >
                                                    <Trash2
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}

                            {produtosVisiveis.length ===
                                0 && (
                                    <tr>
                                        <td
                                            colSpan="16"
                                            className="gastos-vazio"
                                        >
                                            <Package
                                                size={35}
                                            />

                                            <strong>
                                                Nenhum produto
                                                encontrado
                                            </strong>

                                            <span>
                                                Altere os
                                                filtros ou a
                                                busca.
                                            </span>
                                        </td>
                                    </tr>
                                )}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td
                                    colSpan="12"
                                    className="total-geral-label"
                                >
                                    Total Geral
                                </td>

                                <td className="total-geral-quantidade">
                                    {formatarNumero(
                                        totalUnidades
                                    )}
                                    <span>
                                        unidades
                                    </span>
                                </td>

                                <td className="total-geral-custo">
                                    {formatarMoeda(
                                        totalGasto
                                    )}
                                </td>

                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default GastosProdutos;