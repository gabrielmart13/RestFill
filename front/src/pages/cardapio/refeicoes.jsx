import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
    Pencil,
    Plus,
    Search,
    Trash2,
    Utensils,
    X,
} from "lucide-react";

import refeicaoService from "../../services/refeicaoService";
import ingredienteService from "../../services/ingredienteService";
import itemcardapioService from "../../services/itemcardapioService";
import produtoService from "../../services/produtoService";
import unidadeMedidaService from "../../services/unidadeMedidaService";
import cardapioService from "../../services/cardapioService";

import "./refeicoes.css";

const diasSemana = [
    { valor: "Segunda", abreviacao: "Seg" },
    { valor: "Terca", abreviacao: "Ter" },
    { valor: "Quarta", abreviacao: "Qua" },
    { valor: "Quinta", abreviacao: "Qui" },
    { valor: "Sexta", abreviacao: "Sex" },
    { valor: "Sabado", abreviacao: "Sáb" },
    { valor: "Domingo", abreviacao: "Dom" },
];

const tiposRefeicao = [
    "Prato Principal",
    "Acompanhamento",
    "Sobremesa",
    "Bebida",
];

const estadoInicialFormulario = {
    nome: "",
    tipo: "Prato Principal",
    descricao: "",
    dias: ["Segunda", "Terca", "Quarta", "Quinta", "Sexta"],
    periodo: "Almoco",
    quantidadePrevista: "",
};

function normalizarDia(valor) {
    return String(valor || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function normalizarPeriodo(valor) {
    const periodo = String(valor || "").toLowerCase();

    if (
        periodo === "almoco" ||
        periodo === "almoço"
    ) {
        return "Almoco";
    }

    if (periodo === "jantar") {
        return "Jantar";
    }

    if (periodo === "ambos") {
        return "Ambos";
    }

    return "Almoco";
}

function formatarNumero(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function obterPeriodoTexto(periodo) {
    if (periodo === "Almoco") {
        return "Almoço";
    }

    if (periodo === "Jantar") {
        return "Jantar";
    }

    if (periodo === "Ambos") {
        return "Almoço / Jantar";
    }

    return "-";
}

function Refeicoes() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const modoCriar = location.pathname.endsWith("/nova");
    const modoEditar = Boolean(id);

    const [refeicoes, setRefeicoes] = useState([]);
    const [ingredientes, setIngredientes] = useState([]);
    const [itensCardapio, setItensCardapio] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [cardapios, setCardapios] = useState([]);

    const [busca, setBusca] = useState("");

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const [refeicaoExcluir, setRefeicaoExcluir] = useState(null);
    const [excluindo, setExcluindo] = useState(false);

    const [formulario, setFormulario] = useState(
        estadoInicialFormulario
    );

    const [ingredientesFormulario, setIngredientesFormulario] =
        useState([]);

    const [novoIngrediente, setNovoIngrediente] = useState({
        idProduto: "",
        quantidade: "",
    });

    useEffect(() => {
        async function carregarDados() {
            try {
                setCarregando(true);
                setErro("");

                const [
                    refeicoesApi,
                    ingredientesApi,
                    itensApi,
                    produtosApi,
                    unidadesApi,
                    cardapiosApi,
                ] = await Promise.all([
                    refeicaoService.listar(),
                    ingredienteService.listar(),
                    itemcardapioService.listar(),
                    produtoService.listar(),
                    unidadeMedidaService.listar(),
                    cardapioService.listar(),
                ]);

                setRefeicoes(refeicoesApi || []);
                setIngredientes(ingredientesApi || []);
                setItensCardapio(itensApi || []);
                setProdutos(produtosApi || []);
                setUnidades(unidadesApi || []);
                setCardapios(cardapiosApi || []);
            } catch (error) {
                console.error(error);
                setErro(
                    "Não foi possível carregar os dados do cardápio."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, []);

    useEffect(() => {
        if (!modoEditar || !id || carregando) {
            return;
        }

        const refeicao = refeicoes.find(
            (item) => item.idRefeicao === Number(id)
        );

        if (!refeicao) {
            setErro("Refeição não encontrada.");
            return;
        }

        const itensDaRefeicao = itensCardapio.filter(
            (item) => item.idRefeicao === Number(id)
        );

        const ingredientesDaRefeicao = ingredientes.filter(
            (item) => item.idRefeicao === Number(id)
        );

        const dias = itensDaRefeicao
            .map((item) => {
                const diaNormalizado = normalizarDia(
                    item.diaDaSemana
                );

                const encontrado = diasSemana.find(
                    (dia) =>
                        normalizarDia(dia.valor) ===
                        diaNormalizado
                );

                return encontrado?.valor;
            })
            .filter(Boolean);

        const primeiroItem = itensDaRefeicao[0];

        setFormulario({
            nome: refeicao.nome || "",
            tipo: "Prato Principal",
            descricao: refeicao.descricao || "",
            dias: [...new Set(dias)],
            periodo: normalizarPeriodo(
                primeiroItem?.periodo
            ),
            quantidadePrevista:
                primeiroItem?.quantidadePrevista ?? "",
        });

        setIngredientesFormulario(
            ingredientesDaRefeicao.map((ingrediente) => ({
                idIngrediente: ingrediente.idIngrediente,
                idProduto: ingrediente.idProduto,
                quantidade: ingrediente.quantidade,
            }))
        );
    }, [
        modoEditar,
        id,
        carregando,
        refeicoes,
        ingredientes,
        itensCardapio,
    ]);

    function atualizarCampo(campo, valor) {
        setFormulario((estadoAtual) => ({
            ...estadoAtual,
            [campo]: valor,
        }));
    }

    function alternarDia(dia) {
        setFormulario((estadoAtual) => {
            const diasAtuais = estadoAtual.dias;

            if (diasAtuais.includes(dia)) {
                return {
                    ...estadoAtual,
                    dias: diasAtuais.filter(
                        (item) => item !== dia
                    ),
                };
            }

            return {
                ...estadoAtual,
                dias: [...diasAtuais, dia],
            };
        });
    }

    function obterProduto(idProduto) {
        return produtos.find(
            (produto) => produto.idProduto === Number(idProduto)
        );
    }

    function obterUnidade(idUnidadeMedida) {
        return unidades.find(
            (unidade) =>
                unidade.idUnidadeMedida ===
                Number(idUnidadeMedida)
        );
    }

    function obterCustoIngrediente(ingrediente) {
        const produto = obterProduto(ingrediente.idProduto);

        if (!produto) {
            return 0;
        }

        return (
            Number(ingrediente.quantidade || 0) *
            Number(produto.custoPorKg || 0)
        );
    }

    function calcularCustoRefeicao() {
        return ingredientesFormulario.reduce(
            (total, ingrediente) =>
                total + obterCustoIngrediente(ingrediente),
            0
        );
    }

    function adicionarIngrediente() {
        const idProduto = Number(
            novoIngrediente.idProduto
        );

        const quantidade = Number(
            novoIngrediente.quantidade
        );

        if (!idProduto) {
            setErro("Selecione um produto para o ingrediente.");
            return;
        }

        if (!quantidade || quantidade <= 0) {
            setErro(
                "Informe uma quantidade válida para o ingrediente."
            );
            return;
        }

        const jaExiste = ingredientesFormulario.some(
            (ingrediente) =>
                Number(ingrediente.idProduto) === idProduto
        );

        if (jaExiste) {
            setErro(
                "Esse produto já foi adicionado à refeição."
            );
            return;
        }

        setIngredientesFormulario((listaAtual) => [
            ...listaAtual,
            {
                idIngrediente: null,
                idProduto,
                quantidade,
            },
        ]);

        setNovoIngrediente({
            idProduto: "",
            quantidade: "",
        });

        setErro("");
    }

    function removerIngrediente(idIngrediente, idProduto) {
        setIngredientesFormulario((listaAtual) =>
            listaAtual.filter((ingrediente) => {
                if (idIngrediente) {
                    return (
                        ingrediente.idIngrediente !==
                        idIngrediente
                    );
                }

                return ingrediente.idProduto !== idProduto;
            })
        );
    }

    function alterarQuantidadeIngrediente(
        idIngrediente,
        idProduto,
        quantidade
    ) {
        setIngredientesFormulario((listaAtual) =>
            listaAtual.map((ingrediente) => {
                const corresponde =
                    idIngrediente
                        ? ingrediente.idIngrediente ===
                        idIngrediente
                        : ingrediente.idProduto ===
                        idProduto;

                if (!corresponde) {
                    return ingrediente;
                }

                return {
                    ...ingrediente,
                    quantidade,
                };
            })
        );
    }

    function obterCardapioAtivo() {
        return (
            cardapios.find(
                (cardapio) => cardapio.ativo
            ) || cardapios[0]
        );
    }

    async function salvarRefeicao() {
        if (!formulario.nome.trim()) {
            setErro("Informe o nome da refeição.");
            return;
        }

        if (formulario.dias.length === 0) {
            setErro(
                "Selecione pelo menos um dia da semana."
            );
            return;
        }

        if (
            !formulario.quantidadePrevista ||
            Number(formulario.quantidadePrevista) <= 0
        ) {
            setErro(
                "Informe um consumo previsto maior que zero."
            );
            return;
        }

        if (!obterCardapioAtivo()) {
            setErro(
                "Não existe um cardápio disponível para esta refeição."
            );
            return;
        }

        try {
            setSalvando(true);
            setErro("");

            let idRefeicao = Number(id);

            if (modoCriar) {
                const novaRefeicao =
                    await refeicaoService.criar({
                        nome: formulario.nome.trim(),
                        descricao:
                            formulario.descricao.trim() ||
                            null,
                    });

                idRefeicao = novaRefeicao.idRefeicao;
            } else {
                await refeicaoService.atualizar(idRefeicao, {
                    nome: formulario.nome.trim(),
                    descricao:
                        formulario.descricao.trim() ||
                        null,
                });
            }

            await sincronizarIngredientes(idRefeicao);
            await sincronizarItensCardapio(idRefeicao);

            navigate("/cardapio/refeicoes");
        } catch (error) {
            console.error(error);

            setErro(
                "Não foi possível salvar a refeição."
            );
        } finally {
            setSalvando(false);
        }
    }

    async function sincronizarIngredientes(idRefeicao) {
        const existentes = ingredientes.filter(
            (ingrediente) =>
                ingrediente.idRefeicao === idRefeicao
        );

        const atuaisIds = ingredientesFormulario
            .filter(
                (ingrediente) =>
                    ingrediente.idIngrediente
            )
            .map(
                (ingrediente) =>
                    ingrediente.idIngrediente
            );

        for (const existente of existentes) {
            if (!atuaisIds.includes(existente.idIngrediente)) {
                await ingredienteService.excluir(
                    existente.idIngrediente
                );
            }
        }

        for (const ingrediente of ingredientesFormulario) {
            const dados = {
                idProduto: Number(
                    ingrediente.idProduto
                ),
                quantidade: Number(
                    ingrediente.quantidade
                ),
                idRefeicao,
            };

            if (ingrediente.idIngrediente) {
                await ingredienteService.atualizar(
                    ingrediente.idIngrediente,
                    dados
                );
            } else {
                await ingredienteService.criar(dados);
            }
        }
    }

    async function sincronizarItensCardapio(idRefeicao) {
        const cardapio = obterCardapioAtivo();

        const existentes = itensCardapio.filter(
            (item) =>
                item.idRefeicao === idRefeicao &&
                item.idCardapio ===
                cardapio.idCardapio
        );

        const porDia = new Map();

        existentes.forEach((item) => {
            porDia.set(
                normalizarDia(item.diaDaSemana),
                item
            );
        });

        const diasSelecionados = formulario.dias.map(
            (dia) => normalizarDia(dia)
        );

        for (const item of existentes) {
            const diaNormalizado = normalizarDia(
                item.diaDaSemana
            );

            if (!diasSelecionados.includes(diaNormalizado)) {
                await itemcardapioService.excluir(
                    item.idItemCardapio
                );
            }
        }

        for (const dia of formulario.dias) {
            const diaNormalizado =
                normalizarDia(dia);

            const existente =
                porDia.get(diaNormalizado);

            const dados = {
                diaDaSemana: dia,
                quantidadePrevista: Number(
                    formulario.quantidadePrevista
                ),
                idCardapio: cardapio.idCardapio,
                idRefeicao,
                periodo: formulario.periodo,
            };

            if (existente) {
                await itemcardapioService.atualizar(
                    existente.idItemCardapio,
                    dados
                );
            } else {
                await itemcardapioService.criar(
                    dados
                );
            }
        }
    }

    function abrirEdicao(idRefeicao) {
        navigate(
            `/cardapio/refeicoes/editar/${idRefeicao}`
        );
    }

    function abrirExclusao(refeicao) {
        setRefeicaoExcluir(refeicao);
    }

    function fecharExclusao() {
        if (!excluindo) {
            setRefeicaoExcluir(null);
        }
    }

    async function confirmarExclusao() {
        if (!refeicaoExcluir) {
            return;
        }

        try {
            setExcluindo(true);
            setErro("");

            await refeicaoService.excluir(
                refeicaoExcluir.idRefeicao
            );

            setRefeicoes((listaAtual) =>
                listaAtual.filter(
                    (refeicao) =>
                        refeicao.idRefeicao !==
                        refeicaoExcluir.idRefeicao
                )
            );

            setIngredientes((listaAtual) =>
                listaAtual.filter(
                    (ingrediente) =>
                        ingrediente.idRefeicao !==
                        refeicaoExcluir.idRefeicao
                )
            );

            setItensCardapio((listaAtual) =>
                listaAtual.filter(
                    (item) =>
                        item.idRefeicao !==
                        refeicaoExcluir.idRefeicao
                )
            );

            setRefeicaoExcluir(null);
        } catch (error) {
            console.error(error);

            setErro(
                "Não foi possível excluir a refeição. Ela pode estar sendo utilizada no cardápio."
            );
        } finally {
            setExcluindo(false);
        }
    }

    function cancelarFormulario() {
        navigate("/cardapio/refeicoes");
    }

    const refeicoesFiltradas = refeicoes.filter(
        (refeicao) =>
            !busca ||
            refeicao.nome
                .toLowerCase()
                .includes(busca.toLowerCase())
    );

    if (carregando) {
        return (
            <div className="refeicoes-loading">
                <div className="refeicoes-spinner"></div>
                <span>Carregando...</span>
            </div>
        );
    }

    if (modoCriar || modoEditar) {
        return (
            <div className="refeicoes-page">
                <div className="refeicoes-breadcrumb">
                    <span>Cardápio</span>
                    <span>›</span>
                    <span>Refeições</span>
                    <span>›</span>
                    <strong>
                        {modoEditar
                            ? "Editar Refeição"
                            : "Adicionar Refeição"}
                    </strong>
                </div>

                <header className="refeicoes-header">
                    <div>
                        <h1>
                            {modoEditar
                                ? "Editar Refeição"
                                : "Adicionar Refeição"}
                        </h1>

                        <p>
                            {modoEditar
                                ? "Edite as informações da refeição."
                                : "Cadastre uma nova refeição no cardápio."}
                        </p>
                    </div>
                </header>

                {erro && (
                    <div className="refeicoes-alerta">
                        <span>{erro}</span>

                        <button
                            type="button"
                            onClick={() => setErro("")}
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                <div className="refeicao-form-layout">
                    <section className="form-card">
                        <h2>Informações da Refeição</h2>

                        <div className="form-grid">
                            <div className="campo">
                                <label htmlFor="nome">
                                    Nome da Refeição{" "}
                                    <b>*</b>
                                </label>

                                <input
                                    id="nome"
                                    type="text"
                                    value={formulario.nome}
                                    onChange={(event) =>
                                        atualizarCampo(
                                            "nome",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Ex.: Frango grelhado com arroz e salada"
                                />
                            </div>

                            <div className="campo">
                                <label>
                                    Dias da Semana{" "}
                                    <b>*</b>
                                </label>

                                <div className="dias-semana">
                                    {diasSemana.map(
                                        (dia) => (
                                            <label
                                                className="dia-checkbox"
                                                key={
                                                    dia.valor
                                                }
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formulario.dias.includes(
                                                        dia.valor
                                                    )}
                                                    onChange={() =>
                                                        alternarDia(
                                                            dia.valor
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {
                                                        dia.abreviacao
                                                    }
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="campo">
                                <label htmlFor="tipo">
                                    Tipo de Refeição{" "}
                                    <b>*</b>
                                </label>

                                <select
                                    id="tipo"
                                    value={formulario.tipo}
                                    onChange={(event) =>
                                        atualizarCampo(
                                            "tipo",
                                            event.target.value
                                        )
                                    }
                                >
                                    {tiposRefeicao.map(
                                        (tipo) => (
                                            <option
                                                key={tipo}
                                                value={tipo}
                                            >
                                                {tipo}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="campo">
                                <label>
                                    Consumo Previsto (por dia){" "}
                                    <b>*</b>
                                </label>

                                <div className="campo-com-unidade">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            formulario.quantidadePrevista
                                        }
                                        onChange={(event) =>
                                            atualizarCampo(
                                                "quantidadePrevista",
                                                event.target.value
                                            )
                                        }
                                        placeholder="0,00"
                                    />

                                    <span>kg</span>
                                </div>
                            </div>

                            <div className="campo">
                                <label>
                                    Período do Dia{" "}
                                    <b>*</b>
                                </label>

                                <div className="periodos">
                                    <label>
                                        <input
                                            type="radio"
                                            name="periodo"
                                            value="Almoco"
                                            checked={
                                                formulario.periodo ===
                                                "Almoco"
                                            }
                                            onChange={(event) =>
                                                atualizarCampo(
                                                    "periodo",
                                                    event.target.value
                                                )
                                            }
                                        />
                                        Almoço
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="periodo"
                                            value="Jantar"
                                            checked={
                                                formulario.periodo ===
                                                "Jantar"
                                            }
                                            onChange={(event) =>
                                                atualizarCampo(
                                                    "periodo",
                                                    event.target.value
                                                )
                                            }
                                        />
                                        Jantar
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="periodo"
                                            value="Ambos"
                                            checked={
                                                formulario.periodo ===
                                                "Ambos"
                                            }
                                            onChange={(event) =>
                                                atualizarCampo(
                                                    "periodo",
                                                    event.target.value
                                                )
                                            }
                                        />
                                        Ambos
                                    </label>
                                </div>
                            </div>

                            <div className="campo">
                                <label>
                                    Custo Previsto (por dia)
                                </label>

                                <div className="campo-custo">
                                    <span>R$</span>

                                    <input
                                        type="text"
                                        value={formatarNumero(
                                            calcularCustoRefeicao()
                                        )}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="campo campo-full">
                                <label htmlFor="descricao">
                                    Descrição / Observações
                                </label>

                                <textarea
                                    id="descricao"
                                    maxLength="300"
                                    value={formulario.descricao}
                                    onChange={(event) =>
                                        atualizarCampo(
                                            "descricao",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Informações adicionais sobre a refeição..."
                                />

                                <small>
                                    {
                                        formulario.descricao
                                            .length
                                    }
                                    /300
                                </small>
                            </div>
                        </div>
                    </section>

                    <section className="form-card ingredientes-card">
                        <div className="form-card-header">
                            <div>
                                <h2>Ingredientes da Refeição</h2>

                                <p>
                                    Adicione os ingredientes utilizados nesta
                                    refeição e as quantidades previstas.
                                </p>
                            </div>
                        </div>

                        <div className="adicionar-ingrediente">
                            <select
                                value={
                                    novoIngrediente.idProduto
                                }
                                onChange={(event) =>
                                    setNovoIngrediente(
                                        (estadoAtual) => ({
                                            ...estadoAtual,
                                            idProduto:
                                                event.target
                                                    .value,
                                        })
                                    )
                                }
                            >
                                <option value="">
                                    Selecione o ingrediente
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

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                    novoIngrediente.quantidade
                                }
                                onChange={(event) =>
                                    setNovoIngrediente(
                                        (estadoAtual) => ({
                                            ...estadoAtual,
                                            quantidade:
                                                event.target
                                                    .value,
                                        })
                                    )
                                }
                                placeholder="Qtd."
                            />

                            <button
                                type="button"
                                onClick={adicionarIngrediente}
                            >
                                <Plus size={17} />
                                Adicionar
                            </button>
                        </div>

                        {ingredientesFormulario.length === 0 ? (
                            <div className="ingredientes-vazio">
                                <Utensils size={35} />

                                <strong>
                                    Nenhum ingrediente adicionado.
                                </strong>

                                <span>
                                    Adicione os ingredientes utilizados
                                    nesta refeição.
                                </span>
                            </div>
                        ) : (
                            <div className="ingredientes-tabela-container">
                                <table className="ingredientes-tabela">
                                    <thead>
                                        <tr>
                                            <th>
                                                INGREDIENTE
                                            </th>
                                            <th>
                                                QUANTIDADE
                                            </th>
                                            <th>UNIDADE</th>
                                            <th>CUSTO</th>
                                            <th>AÇÕES</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {ingredientesFormulario.map(
                                            (
                                                ingrediente
                                            ) => {
                                                const produto =
                                                    obterProduto(
                                                        ingrediente.idProduto
                                                    );

                                                const unidade =
                                                    obterUnidade(
                                                        produto?.idUnidadeMedida
                                                    );

                                                return (
                                                    <tr
                                                        key={`${ingrediente.idIngrediente || "novo"}-${ingrediente.idProduto}`}
                                                    >
                                                        <td>
                                                            {produto?.nome ||
                                                                "Produto não encontrado"}
                                                        </td>

                                                        <td>
                                                            <input
                                                                className="quantidade-ingrediente"
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={
                                                                    ingrediente.quantidade
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    alterarQuantidadeIngrediente(
                                                                        ingrediente.idIngrediente,
                                                                        ingrediente.idProduto,
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </td>

                                                        <td>
                                                            {unidade?.nome ||
                                                                "kg"}
                                                        </td>

                                                        <td>
                                                            {formatarMoeda(
                                                                obterCustoIngrediente(
                                                                    ingrediente
                                                                )
                                                            )}
                                                        </td>

                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="ingrediente-excluir"
                                                                onClick={() =>
                                                                    removerIngrediente(
                                                                        ingrediente.idIngrediente,
                                                                        ingrediente.idProduto
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
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>

                <div className="form-acoes">
                    <button
                        type="button"
                        className="btn-form-cancelar"
                        onClick={cancelarFormulario}
                        disabled={salvando}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="btn-form-salvar"
                        onClick={salvarRefeicao}
                        disabled={salvando}
                    >
                        {salvando
                            ? "Salvando..."
                            : modoEditar
                                ? "Salvar Alterações"
                                : "Salvar Refeição"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="refeicoes-page">
            <div className="refeicoes-breadcrumb">
                <span>Cardápio</span>
                <span>›</span>
                <strong>Refeições</strong>
            </div>

            <header className="refeicoes-header">
                <div>
                    <h1>Refeições do Cardápio</h1>

                    <p>
                        Gerencie as refeições utilizadas no cardápio
                        semanal.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn-nova-refeicao"
                    onClick={() =>
                        navigate(
                            "/cardapio/refeicoes/nova"
                        )
                    }
                >
                    <Plus size={19} />
                    Nova Refeição
                </button>
            </header>

            {erro && (
                <div className="refeicoes-alerta">
                    <span>{erro}</span>

                    <button
                        type="button"
                        onClick={() => setErro("")}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <section className="refeicoes-card">
                <div className="refeicoes-toolbar">
                    <div className="refeicoes-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Buscar refeição..."
                            value={busca}
                            onChange={(event) =>
                                setBusca(
                                    event.target.value
                                )
                            }
                        />
                    </div>
                </div>

                <div className="refeicoes-table-container">
                    <table className="refeicoes-table">
                        <thead>
                            <tr>
                                <th>REFEIÇÃO</th>
                                <th>PERÍODO</th>
                                <th>CONSUMO (KG)</th>
                                <th>CUSTO POR DIA</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>

                        <tbody>
                            {refeicoesFiltradas.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="refeicoes-vazio"
                                    >
                                        <Utensils size={32} />

                                        <strong>
                                            Nenhuma refeição encontrada
                                        </strong>

                                        <span>
                                            Cadastre uma refeição
                                            para começar.
                                        </span>
                                    </td>
                                </tr>
                            ) : (
                                refeicoesFiltradas.map(
                                    (refeicao) => {
                                        const itens =
                                            itensCardapio.filter(
                                                (item) =>
                                                    item.idRefeicao ===
                                                    refeicao.idRefeicao
                                            );

                                        const consumo =
                                            itens.reduce(
                                                (
                                                    total,
                                                    item
                                                ) =>
                                                    total +
                                                    Number(
                                                        item.quantidadePrevista ||
                                                        0
                                                    ),
                                                0
                                            );

                                        const periodos = [
                                            ...new Set(
                                                itens.map(
                                                    (item) =>
                                                        normalizarPeriodo(
                                                            item.periodo
                                                        )
                                                )
                                            ),
                                        ];

                                        const custo =
                                            ingredientes
                                                .filter(
                                                    (
                                                        ingrediente
                                                    ) =>
                                                        ingrediente.idRefeicao ===
                                                        refeicao.idRefeicao
                                                )
                                                .reduce(
                                                    (
                                                        total,
                                                        ingrediente
                                                    ) =>
                                                        total +
                                                        obterCustoIngrediente(
                                                            ingrediente
                                                        ),
                                                    0
                                                );

                                        return (
                                            <tr
                                                key={
                                                    refeicao.idRefeicao
                                                }
                                            >
                                                <td>
                                                    <span className="refeicao-nome">
                                                        {
                                                            refeicao.nome
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {periodos.length >
                                                        0
                                                        ? periodos
                                                            .map(
                                                                obterPeriodoTexto
                                                            )
                                                            .join(
                                                                " / "
                                                            )
                                                        : "-"}
                                                </td>

                                                <td>
                                                    {
                                                        formatarNumero(
                                                            consumo
                                                        )
                                                    }{" "}
                                                    kg
                                                </td>

                                                <td>
                                                    {formatarMoeda(
                                                        custo
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="acoes-refeicao">
                                                        <button
                                                            type="button"
                                                            className="acao-editar"
                                                            title="Editar refeição"
                                                            onClick={() =>
                                                                abrirEdicao(
                                                                    refeicao.idRefeicao
                                                                )
                                                            }
                                                        >
                                                            <Pencil
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="acao-excluir"
                                                            title="Excluir refeição"
                                                            onClick={() =>
                                                                abrirExclusao(
                                                                    refeicao
                                                                )
                                                            }
                                                        >
                                                            <Trash2
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {refeicaoExcluir && (
                <div
                    className="modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            fecharExclusao();
                        }
                    }}
                >
                    <div className="modal-exclusao">
                        <button
                            type="button"
                            className="modal-fechar"
                            onClick={fecharExclusao}
                            disabled={excluindo}
                        >
                            <X size={19} />
                        </button>

                        <div className="modal-icone">
                            <Trash2 size={26} />
                        </div>

                        <h2>Excluir Refeição</h2>

                        <p>
                            Tem certeza que deseja excluir a refeição
                        </p>

                        <strong>
                            "{refeicaoExcluir.nome}"?
                        </strong>

                        <span>
                            Esta ação não pode ser desfeita.
                        </span>

                        <div className="modal-acoes">
                            <button
                                type="button"
                                className="btn-cancelar"
                                onClick={fecharExclusao}
                                disabled={excluindo}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="btn-confirmar-exclusao"
                                onClick={confirmarExclusao}
                                disabled={excluindo}
                            >
                                {excluindo
                                    ? "Excluindo..."
                                    : "Excluir Refeição"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Refeicoes;