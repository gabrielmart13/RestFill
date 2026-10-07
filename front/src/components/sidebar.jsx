import {
    LayoutDashboard,
    Package,
    Folder,
    CalendarDays,
    ChartNoAxesColumnIncreasing,
    ArrowLeftRight,
    Bell,
    Settings,
    LogOut,
    ChefHat,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import "./sidebar.css";

function Sidebar() {
    const navigate = useNavigate();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Produtos",
            path: "/produtos",
            icon: Package,
        },
        {
            name: "Categorias",
            path: "/categorias",
            icon: Folder,
        },
        {
            name: "Cardápio",
            path: "/cardapio",
            icon: CalendarDays,
        },
        {
            name: "Previsões e Gastos",
            path: "/gastos-produtos",
            icon: ChartNoAxesColumnIncreasing,
        },
        {
            name: "Movimentações",
            path: "/movimentacoes",
            icon: ArrowLeftRight,
        },
    ];

    const sair = () => {
        navigate("/login");
    };

    return (
        <aside className="sidebar">

            <div className="sidebar-top">

                <div className="sidebar-logo">

                    <ChefHat size={38} />

                    <div>

                        <div className="sidebar-logo-text">
                            REST<span>FILL</span>
                        </div>

                        <div className="sidebar-subtitle">
                            Gestão Inteligente de Estoque
                        </div>

                    </div>

                </div>

                <nav className="sidebar-menu">

                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive
                                        ? "sidebar-link-active"
                                        : ""
                                    }`
                                }
                            >

                                <Icon size={22} />

                                <span>
                                    {item.name}
                                </span>

                            </NavLink>
                        );

                    })}

                </nav>

            </div>

            <div className="sidebar-bottom">

                <button
                    className="sidebar-logout"
                    onClick={sair}
                >

                    <LogOut size={22} />

                    <span>
                        Sair
                    </span>

                </button>

                <div className="sidebar-user">

                    <div className="sidebar-avatar">
                        G
                    </div>

                    <div className="sidebar-user-info">

                        <strong>
                            Gerente
                        </strong>

                        <span>
                            Administrador
                        </span>

                    </div>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;