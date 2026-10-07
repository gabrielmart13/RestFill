import { useEffect, useState } from "react";
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    CalendarDays,
    Package,
    Save,
    User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import movimentacaoService from "../../services/movimentacaoService";
import produtoService from "../../services/produtoService";
import gerenteService from "../../services/gerenteService";

import "./movimentacaoform.css";

function MovimentacaoForm() {
    const navigate = useNavigate();

    const [produtos, setProdutos] = useState([]);
    const [gerentes, setGerentes] = useState([]);

    const [produtoSelecionado, setProdutoSelecionado] =
        useState("");

    const [tipo, setTipo] = useState("ENTRADA");

    const [quantidade, setQuantidade] =
        useState("");

    const [custo, setCusto] =
        useState("");

    const [data, setData] =
        useState("");

    const [observacao, setObservacao] =
        useState("");

    const [gerenteSelecionado, setGerenteSelecionado] =
        useState("");

    const [carregando, setCarregando] =
        useState(true);

    const [salvando, setSalvando] =
        useState(false);

    const [erro, setErro] =
        useState("");

    const [sucesso, setSucesso] =
        useState("");

    // =========================================================
    // CARREGAR DADOS
    // =========================================================

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            setErro("");

            const [
                produtosDados,
                gerentesDados,
            ] = await Promise.all([
                produtoService.listar(),
                gerenteService.listar(),
            ]);

            setProdutos(
                produtosDados || []
            );

            setGerentes(
                gerentesDados || []
            );

            if (
                gerentesDados &&
                gerentesDados.length === 1
            ) {
                setGerenteSelecionado(
                    String(
                        gerentesDados[0].idGerente
                    )
                );
            }

            // Define a data atual
            const agora = new Date();

            const ano =
                agora.getFullYear();

            const mes =
                String(
                    agora.getMonth() + 1
                ).padStart(2, "0");

            const dia =
                String(
                    agora.getDate()
                ).padStart(2, "0");

            const horas =
                String(
                    agora.getHours()
                ).padStart(2, "0");

            const minutos =
                String(
                    agora.getMinutes()
                ).padStart(2, "0");

            setData(
                `${ano}-${mes}-${dia}T${horas}:${minutos}`
            );

        } catch (error) {
            setErro(
                error?.response?.data?.message ||
                "Não foi possível carregar os dados do formulário."
            );
        } finally {
            setCarregando(false);
        }
    };

    // =========================================================
    // PRODUTO SELECIONADO
    // =========================================================

    const produtoAtual =
        produtos.find(
            (produto) =>
                String(
                    produto.idProduto
                ) ===
                String(
                    produtoSelecionado
                )
        );

    // =========================================================
    // SALVAR
    // =========================================================

    const salvarMovimentacao = async (
        event
    ) => {
        event.preventDefault();

        setErro("");
        setSucesso("");

        if (!produtoSelecionado) {
            setErro(
                "Selecione um produto."
            );
            return;
        }

        if (
            !quantidade ||
            Number(quantidade) <= 0
        ) {
            setErro(
                "Informe uma quantidade maior que zero."
            );
            return;
        }

        if (
            custo === "" ||
            Number(custo) < 0
        ) {
            setErro(
                "Informe um custo válido."
            );
            return;
        }

        if (!data) {
            setErro(
                "Informe a data da movimentação."
            );
            return;
        }

        if (!gerenteSelecionado) {
            setErro(
                "Selecione o gerente responsável."
            );
            return;
        }

        try {
            setSalvando(true);

            const movimentacao = {
                idProduto:
                    Number(
                        produtoSelecionado
                    ),

                quantidade:
                    Number(
                        quantidade
                    ),

                tipo,

                data:
                    new Date(
                        data
                    ).toISOString(),

                observacao:
                    observacao.trim() ||
                    null,

                idGerente:
                    Number(
                        gerenteSelecionado
                    ),

                custo:
                    Number(
                        custo
                    ),
            };

            await movimentacaoService.criar(
                movimentacao
            );

            setSucesso(
                "Movimentação registrada com sucesso."
            );

            setTimeout(() => {
                navigate(
                    "/movimentacoes"
                );
            }, 700);

        } catch (error) {
            const mensagem =
                error?.response?.data?.message ||
                "Não foi possível registrar a movimentação.";

            setErro(mensagem);
        } finally {
            setSalvando(false);
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    if (carregando) {
        return (
            <div className="movimentacao-form-loading">
                Carregando formulário...
            </div>
        );
    }

    return (
        <div className="movimentacao-form-page">

            {/* =================================================
                CABEÇALHO
            ================================================= */}

            <div className="movimentacao-form-header">

                <div>

                    <button
                        type="button"
                        className="movimentacao-form-voltar"
                        onClick={() =>
                            navigate(
                                "/movimentacoes"
                            )
                        }
                    >
                        <ArrowLeft size={18} />
                        Voltar para movimentações
                    </button>

                    <h1>
                        Nova Movimentação
                    </h1>

                    <p>
                        Registre uma entrada ou saída no estoque
                    </p>

                </div>

            </div>

            {/* =================================================
                FORMULÁRIO
            ================================================= */}

            <form
                className="movimentacao-form-container"
                onSubmit={
                    salvarMovimentacao
                }
            >

                <div className="movimentacao-form-content">

                    {/* =================================================
                        TIPO
                    ================================================= */}

                    <section className="movimentacao-form-section">

                        <div className="movimentacao-form-section-title">

                            <div className="movimentacao-form-title-icon">
                                <Package size={20} />
                            </div>

                            <div>
                                <h2>
                                    Tipo de movimentação
                                </h2>

                                <p>
                                    Informe se o estoque está entrando ou saindo
                                </p>
                            </div>

                        </div>

                        <div className="movimentacao-tipo-options">

                            <button
                                type="button"
                                className={
                                    tipo === "ENTRADA"
                                        ? "movimentacao-tipo-option entrada ativo"
                                        : "movimentacao-tipo-option entrada"
                                }
                                onClick={() =>
                                    setTipo(
                                        "ENTRADA"
                                    )
                                }
                            >

                                <div className="movimentacao-tipo-option-icon">
                                    <ArrowUp
                                        size={22}
                                    />
                                </div>

                                <div>
                                    <strong>
                                        Entrada
                                    </strong>

                                    <span>
                                        Adicionar quantidade ao estoque
                                    </span>
                                </div>

                            </button>

                            <button
                                type="button"
                                className={
                                    tipo === "SAIDA"
                                        ? "movimentacao-tipo-option saida ativo"
                                        : "movimentacao-tipo-option saida"
                                }
                                onClick={() =>
                                    setTipo(
                                        "SAIDA"
                                    )
                                }
                            >

                                <div className="movimentacao-tipo-option-icon">
                                    <ArrowDown
                                        size={22}
                                    />
                                </div>

                                <div>
                                    <strong>
                                        Saída
                                    </strong>

                                    <span>
                                        Retirar quantidade do estoque
                                    </span>
                                </div>

                            </button>

                        </div>

                    </section>

                    {/* =================================================
                        DADOS DA MOVIMENTAÇÃO
                    ================================================= */}

                    <section className="movimentacao-form-section">

                        <div className="movimentacao-form-section-title">

                            <div className="movimentacao-form-title-icon">
                                <Package size={20} />
                            </div>

                            <div>
                                <h2>
                                    Dados da movimentação
                                </h2>

                                <p>
                                    Informe os dados do lançamento
                                </p>
                            </div>

                        </div>

                        <div className="movimentacao-form-grid">

                            {/* PRODUTO */}

                            <div className="movimentacao-form-field campo-grande">

                                <label>
                                    Produto
                                    <span>*</span>
                                </label>

                                <select
                                    value={
                                        produtoSelecionado
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setProdutoSelecionado(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Selecione um produto
                                    </option>

                                    {produtos.map(
                                        (
                                            produto
                                        ) => (
                                            <option
                                                key={
                                                    produto.idProduto
                                                }
                                                value={
                                                    produto.idProduto
                                                }
                                            >
                                                {
                                                    produto.nome
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* QUANTIDADE */}

                            <div className="movimentacao-form-field">

                                <label>
                                    Quantidade
                                    <span>*</span>
                                </label>

                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={
                                        quantidade
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setQuantidade(
                                            event.target.value
                                        )
                                    }
                                    placeholder="0,00"
                                />

                                {produtoAtual && (
                                    <small>
                                        Estoque atual:{" "}
                                        {
                                            produtoAtual.quantidade
                                        }
                                    </small>
                                )}

                            </div>

                            {/* CUSTO */}

                            <div className="movimentacao-form-field">

                                <label>
                                    Custo
                                    <span>*</span>
                                </label>

                                <div className="movimentacao-input-prefix">

                                    <span>
                                        R$
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            custo
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCusto(
                                                event.target.value
                                            )
                                        }
                                        placeholder="0,00"
                                    />

                                </div>

                                <small>
                                    Informe o custo da movimentação
                                </small>

                            </div>

                            {/* DATA */}

                            <div className="movimentacao-form-field">

                                <label>
                                    Data e hora
                                    <span>*</span>
                                </label>

                                <div className="movimentacao-input-icon">

                                    <CalendarDays
                                        size={18}
                                    />

                                    <input
                                        type="datetime-local"
                                        value={
                                            data
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setData(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                            {/* GERENTE */}

                            <div className="movimentacao-form-field">

                                <label>
                                    Gerente responsável
                                    <span>*</span>
                                </label>

                                <div className="movimentacao-input-icon">

                                    <User
                                        size={18}
                                    />

                                    <select
                                        value={
                                            gerenteSelecionado
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setGerenteSelecionado(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Selecione o gerente
                                        </option>

                                        {gerentes.map(
                                            (
                                                gerente
                                            ) => (
                                                <option
                                                    key={
                                                        gerente.idGerente
                                                    }
                                                    value={
                                                        gerente.idGerente
                                                    }
                                                >
                                                    {
                                                        gerente.nome
                                                    }
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                            </div>

                            {/* OBSERVAÇÃO */}

                            <div className="movimentacao-form-field campo-completo">

                                <label>
                                    Observação
                                </label>

                                <textarea
                                    value={
                                        observacao
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setObservacao(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Adicione uma observação sobre esta movimentação..."
                                    rows="4"
                                    maxLength="255"
                                />

                                <small className="movimentacao-contador">
                                    {
                                        observacao.length
                                    }
                                    /255
                                </small>

                            </div>

                        </div>

                    </section>

                </div>

                {/* =================================================
                    MENSAGENS
                ================================================= */}

                {erro && (
                    <div className="movimentacao-form-error">
                        {erro}
                    </div>
                )}

                {sucesso && (
                    <div className="movimentacao-form-success">
                        {sucesso}
                    </div>
                )}

                {/* =================================================
                    RODAPÉ
                ================================================= */}

                <div className="movimentacao-form-footer">

                    <button
                        type="button"
                        className="movimentacao-form-cancelar"
                        onClick={() =>
                            navigate(
                                "/movimentacoes"
                            )
                        }
                        disabled={salvando}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="movimentacao-form-salvar"
                        disabled={salvando}
                    >

                        <Save size={18} />

                        {salvando
                            ? "Salvando..."
                            : "Registrar Movimentação"}

                    </button>

                </div>

            </form>

        </div>
    );
}

export default MovimentacaoForm;