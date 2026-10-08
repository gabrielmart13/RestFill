import api from "./api";

const movimentacaoService = {
    listar: async () => {
        const response = await api.get("/Movimentacao");
        return response.data;
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/Movimentacao/${id}`);
        return response.data;
    },

    criar: async (movimentacao) => {
        const response = await api.post("/Movimentacao", movimentacao);
        return response.data;
    },
};

export default movimentacaoService;