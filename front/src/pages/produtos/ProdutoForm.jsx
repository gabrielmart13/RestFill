import { useEffect, useState } from "react";

import {
    ArrowLeft,
    CalendarDays,
    ImagePlus,
    Save,
    Trash2,
} from "lucide-react";

import produtoService from "../../services/produtoService";
import categoriaService from "../../services/categoriaService";
import unidadeMedidaService from "../../services/unidadeMedidaService";

import "./produtoForm.css";

function ProdutoForm({ modo = "criar", id }) {
    const editando = modo === "editar";

    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);

    const [imagemPreview, setImagemPreview] =
        useState("");

    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        custoPorKg: "",
        validade: "",
        quantidade: "",
        quantidadeMinima: "",
        idCategoria: "",
        idUnidadeMedida: "",
    });

    const [carregando, setCarregando] =
        useState(editando);

    const [salvando, setSalvando] =
        useState(false);

    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarDados();
    }, [id]);

    const carregarDados = async () => {
        try {
            setErro("");

            const [
                categoriasData,
                unidadesData,
            ] = await Promise.all([
                categoriaService.listar(),
                unidadeMedidaService.listar(),
            ]);

            setCategorias(categoriasData);
            setUnidades(unidadesData);

            if (editando) {
                const produto =
                    await produtoService.buscarPorId(
                        id
                    );

                setForm({
                    nome: produto.nome || "",
                    descricao:
                        produto.descricao || "",
                    custoPorKg:
                        produto.custoPorKg ?? "",
                    validade: produto.validade
                        ? produto.validade.substring(
                            0,
                            10
                        )
                        : "",
                    quantidade:
                        produto.quantidade ?? "",
                    quantidadeMinima:
                        produto.quantidadeMinima ??
                        "",
                    idCategoria:
                        produto.idCategoria ?? "",
                    idUnidadeMedida:
                        produto.idUnidadeMedida ??
                        "",
                });
            }
        } catch (error) {
            console.error(error);

            setErro(
                error?.response?.data?.message ||
                "Não foi possível carregar os dados."
            );
        } finally {
            setCarregando(false);
        }
    };

    const alterarCampo = (campo, valor) => {
        setForm((atual) => ({
            ...atual,
            [campo]: valor,
        }));
    };

    const selecionarImagem = (event) => {
        const arquivo =
            event.target.files?.[0];

        if (!arquivo) return;

        const url =
            URL.createObjectURL(arquivo);

        setImagemPreview(url);
    };

    const voltar = () => {
        window.location.href = "/produtos";
    };

    const salvar = async (event) => {
        event.preventDefault();

        try {
            setSalvando(true);
            setErro("");

            if (!form.nome.trim()) {
                setErro(
                    "Informe o nome do produto."
                );
                return;
            }

            if (!form.idCategoria) {
                setErro(
                    "Selecione uma categoria."
                );
                return;
            }

            if (!form.idUnidadeMedida) {
                setErro(
                    "Selecione uma unidade de medida."
                );
                return;
            }

            if (!form.validade) {
                setErro(
                    "Informe a validade."
                );
                return;
            }

            if (
                Number(form.custoPorKg) < 0 ||
                Number(form.quantidade) < 0 ||
                Number(
                    form.quantidadeMinima
                ) < 0
            ) {
                setErro(
                    "Os valores numéricos não podem ser negativos."
                );
                return;
            }

            if (editando) {
                const dados = {
                    nome: form.nome.trim(),
                    descricao:
                        form.descricao.trim() ||
                        null,
                    custoPorKg:
                        Number(form.custoPorKg),
                    validade: form.validade,
                    quantidadeMinima:
                        Number(
                            form.quantidadeMinima
                        ),
                    idCategoria:
                        Number(form.idCategoria),
                    idUnidadeMedida:
                        Number(
                            form.idUnidadeMedida
                        ),
                };

                await produtoService.atualizar(
                    id,
                    dados
                );
            } else {
                const dados = {
                    nome: form.nome.trim(),
                    descricao:
                        form.descricao.trim() ||
                        null,
                    custoPorKg:
                        Number(form.custoPorKg),
                    validade: form.validade,
                    quantidade:
                        Number(form.quantidade),
                    quantidadeMinima:
                        Number(
                            form.quantidadeMinima
                        ),
                    idCategoria:
                        Number(form.idCategoria),
                    idUnidadeMedida:
                        Number(
                            form.idUnidadeMedida
                        ),
                };

                await produtoService.criar(
                    dados
                );
            }

            voltar();
        } catch (error) {
            console.error(error);

            setErro(
                error?.response?.data?.message ||
                "Não foi possível salvar o produto."
            );
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) {
        return (
            <div className="produto-form-loading">
                Carregando produto...
            </div>
        );
    }

    return (
        <div className="produto-form-page">

            <div className="produto-breadcrumb">
                Produtos
                <span>›</span>
                <strong>
                    {editando
                        ? "Editar Produto"
                        : "Novo Produto"}
                </strong>
            </div>

            <header className="produto-form-header">

                <div>
                    <h1>
                        {editando
                            ? "Editar Produto"
                            : "Novo Produto"}
                    </h1>

                    <p>
                        {editando
                            ? "Altere as informações do produto conforme necessário."
                            : "Preencha as informações para cadastrar um novo produto."}
                    </p>
                </div>

                <button
                    className="back-button"
                    onClick={voltar}
                >
                    <ArrowLeft size={16} />
                    Voltar para Produtos
                </button>

            </header>

            {erro && (
                <div className="produto-form-error">
                    {erro}
                </div>
            )}

            <form
                className="produto-form-grid"
                onSubmit={salvar}
            >

                {/* INFORMAÇÕES BÁSICAS */}

                <section className="form-section basic-section">

                    <h2>Informações Básicas</h2>

                    <div className="form-fields">

                        <div className="field field-name">
                            <label>
                                Nome do Produto
                                <span>*</span>
                            </label>

                            <input
                                type="text"
                                value={form.nome}
                                placeholder="Ex.: Arroz Branco"
                                onChange={(event) =>
                                    alterarCampo(
                                        "nome",
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="field">
                            <label>
                                Categoria
                                <span>*</span>
                            </label>

                            <select
                                value={
                                    form.idCategoria
                                }
                                onChange={(event) =>
                                    alterarCampo(
                                        "idCategoria",
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Selecione uma categoria
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
                                            {
                                                categoria.nome
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="field">
                            <label>
                                Unidade
                                <span>*</span>
                            </label>

                            <select
                                value={
                                    form.idUnidadeMedida
                                }
                                onChange={(event) =>
                                    alterarCampo(
                                        "idUnidadeMedida",
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Selecione
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
                                            {
                                                unidade.nome
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="field field-description">
                            <label>
                                Descrição{" "}
                                <small>
                                    (opcional)
                                </small>
                            </label>

                            <textarea
                                value={
                                    form.descricao
                                }
                                placeholder="Ex.: Arroz tipo 1, pacote 5kg"
                                onChange={(event) =>
                                    alterarCampo(
                                        "descricao",
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                    </div>

                </section>

                {/* IMAGEM */}

                <section className="form-section image-section">

                    <h2>Imagem do Produto</h2>

                    {imagemPreview ? (
                        <div className="image-preview">

                            <img
                                src={
                                    imagemPreview
                                }
                                alt="Pré-visualização"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setImagemPreview(
                                        ""
                                    )
                                }
                            >
                                <Trash2
                                    size={14}
                                />
                                Remover
                            </button>

                        </div>
                    ) : (
                        <label className="image-upload">

                            <ImagePlus
                                size={29}
                            />

                            <strong>
                                Clique para enviar
                            </strong>

                            <span>
                                ou arraste uma imagem
                            </span>

                            <small>
                                PNG, JPG ou WEBP
                                (máx. 2MB)
                            </small>

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={
                                    selecionarImagem
                                }
                            />

                        </label>
                    )}

                    <p className="image-warning">
                        A imagem é apenas uma
                        pré-visualização. O backend
                        ainda não possui armazenamento
                        de imagens.
                    </p>

                </section>

                {/* ESTOQUE */}

                <section className="form-section stock-section">

                    <h2>Estoque</h2>

                    <div className="form-fields stock-fields">

                        <div className="field">
                            <label>
                                Quantidade Atual
                                <span>*</span>
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                    form.quantidade
                                }
                                disabled={editando}
                                onChange={(event) =>
                                    alterarCampo(
                                        "quantidade",
                                        event.target.value
                                    )
                                }
                            />

                            {editando && (
                                <small className="field-hint">
                                    Para alterar o
                                    estoque, utilize
                                    uma movimentação.
                                </small>
                            )}
                        </div>

                        <div className="field">
                            <label>
                                Quantidade Mínima
                                <span>*</span>
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                    form.quantidadeMinima
                                }
                                onChange={(event) =>
                                    alterarCampo(
                                        "quantidadeMinima",
                                        event.target.value
                                    )
                                }
                            />

                            <small className="field-hint">
                                Quantidade mínima para
                                alerta de estoque baixo.
                            </small>
                        </div>

                        <div className="field">
                            <label>
                                Validade
                                <span>*</span>
                            </label>

                            <div className="date-input">
                                <input
                                    type="date"
                                    value={
                                        form.validade
                                    }
                                    onChange={(event) =>
                                        alterarCampo(
                                            "validade",
                                            event.target.value
                                        )
                                    }
                                />

                                <CalendarDays
                                    size={17}
                                />
                            </div>
                        </div>

                    </div>

                </section>

                {/* INFORMAÇÕES ADICIONAIS */}

                <section className="form-section additional-section">

                    <h2>
                        Informações Adicionais
                    </h2>

                    <div className="field">
                        <label>
                            Valor Unitário (R$)
                            <span>*</span>
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                                form.custoPorKg
                            }
                            placeholder="Ex.: 5,20"
                            onChange={(event) =>
                                alterarCampo(
                                    "custoPorKg",
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div className="field">
                        <label>
                            Fornecedor{" "}
                            <small>
                                (opcional)
                            </small>
                        </label>

                        <input
                            type="text"
                            placeholder="Ex.: Fornecedor ABC"
                        />
                    </div>

                </section>

                {/* AÇÕES */}

                <div className="form-actions">

                    <button
                        type="button"
                        className="form-cancel"
                        onClick={voltar}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="form-save"
                        disabled={salvando}
                    >
                        <Save size={17} />

                        {salvando
                            ? "Salvando..."
                            : editando
                                ? "Salvar Alterações"
                                : "Salvar Produto"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default ProdutoForm;