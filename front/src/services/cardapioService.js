import api from "./api";

const cardapioService = {
    listar: async () => {
        const response = await api.get("/Cardapio");
        return response.data;
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/Cardapio/${id}`);
        return response.data;
    },

    atualizar: async (id, cardapio) => {
        const response = await api.put(`/Cardapio/${id}`, cardapio);
        return response.data;
    },
};

export default cardapioService;