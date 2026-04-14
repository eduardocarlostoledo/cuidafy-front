import React, { useEffect, useMemo, useState } from "react";
import { RiArrowDownSLine, RiSettings3Line } from "react-icons/ri";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/features/authSlice";
import { ROLES } from "../helpers/Logic/roles";

const publicLinks = [
  { to: "/", label: "Inicio" },
  { to: "/encontrar-cuidado", label: "Encontrar cuidado" },
  { to: "/servicios", label: "Tipos de cuidado" },
];

const getPrimaryArea = (user) => {
  if (!user?.rol) return null;

  if (user.rol === ROLES.ADMIN) {
    return { to: "/dashboard/casos", label: "Inbox de casos" };
  }

  if (user.rol === ROLES.PROFESIONAL) {
    return { to: "/casos/profesional", label: "Casos activos" };
  }

  return { to: "/casos", label: "Mi seguimiento" };
};

const getAccountLinks = (user) => {
  if (!user?.rol) {
    return [];
  }

  const commonLinks = [
    {
      to: "/ajustes",
      label: "Mis datos",
      description: "Telefono, cuenta y preferencias",
    },
  ];

  if (user.rol === ROLES.CLIENTE) {
    return [
      ...commonLinks,
      {
        to: "/casos",
        label: "Mis casos",
        description: "Estado, mensajes y seguimiento",
      },
      {
        to: "/direcciones",
        label: "Direcciones",
        description: "Lugares donde sera el servicio",
      },
      {
        to: "/historial",
        label: "Mi seguimiento",
        description: "Historial de coordinacion",
      },
    ];
  }

  if (user.rol === ROLES.PROFESIONAL) {
    return [
      ...commonLinks,
      {
        to: "/casos/profesional",
        label: "Casos activos",
        description: "Tus asignaciones y mensajes",
      },
      {
        to: "/direcciones",
        label: "Zonas de trabajo",
        description: "Lugares donde puedes atender",
      },
      {
        to: "/historial-servicios",
        label: "Historial",
        description: "Servicios y seguimiento",
      },
      {
        to: "/horarios",
        label: "Disponibilidad",
        description: "Horarios y agenda semanal",
      },
    ];
  }

  if (user.rol === ROLES.ADMIN) {
    return [
      ...commonLinks,
      {
        to: "/dashboard/casos",
        label: "Inbox de casos",
        description: "Coordinacion y seguimiento",
      },
      {
        to: "/dashboard",
        label: "Panel admin",
        description: "Operaciones y gestion",
      },
    ];
  }

  return commonLinks;
};

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => ({ ...state.auth }));
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const primaryArea = getPrimaryArea(user);
  const accountLinks = useMemo(() => getAccountLinks(user), [user]);

  useEffect(() => {
    setAccountMenuOpen(false);
  }, [location.pathname]);

  const logout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  const linkClassName = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive ? "bg-[#f2e3c9] text-[#6b4b18]" : "text-slate-700 hover:bg-[#f7efe2]"
    }`;

  return (
    <header className="border-b border-[#e8dcc9] bg-white/95 backdrop-blur">
      <nav className="mx-auto max-w-screen-xl px-4 pb-4 pt-8 lg:px-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/">
              <LazyLoadImage
                effect="blur"
                width="150"
                height="80"
                alt="Logo Cuidafy"
                src="/logo.jpg"
              />
            </Link>

            <div className="hidden items-center gap-2 lg:flex">
              {publicLinks.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClassName}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!user && (
              <Link
                to="/loginProfesional"
                className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex"
              >
                Profesionales
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                {primaryArea ? (
                  <Link
                    to={primaryArea.to}
                    className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:inline-flex"
                  >
                    {primaryArea.label}
                  </Link>
                ) : null}

                <Link
                  to="/ajustes"
                  className="rounded-full border border-slate-300 p-3 text-slate-500 transition hover:bg-slate-50 hover:text-[#7c5a23]"
                  aria-label="Ajustes"
                >
                  <RiSettings3Line className="h-5 w-5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((current) => !current)}
                  className="inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50"
                  aria-expanded={accountMenuOpen}
                  aria-controls="header-account-panel"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9dcc7] text-sm font-semibold text-[#7c5a23]">
                    {user?.nombre?.[0]?.toUpperCase() || ""}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold">Mi cuenta</p>
                    <p className="text-xs text-slate-500">Abrir accesos rapidos</p>
                  </div>
                  <RiArrowDownSLine
                    className={`h-5 w-5 transition ${accountMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Iniciar sesion
                </Link>
                <Link
                  to="/registro"
                  className="rounded-full bg-[#7c5a23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#604318]"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 lg:hidden">
          {publicLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClassName}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {user && accountMenuOpen ? (
          <div
            id="header-account-panel"
            className="mt-5 rounded-[1.75rem] border border-[#e8dcc9] bg-[#fffaf3] p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900">
                  Accesos de {user?.nombre || "tu cuenta"}
                </p>
                <p className="text-sm text-slate-600">
                  Elige una opcion clara para seguir. No hace falta usar menus ocultos.
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Salir
              </button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {accountLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 transition hover:border-[#d6bc8a] hover:bg-[#fff7ea]"
                >
                  <p className="text-base font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
};

export default Header;
