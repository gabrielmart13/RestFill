import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    CalendarDays,
    Copy,
    Download,
    EllipsisVertical,
    Info,
    Pencil,
    Plus,
    Trash2,
    Utensils,
    Weight,
    CircleDollarSign,
} from "lucide-react";

import cardapioService from "../../services/cardapioService";
import itemcardapioService from "../../services/itemcardapioService";
import refeicaoService from "../../services/refeicaoService";

import "./cardapio.css";

const diasSemana = [
    {
        chave: "segunda",
        nome: "SEGUNDA",
        numero: "01",
    },
    {
        chave: "terca",
        nome: "TERÇA",
        numero: "02",
    },
    {
        chave: "quarta",
        nome: "QUARTA",
        numero: "03",
    },
    {
        chave: "quinta",
        nome: "QUINTA",
        numero: "04",
    },
    {
        chave: "sexta",
        nome: "SEXTA",
        numero: "05",
    },
    {
        chave: "sabado",
        nome: "SÁBADO",
        numero: "06",
    },
    {
        chave: "domingo",
        nome: "DOMINGO",
        numero: "07",
    },
];

function normalizarDia(dia) {
    if (!dia) return "";

    return dia
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function formatarNumero(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function Cardapio() {
    const navigate = useNavigate();

    const [cardapios, setCardapios] = useState([]);
    const [refeicoes, setRefeicoes] = useState([]);
    const [itens, setItens] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [cardapioSelecionado, setCardapioSelecionado] = useState(null);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            setErro("");

            const [cardapiosApi, refeicoesApi, itensApi] =
                await Promise.all([
                    cardapioService.listar(),
                    refeicaoService.listar(),
                    itemcardapioService.listar(),
                ]);

            setCardapios(cardapiosApi || []);
            setRefeicoes(refeicoesApi || []);
            setItens(itensApi || []);

            const ativo =
                (cardapiosApi || []).find((cardapio) => cardapio.ativo) ||
                (cardapiosApi || [])[0] ||
                null;

            setCardapioSelecionado(ativo);
        } catch (error) {
            console.error(error);
            setErro("Não foi possível carregar o cardápio.");
        } finally {
            setCarregando(false);
        }
    };

    const itensDoCardapio = useMemo(() => {
        if (!cardapioSelecionado) {
            return itens;
        }

        return itens.filter(
            (item) => item.idCardapio === cardapioSelecionado.idCardapio
        );
    }, [itens, cardapioSelecionado]);

    const refeicoesPorDia = useMemo(() => {
        const resultado = {};

        diasSemana.forEach((dia) => {
            resultado[dia.chave] = [];
        });

        itensDoCardapio.forEach((item) => {
            const dia = normalizarDia(item.diaDaSemana);

            if (!resultado[dia]) {
                return;
            }

            const refeicao = refeicoes.find(
                (itemRefeicao) =>
                    itemRefeicao.idRefeicao === item.idRefeicao
            );

            resultado[dia].push({
                ...item,
                refeicao,
            });
        });

        return resultado;
    }, [itensDoCardapio, refeicoes]);

    const consumoPrevisto = useMemo(() => {
        return itensDoCardapio.reduce(
            (total, item) => total + Number(item.quantidadePrevista || 0),
            0
        );
    }, [itensDoCardapio]);

    const totalRefeicoes = itensDoCardapio.length;

    const pratosDiferentes = new Set(
        itensDoCardapio.map((item) => item.idRefeicao)
    ).size;

    const custoPrevisto = 0;

    const obterNomeRefeicao = (item) => {
        if (item.refeicao?.nome) {
            return item.refeicao.nome;
        }

        const refeicao = refeicoes.find(
            (itemRefeicao) =>
                itemRefeicao.idRefeicao === item.idRefeicao
        );

        return refeicao?.nome || "Refeição";
    };

    const obterDescricao = (item) => {
        if (item.refeicao?.descricao) {
            return item.refeicao.descricao;
        }

        return "Descrição da refeição não informada.";
    };

    const obterPeriodo = (item) => {
        if (!item.periodo) {
            return "Refeição";
        }

        const periodo = item.periodo.toLowerCase();

        if (periodo === "almoco" || periodo === "almoço") {
            return "Almoço";
        }

        if (periodo === "jantar") {
            return "Jantar";
        }

        if (periodo === "ambos") {
            return "Almoço / Jantar";
        }

        return item.periodo;
    };

    const formatarSemana = () => {
        const hoje = new Date();

        const diaSemana = hoje.getDay();
        const diferencaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;

        const segunda = new Date(hoje);
        segunda.setDate(hoje.getDate() + diferencaSegunda);

        const domingo = new Date(segunda);
        domingo.setDate(segunda.getDate() + 6);

        const formatarData = (data) =>
            data.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });

        return `${formatarData(segunda)} - ${formatarData(domingo)}`;
    };

    const novoCardapio = () => {
        alert(
            "A criação de novos cardápios será conectada ao backend na próxima etapa."
        );
    };

    const copiarSemanaAnterior = () => {
        alert(
            "A função de copiar a semana anterior será conectada ao backend na próxima etapa."
        );
    };

    const exportarCardapio = () => {
        window.print();
    };

    const editarRefeicao = () => {
        navigate("/cardapio/refeicoes");
    };

    const excluirRefeicao = () => {
        navigate("/cardapio/refeicoes");
    };

    if (carregando) {
        return (
            <div className="cardapio-loading">
                <div className="cardapio-spinner"></div>
                <p>Carregando cardápio...</p>
            </div>
        );
    }

    return (
        <div className="cardapio-page">
            <header className="cardapio-header">
                <div>
                    <h1>Cardápio Semanal</h1>
                    <p>
                        Cadastre e gerencie o cardápio do restaurante e o
                        consumo previsto por dia da semana.
                    </p>
                </div>

                <button
                    className="btn-cardapio-primary"
                    onClick={novoCardapio}
                >
                    <Plus size={21} />
                    Novo Cardápio
                </button>
            </header>

            {erro && (
                <div className="cardapio-error">
                    {erro}
                </div>
            )}

            <section className="cardapio-top-area">
                <div className="cardapio-week-card">
                    <div className="cardapio-week-icon">
                        <CalendarDays size={25} />
                    </div>

                    <div>
                        <span>SEMANA</span>
                        <strong>{formatarSemana()}</strong>
                    </div>

                    <span className="cardapio-week-arrow">⌄</span>
                </div>

                <div className="cardapio-summary-card">
                    <div>
                        <span>CONSUMO PREVISTO NA SEMANA</span>
                        <strong>
                            {formatarNumero(consumoPrevisto)} kg
                        </strong>
                    </div>

                    <Weight
                        className="cardapio-summary-icon"
                        size={31}
                    />
                </div>

                <div className="cardapio-summary-card">
                    <div>
                        <span>CUSTO PREVISTO NA SEMANA</span>
                        <strong>
                            R$ {formatarNumero(custoPrevisto)}
                        </strong>
                    </div>

                    <CircleDollarSign
                        className="cardapio-summary-icon"
                        size={32}
                    />
                </div>

                <div className="cardapio-top-actions">
                    <button onClick={copiarSemanaAnterior}>
                        <Copy size={21} />
                        Copiar Semana Anterior
                    </button>

                    <button onClick={exportarCardapio}>
                        <Download size={21} />
                        Exportar Cardápio
                    </button>
                </div>
            </section>

            <div className="cardapio-tabs">
                <button className="cardapio-tab active">
                    Visualização Semanal
                </button>

                <button className="cardapio-tab">
                    Consumo por Ingrediente
                </button>

                <button className="cardapio-tab">
                    Histórico de Cardápios
                </button>
            </div>

            <section className="cardapio-week-grid">
                {diasSemana.map((dia) => {
                    const refeicoesDoDia =
                        refeicoesPorDia[dia.chave] || [];

                    return (
                        <div
                            className="cardapio-day-column"
                            key={dia.chave}
                        >
                            <div className="cardapio-day-header">
                                <div>
                                    <strong>{dia.nome}</strong>
                                    <span>{dia.numero}/06</span>
                                </div>

                                <button>
                                    <EllipsisVertical size={19} />
                                </button>
                            </div>

                            <div className="cardapio-day-content">
                                {refeicoesDoDia.length === 0 ? (
                                    <div className="cardapio-empty-day">
                                        <Utensils size={23} />
                                        <span>
                                            Nenhuma refeição
                                        </span>
                                    </div>
                                ) : (
                                    refeicoesDoDia.map((item) => (
                                        <div
                                            className="cardapio-meal"
                                            key={item.idItemCardapio}
                                        >
                                            <div className="cardapio-meal-period">
                                                {obterPeriodo(item)}
                                            </div>

                                            <div className="cardapio-meal-name">
                                                {obterNomeRefeicao(item)}
                                            </div>

                                            <div className="cardapio-meal-description">
                                                {obterDescricao(item)}
                                            </div>

                                            <div className="cardapio-meal-consumption">
                                                Consumo:{" "}
                                                {formatarNumero(
                                                    item.quantidadePrevista
                                                )}{" "}
                                                kg
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </section>

            <section className="cardapio-bottom-grid">
                <div>
                    <div className="cardapio-resume-card">
                        <div className="cardapio-section-title">
                            <h2>Resumo do Cardápio</h2>
                        </div>

                        <div className="cardapio-resume-items">
                            <div className="cardapio-resume-item">
                                <div className="cardapio-resume-icon">
                                    <Utensils size={25} />
                                </div>

                                <div>
                                    <span>Total de Refeições</span>
                                    <strong>{totalRefeicoes}</strong>
                                </div>
                            </div>

                            <div className="cardapio-resume-item">
                                <div className="cardapio-resume-icon">
                                    <Utensils size={25} />
                                </div>

                                <div>
                                    <span>Pratos Diferentes</span>
                                    <strong>{pratosDiferentes}</strong>
                                </div>
                            </div>

                            <div className="cardapio-resume-item">
                                <div className="cardapio-resume-icon">
                                    <Weight size={25} />
                                </div>

                                <div>
                                    <span>Consumo Previsto</span>
                                    <strong>
                                        {formatarNumero(
                                            consumoPrevisto
                                        )}{" "}
                                        kg
                                    </strong>
                                </div>
                            </div>

                            <div className="cardapio-resume-item">
                                <div className="cardapio-resume-icon red">
                                    <CircleDollarSign size={25} />
                                </div>

                                <div>
                                    <span>Custo Previsto</span>
                                    <strong>
                                        R$ {formatarNumero(custoPrevisto)}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="cardapio-info-card">
                        <div className="cardapio-info-icon">
                            <Info size={23} />
                        </div>

                        <div>
                            <strong>Como funciona</strong>

                            <p>
                                Cadastre as refeições de cada dia da semana
                                e o sistema calculará automaticamente o
                                consumo previsto dos ingredientes com base
                                nas receitas cadastradas.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="cardapio-quick-card">
                    <h2>Ações Rápidas</h2>

                    <button
                        onClick={() =>
                            navigate("/cardapio/refeicoes/nova")
                        }
                    >
                        <Plus size={21} />
                        Adicionar Refeição
                    </button>

                    <button onClick={editarRefeicao}>
                        <Pencil size={20} />
                        Editar Refeição
                    </button>

                    <button
                        className="danger"
                        onClick={excluirRefeicao}
                    >
                        <Trash2 size={20} />
                        Excluir Refeição
                    </button>
                </div>
            </section>
        </div>
    );
}

export default Cardapio;