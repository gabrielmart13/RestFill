import api from "./api";

const categoriaService = {
    listar: async () => {
        const response = await api.get("/Categoria");
        return response.data;
    },

    buscarPorId: async (id) => {
        const response = await api.get(`/Categoria/${id}`);
        return response.data;
    },

    criar: async (categoria) => {
        const response = await api.post("/Categoria", categoria);
        return response.data;
    },

    atualizar: async (id, categoria) => {
        const response = await api.put(`/Categoria/${id}`, categoria);
        return response.data;
    },

    excluir: async (id) => {
        const response = await api.delete(`/Categoria/${id}`);
        return response.data;
    },
};

export default categoriaService;