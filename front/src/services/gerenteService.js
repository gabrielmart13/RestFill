import api from "./api";

const gerenteService = {
    listar: async () => {
        const response = await api.get("/Gerente");
        return response.data;
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/Gerente/${id}`);
        return response.data;
    },

    criar: async (gerente) => {
        const response = await api.post("/Gerente", gerente);
        return response.data;
    },

    atualizar: async (id, gerente) => {
        const response = await api.put(`/Gerente/${id}`, gerente);
        return response.data;
    },

    excluir: async (id) => {
        const response = await api.delete(`/Gerente/${id}`);
        return response.data;
    },
};

export default gerenteService;