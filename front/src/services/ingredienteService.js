import api from "./api";

const ingredienteService = {
    listar: async () => {
        const response = await api.get("/Ingrediente");
        return response.data;
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/Ingrediente/${id}`);
        return response.data;
    },

    criar: async (ingrediente) => {
        const response = await api.post("/Ingrediente", ingrediente);
        return response.data;
    },

    atualizar: async (id, ingrediente) => {
        const response = await api.put(`/Ingrediente/${id}`, ingrediente);
        return response.data;
    },

    excluir: async (id) => {
        const response = await api.delete(`/Ingrediente/${id}`);
        return response.data;
    },
};

export default ingredienteService;