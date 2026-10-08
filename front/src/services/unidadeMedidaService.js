import api from "./api";

const unidadeMedidaService = {
    listar: async () => {
        const response = await api.get("/UnidadeMedida");
        return response.data;
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/UnidadeMedida/${id}`);
        return response.data;
    },
};

export default unidadeMedidaService;