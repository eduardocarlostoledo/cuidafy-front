import React from "react";
import { RiSettings3Line } from "react-icons/ri";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/features/authSlice";
import RoleGuardComponent from "../guards/RoleGuardComponent";
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

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state.auth }));

  const primaryArea = getPrimaryArea(user);

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
                src="https://calyaan.b-cdn.net/wp-content/uploads/2022/01/Logo-Cuidafy2.png"
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

                <div className="dropdown inline-block relative">
                  <button className="text-gray-700 font-semibold rounded inline-flex items-center">
                    <span className="text-gray-700 flex items-center">
                      <div className="cursor-pointer font-semibold h-10 w-10 rounded-full bg-[#e9dcc7] text-[#7c5a23] flex items-center justify-center">
                        {user?.nombre?.[0]?.toUpperCase() || ""}
                      </div>
                    </span>
                  </button>

                  <ul className="dropdown-menu absolute hidden right-0 z-40 min-w-[220px] rounded-2xl border border-slate-200 bg-white p-2 text-gray-700 shadow-lg">
                    <li>
                      <Link
                        className="block rounded-xl px-4 py-2 text-left hover:bg-[#f7efe2] hover:text-[#7c5a23]"
                        to="/ajustes"
                      >
                        Ajustes
                      </Link>
                    </li>

                    <RoleGuardComponent rol={[ROLES.CLIENTE]}>
                      <li>
                        <Link
                          className="block rounded-xl px-4 py-2 text-left hover:bg-[#f7efe2] hover:text-[#7c5a23]"
                          to="/casos"
                        >
                          Mis casos
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="block rounded-xl px-4 py-2 text-left hover:bg-[#f7efe2] hover:text-[#7c5a23]"
                          to="/direcciones"
                        >
                          Lugares de servicio
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="block rounded-xl px-4 py-2 text-left hover:bg-[#f7efe2] hover:text-[#7c5a23]"
                          to="/historial"
                        >
                          Mi seguimiento
                        </Link>
                      </li>
                    </RoleGuardComponent>

                    <RoleGuardComponent rol={[ROLES.ADMIN]}>
                      <li>
                        <Link
                          className="block rounded-xl px-4 py-2 text-left hover:bg-[#f7efe2] hover:text-[#7c5a23]"
                          to="/dashboard/casos"
                        >
                          Inbox de casos
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="block rounded-xl px-4 py-2 text-left hover:bg-[#f7efe2] hover:text-[#7c5a23]"
                          to="/dashboard"
                        >
                          Coordinación
                        </Link>
                      </li>
                    </RoleGuardComponent>

                    <RoleGuardComponent rol={[ROLES.PROFESIONAL]}>
                      <li>
                        <Link
                          className="block rounded-xl px-4 py-2 text-left hover:bg-[#f7efe2] hover:text-[#7c5a23]"
                          to="/casos/profesional"
                        >
                          Inbox de casos
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="block rounded-xl px-4 py-2 text-left hover:bg-[#f7efe2] hover:text-[#7c5a23]"
                          to="/direcciones"
                        >
                          Zonas de trabajo
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="block rounded-xl px-4 py-2 text-left hover:bg-[#f7efe2] hover:text-[#7c5a23]"
                          to="/historial-servicios"
                        >
                          Casos activos
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="block rounded-xl px-4 py-2 text-left hover:bg-[#f7efe2] hover:text-[#7c5a23]"
                          to="/horarios"
                        >
                          Disponibilidad
                        </Link>
                      </li>
                    </RoleGuardComponent>

                    <li>
                      <button
                        className="block w-full rounded-xl px-4 py-2 text-left hover:bg-red-50 hover:text-red-600"
                        onClick={logout}
                      >
                        Salir
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Iniciar sesión
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
      </nav>
    </header>
  );
};

export default Header;
