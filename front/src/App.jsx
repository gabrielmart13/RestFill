import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useParams,
} from "react-router-dom";

import GastosProdutos from "./pages/gastos/gastosprodutos";

import Login from "./pages/login/login";
import Dashboard from "./pages/dashboards/dashboard";

import Produtos from "./pages/produtos/Produtos";
import ProdutoForm from "./pages/produtos/ProdutoForm";

import Categorias from "./pages/categorias/categorias";
import CategoriaForm from "./pages/categorias/categoriaform";

import Cardapio from "./pages/cardapio/cardapio";
import Refeicoes from "./pages/cardapio/refeicoes";

import Layout from "./components/layout/layout";


function ProdutoFormWrapper() {
    const { id } = useParams();

    return (
        <ProdutoForm
            modo="editar"
            id={id}
        />
    );
}


function CategoriaFormWrapper() {
    const { id } = useParams();

    return (
        <CategoriaForm
            modo="editar"
            id={id}
        />
    );
}


function App() {
    return (
        <BrowserRouter>
            <Routes>



                {/* LOGIN */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* REDIRECIONAMENTO INICIAL */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />


                {/* SISTEMA */}

                <Route element={<Layout />}>

                    {/* DASHBOARD */}

                    <Route
                        path="/gastos-produtos"
                        element={<GastosProdutos />}
                    />
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />


                    {/* PRODUTOS */}

                    <Route
                        path="/produtos"
                        element={<Produtos />}
                    />

                    <Route
                        path="/produtos/novo"
                        element={
                            <ProdutoForm
                                modo="criar"
                            />
                        }
                    />

                    <Route
                        path="/produtos/editar/:id"
                        element={
                            <ProdutoFormWrapper />
                        }
                    />


                    {/* CATEGORIAS */}

                    <Route
                        path="/categorias"
                        element={<Categorias />}
                    />

                    <Route
                        path="/categorias/nova"
                        element={
                            <CategoriaForm
                                modo="criar"
                            />
                        }
                    />

                    <Route
                        path="/categorias/editar/:id"
                        element={
                            <CategoriaFormWrapper />
                        }
                    />


                    {/* CARDÁPIO */}

                    <Route
                        path="/cardapio"
                        element={<Cardapio />}
                    />

                    <Route
                        path="/cardapio/refeicoes"
                        element={<Refeicoes />}
                    />

                    <Route
                        path="/cardapio/refeicoes/nova"
                        element={<Refeicoes />}
                    />

                    <Route
                        path="/cardapio/refeicoes/editar/:id"
                        element={<Refeicoes />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}


export default App;