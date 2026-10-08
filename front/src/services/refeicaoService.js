import api from "./api";

const refeicaoService = {
    listar: async () => {
        const response = await api.get("/Refeicao");
        return response.data;
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/Refeicao/${id}`);
        return response.data;
    },

    criar: async (refeicao) => {
        const response = await api.post("/Refeicao", refeicao);
        return response.data;
    },

    atualizar: async (id, refeicao) => {
        const response = await api.put(`/Refeicao/${id}`, refeicao);
        return response.data;
    },

    excluir: async (id) => {
        const response = await api.delete(`/Refeicao/${id}`);
        return response.data;
    },
};

export default refeicaoService;