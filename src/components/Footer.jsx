import React from "react";
import { Link } from "react-router-dom";
import { BsFacebook } from "react-icons/bs";
import { GrInstagram } from "react-icons/gr";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { AiOutlineYoutube } from "react-icons/ai";
import { ImPinterest2 } from "react-icons/im";

const Footer = () => {
  return (
    <footer aria-label="Site Footer" className="bg-[#1f1710] text-white">
      <div className="mx-auto max-w-screen-2xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center sm:justify-start">
              <img
                width="289"
                height="153"
                alt="Logo Cuidafy"
                src="https://calyaan.b-cdn.net/wp-content/uploads/2021/11/RecursoRecurso-3-.png"
              />
            </div>

            <p className="mt-6 max-w-md text-sm leading-6 text-white/75">
              Cuidafy se presenta aquí como hub de cuidado: una entrada guiada para encontrar,
              comparar y coordinar acompañamiento con más contexto y menos fricción.
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              <li>
                <a
                  href="https://www.facebook.com/Cuidafy-105376747798392"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white/75"
                >
                  <span className="sr-only">Facebook</span>
                  <BsFacebook className="h-6 w-6" />
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/calyaancol/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white/75"
                >
                  <span className="sr-only">Instagram</span>
                  <GrInstagram className="h-6 w-6" />
                </a>
              </li>

              <li>
                <a
                  href="https://www.youtube.com/channel/UCJNVxAjRm23sU7Q8ylvYxWA"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white/75"
                >
                  <span className="sr-only">Youtube</span>
                  <AiOutlineYoutube className="h-6 w-6" />
                </a>
              </li>

              <li>
                <a
                  href="https://co.pinterest.com/calyaancol/_created/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white/75"
                >
                  <span className="sr-only">Pinterest</span>
                  <ImPinterest2 className="h-6 w-6" />
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Explorar</p>

              <nav aria-label="Footer Explore Nav" className="mt-8">
                <ul className="space-y-4 text-sm">
                  <li>
                    <Link className="transition hover:text-white/75" to="/encontrar-cuidado">
                      Iniciar solicitud
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-white/75" to="/servicios">
                      Tipos de cuidado
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-white/75" to="/cuidado/matches">
                      Matching disponible
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Accesos</p>

              <nav aria-label="Footer Roles Nav" className="mt-8">
                <ul className="space-y-4 text-sm">
                  <li>
                    <Link className="transition hover:text-white/75" to="/login">
                      Familias y pacientes
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-white/75" to="/loginProfesional">
                      Profesionales
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-white/75" to="/logindashboard">
                      Coordinación
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Contacto</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a
                    className="flex items-center justify-center gap-1.5 sm:justify-start"
                    href="mailto:info@toledoconsultora.com"
                  >
                    <HiOutlineMail className="h-5 w-5 shrink-0" />
                    <span>info@toledoconsultora.com</span>
                  </a>
                </li>

                <li>
                  <a
                    className="flex items-center justify-center gap-1.5 sm:justify-start"
                    href="https://web.whatsapp.com/send/?phone=543764331313&text&app_absent=0"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <HiOutlinePhone className="h-5 w-5 shrink-0" />
                    <span>(+54) 3764331313</span>
                  </a>
                </li>

                <li className="text-white/75">
                  Atención para orientación inicial, seguimiento y dudas de coordinación.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="mt-4 text-sm text-white/75 sm:order-first sm:mt-0">
              Copyright &copy; 2026 Cuidafy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
