import { useEffect, useMemo, useState } from "react";

import {
    AlertTriangle,
    ArrowRight,
    Bell,
    CalendarDays,
    ChevronRight,
    Package,
    Search,
    Tag,
    WalletCards,
} from "lucide-react";

import produtoService from "../../services/produtoService";
import categoriaService from "../../services/categoriaService";
import unidadeMedidaService from "../../services/unidadeMedidaService";

import StatCard from "../../components/ui/StatCard";

import "./dashboard.css";

function Dashboard() {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);

    const [busca, setBusca] = useState("");

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setCarregando(true);
                setErro("");

                const [produtosData, categoriasData, unidadesData] =
                    await Promise.all([
                        produtoService.listar(),
                        categoriaService.listar(),
                        unidadeMedidaService.listar(),
                    ]);

                setProdutos(produtosData);
                setCategorias(categoriasData);
                setUnidades(unidadesData);
            } catch (error) {
                console.error(error);
                setErro("Não foi possível carregar os dados do dashboard.");
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, []);

    const categoriaPorId = useMemo(() => {
        return Object.fromEntries(
            categorias.map((categoria) => [
                categoria.idCategoria,
                categoria,
            ])
        );
    }, [categorias]);

    const unidadePorId = useMemo(() => {
        return Object.fromEntries(
            unidades.map((unidade) => [
                unidade.idUnidadeMedida,
                unidade,
            ])
        );
    }, [unidades]);

    const estoqueBaixo = useMemo(() => {
        return produtos.filter(
            (produto) =>
                Number(produto.quantidade) <=
                Number(produto.quantidadeMinima)
        );
    }, [produtos]);

    const validadeProxima = useMemo(() => {
        const agora = new Date();

        agora.setHours(0, 0, 0, 0);

        const limite = new Date(agora);
        limite.setDate(limite.getDate() + 7);

        return produtos.filter((produto) => {
            const validade = new Date(produto.validade);

            validade.setHours(0, 0, 0, 0);

            return validade >= agora && validade <= limite;
        });
    }, [produtos]);

    const produtosVencendo = useMemo(() => {
        const agora = new Date();

        agora.setHours(0, 0, 0, 0);

        return produtos
            .filter((produto) => {
                const validade = new Date(produto.validade);
                validade.setHours(0, 0, 0, 0);

                return validade >= agora;
            })
            .sort(
                (a, b) =>
                    new Date(a.validade) -
                    new Date(b.validade)
            );
    }, [produtos]);

    const valorEstoque = useMemo(() => {
        return produtos.reduce(
            (total, produto) =>
                total +
                Number(produto.quantidade) *
                Number(produto.custoPorKg),
            0
        );
    }, [produtos]);

    const produtosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        if (!termo) {
            return produtos.slice(0, 8);
        }

        return produtos
            .filter((produto) =>
                produto.nome.toLowerCase().includes(termo)
            )
            .slice(0, 8);
    }, [produtos, busca]);

    const formatarMoeda = (valor) => {
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const formatarData = (data) => {
        return new Date(data).toLocaleDateString("pt-BR");
    };

    const formatarQuantidade = (quantidade) => {
        return Number(quantidade).toLocaleString("pt-BR", {
            maximumFractionDigits: 2,
        });
    };

    const obterStatus = (produto) => {
        const quantidade = Number(produto.quantidade);
        const minima = Number(produto.quantidadeMinima);

        if (quantidade <= minima) {
            return {
                texto: "ATENÇÃO",
                classe: "status-atencao",
            };
        }

        return {
            texto: "OK",
            classe: "status-ok",
        };
    };

    const hoje = new Date();

    return (
        <div className="dashboard-page">

            {/* CABEÇALHO */}
            <header className="dashboard-header">

                <div className="dashboard-welcome">
                    <h1>Bem-vindo, Gerente!</h1>

                    <p>
                        Aqui está o resumo do seu estoque hoje.
                    </p>
                </div>

                <div className="restaurant-info">
                    <span>Restaurante</span>

                    <strong>Sabor Caseiro</strong>
                </div>

                <div className="dashboard-date">
                    <CalendarDays size={21} />

                    <div>
                        <strong>
                            {hoje.toLocaleDateString("pt-BR")}
                        </strong>

                        <span>
                            {hoje.toLocaleDateString("pt-BR", {
                                weekday: "long",
                            })}
                        </span>
                    </div>
                </div>

                <button
                    className="notification-button"
                    title="Notificações"
                >
                    <Bell size={22} />

                    {(estoqueBaixo.length +
                        validadeProxima.length) >
                        0 && (
                            <span>
                                {estoqueBaixo.length +
                                    validadeProxima.length}
                            </span>
                        )}
                </button>
            </header>

            {/* ERRO */}
            {erro && (
                <div className="dashboard-error">
                    <AlertTriangle size={19} />

                    <span>{erro}</span>
                </div>
            )}

            {/* INDICADORES */}
            <section className="stats-grid">

                <StatCard
                    icon={Package}
                    value={produtos.length}
                    title="Produtos em Estoque"
                    description="Total cadastrados"
                />

                <StatCard
                    icon={AlertTriangle}
                    value={estoqueBaixo.length}
                    title="Itens com Estoque Baixo"
                    description="Requer atenção"
                />

                <StatCard
                    icon={CalendarDays}
                    value={validadeProxima.length}
                    title="Validades Próximas"
                    description="Até 7 dias"
                />

                <StatCard
                    icon={WalletCards}
                    value={formatarMoeda(valorEstoque)}
                    title="Valor Total do Estoque"
                    description="Custo atual"
                />

            </section>

            {/* CONTEÚDO PRINCIPAL */}
            <section className="dashboard-main-grid">

                {/* ESTOQUE */}
                <div className="stock-card">

                    <div className="card-heading">

                        <div>
                            <h2>Estoque - Visão Geral</h2>

                            <p>
                                Acompanhe os produtos cadastrados no estoque.
                            </p>
                        </div>

                        <button
                            className="text-action"
                            onClick={() => {
                                window.location.href = "/produtos";
                            }}
                        >
                            Ver todos
                            <ArrowRight size={17} />
                        </button>

                    </div>

                    {/* FILTROS */}
                    <div className="stock-toolbar">

                        <div className="search-box">

                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Buscar produto..."
                                value={busca}
                                onChange={(event) =>
                                    setBusca(event.target.value)
                                }
                            />

                        </div>

                        <button
                            className="filter-button"
                            onClick={() => setBusca("")}
                        >
                            Todas as categorias
                        </button>

                        <button
                            className="view-all-button"
                            onClick={() => {
                                window.location.href = "/produtos";
                            }}
                        >
                            Ver todos
                        </button>

                    </div>

                    {/* TABELA */}
                    {carregando ? (
                        <div className="dashboard-loading">
                            Carregando estoque...
                        </div>
                    ) : produtosFiltrados.length === 0 ? (
                        <div className="dashboard-empty">
                            Nenhum produto encontrado.
                        </div>
                    ) : (
                        <div className="stock-table">

                            <div className="stock-table-header">
                                <span>Produto</span>
                                <span>Categoria</span>
                                <span>Quantidade</span>
                                <span>Unidade</span>
                                <span>Validade</span>
                                <span>Status</span>
                            </div>

                            {produtosFiltrados.map((produto) => {
                                const status =
                                    obterStatus(produto);

                                const categoria =
                                    categoriaPorId[
                                    produto.idCategoria
                                    ];

                                const unidade =
                                    unidadePorId[
                                    produto.idUnidadeMedida
                                    ];

                                return (
                                    <div
                                        className="stock-table-row"
                                        key={produto.idProduto}
                                    >

                                        <div className="product-name">
                                            <div className="product-icon">
                                                <Package size={17} />
                                            </div>

                                            <strong>
                                                {produto.nome}
                                            </strong>
                                        </div>

                                        <span>
                                            {categoria?.nome ||
                                                `Categoria ${produto.idCategoria}`}
                                        </span>

                                        <span>
                                            {formatarQuantidade(
                                                produto.quantidade
                                            )}
                                        </span>

                                        <span>
                                            {unidade?.nome ||
                                                `Unidade ${produto.idUnidadeMedida}`}
                                        </span>

                                        <span>
                                            {formatarData(
                                                produto.validade
                                            )}
                                        </span>

                                        <span
                                            className={`status-badge ${status.classe}`}
                                        >
                                            {status.texto}
                                        </span>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                    <button
                        className="bottom-action"
                        onClick={() => {
                            window.location.href = "/produtos";
                        }}
                    >
                        Ver todos os produtos
                        <ArrowRight size={17} />
                    </button>

                </div>

                {/* COLUNA DIREITA */}
                <div className="dashboard-side">

                    {/* RESUMO */}
                    <div className="quick-card">

                        <div className="card-heading">
                            <div>
                                <h2>Resumo Rápido</h2>
                            </div>
                        </div>

                        <div className="quick-grid">

                            <div className="quick-item">
                                <div className="quick-icon">
                                    <Tag size={19} />
                                </div>

                                <div>
                                    <span>
                                        Categorias Cadastradas
                                    </span>

                                    <strong>
                                        {categorias.length}
                                    </strong>
                                </div>

                                <ChevronRight size={18} />
                            </div>

                            <div className="quick-item">
                                <div className="quick-icon">
                                    <Package size={19} />
                                </div>

                                <div>
                                    <span>
                                        Produtos Cadastrados
                                    </span>

                                    <strong>
                                        {produtos.length}
                                    </strong>
                                </div>

                                <ChevronRight size={18} />
                            </div>

                        </div>

                    </div>

                    {/* VALIDADE */}
                    <div className="expiry-card">

                        <div className="card-heading">

                            <div>
                                <h2>Validades Próximas</h2>

                                <p>
                                    Produtos que precisam de atenção.
                                </p>
                            </div>

                            <span className="danger-count">
                                {validadeProxima.length}
                            </span>

                        </div>

                        <div className="expiry-list">

                            {validadeProxima.length === 0 ? (
                                <div className="no-alert">
                                    Nenhuma validade próxima.
                                </div>
                            ) : (
                                validadeProxima
                                    .slice(0, 4)
                                    .map((produto) => (
                                        <div
                                            className="expiry-item"
                                            key={produto.idProduto}
                                        >
                                            <div>
                                                <strong>
                                                    {produto.nome}
                                                </strong>

                                                <span>
                                                    Validade:{" "}
                                                    {formatarData(
                                                        produto.validade
                                                    )}
                                                </span>
                                            </div>

                                            <AlertTriangle
                                                size={19}
                                            />
                                        </div>
                                    ))
                            )}

                        </div>

                    </div>

                    {/* ESTOQUE BAIXO */}
                    <div className="alerts-card">

                        <div className="card-heading">

                            <div>
                                <h2>Alertas Recentes</h2>

                                <p>
                                    Situação atual do estoque.
                                </p>
                            </div>

                        </div>

                        <div className="alerts-list">

                            {estoqueBaixo.length === 0 ? (
                                <div className="no-alert">
                                    Nenhum produto com estoque baixo.
                                </div>
                            ) : (
                                estoqueBaixo
                                    .slice(0, 4)
                                    .map((produto) => (
                                        <div
                                            className="alert-item"
                                            key={produto.idProduto}
                                        >
                                            <div className="alert-icon">
                                                <AlertTriangle
                                                    size={17}
                                                />
                                            </div>

                                            <div>
                                                <strong>
                                                    {produto.nome}
                                                </strong>

                                                <span>
                                                    Estoque atual:{" "}
                                                    {formatarQuantidade(
                                                        produto.quantidade
                                                    )}
                                                    {" | "}
                                                    Mínimo:{" "}
                                                    {formatarQuantidade(
                                                        produto.quantidadeMinima
                                                    )}
                                                </span>
                                            </div>

                                            <ChevronRight
                                                size={17}
                                            />
                                        </div>
                                    ))
                            )}

                        </div>

                    </div>

                </div>

            </section>

            {/* RESUMO FINANCEIRO */}
            <section className="financial-card">

                <div className="financial-header">

                    <div>
                        <h2>Resumo do Estoque</h2>

                        <p>
                            Valor calculado com base na quantidade atual
                            e no custo cadastrado dos produtos.
                        </p>
                    </div>

                    <WalletCards size={28} />

                </div>

                <div className="financial-values">

                    <div>
                        <span>Valor total</span>

                        <strong>
                            {formatarMoeda(valorEstoque)}
                        </strong>
                    </div>

                    <div>
                        <span>Produtos</span>

                        <strong>
                            {produtos.length}
                        </strong>
                    </div>

                    <div>
                        <span>Estoque baixo</span>

                        <strong>
                            {estoqueBaixo.length}
                        </strong>
                    </div>

                    <div>
                        <span>Validade próxima</span>

                        <strong>
                            {validadeProxima.length}
                        </strong>
                    </div>

                </div>

            </section>

            {/* RODAPÉ */}
            <footer className="dashboard-footer">
                © 2025{" "}
                <strong>RESTFILL</strong>{" "}
                — Todos os direitos reservados.
            </footer>

        </div>
    );
}

export default Dashboard;