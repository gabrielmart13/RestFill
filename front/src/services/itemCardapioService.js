import api from "./api";

const itemCardapioService = {
    listar: async () => {
        const response = await api.get("/ItemCardapio");
        return response.data;
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/ItemCardapio/${id}`);
        return response.data;
    },

    criar: async (item) => {
        const response = await api.post("/ItemCardapio", item);
        return response.data;
    },

    atualizar: async (id, item) => {
        const response = await api.put(`/ItemCardapio/${id}`, item);
        return response.data;
    },

    excluir: async (id) => {
        const response = await api.delete(`/ItemCardapio/${id}`);
        return response.data;
    },
};

export default itemCardapioService;