import api from "./api";

const produtoService = {
    listar: async () => {
        const response = await api.get("/Produto");
        return response.data;
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/Produto/${id}`);
        return response.data;
    },

    criar: async (produto) => {
        const response = await api.post("/Produto", produto);
        return response.data;
    },

    atualizar: async (id, produto) => {
        const response = await api.put(`/Produto/${id}`, produto);
        return response.data;
    },

    excluir: async (id) => {
        const response = await api.delete(`/Produto/${id}`);
        return response.data;
    },
};

export default produtoService;