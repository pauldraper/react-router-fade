import { memo } from "react";
import { createRoot } from "react-dom/client";
import {
  Navigate,
  NavLink as RouterLink,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import "./styles.css";
import { OutletCssTransition } from "./transition";

const OutletFade = memo(({ childClassName, containerClassName }) => {
  childClassName = ["page", ...(childClassName ? [childClassName] : [])].join(
    " ",
  );
  containerClassName = [
    "container",
    ...(containerClassName ? [containerClassName] : []),
  ].join(" ");
  return (
    <div className={containerClassName}>
      <OutletCssTransition classNames="page" timeout={1000}>
        {(ref, children) => (
          <div className={childClassName} ref={ref}>
            {children}
          </div>
        )}
      </OutletCssTransition>
    </div>
  );
});

function navLinkClassName({ isActive }) {
  return ["nav-link", ...(isActive ? ["active"] : [])].join(" ");
}

const NavLink = memo(({ children, to }) => {
  return (
    <RouterLink className={navLinkClassName} to={to}>
      {children}
    </RouterLink>
  );
});

const Example = memo(() => {
  return (
    <>
      <nav className="nav">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/">Redirect</NavLink>
      </nav>
      <OutletFade childClassName="main-page" />
    </>
  );
});

const About = memo(() => {
  return (
    <>
      <h1>About</h1>
      {[0, 1, 2].map(() => (
        <p>
          Donec sit amet augue at enim sollicitudin porta. Praesent finibus ex
          velit, quis faucibus libero congue et. Quisque convallis eu nisl et
          congue. Vivamus eget augue quis ante malesuada ullamcorper. Sed orci
          nulla, eleifend eget dui faucibus, facilisis aliquet ante. Suspendisse
          sollicitudin nibh lacus, ut bibendum risus elementum a.
        </p>
      ))}
    </>
  );
});

const Contact = memo(() => {
  return (
    <>
      <h1>Contact</h1>
      <div className="nav">
        <NavLink to="a">A</NavLink>
        <NavLink to="b">B</NavLink>
      </div>
      <OutletFade />
    </>
  );
});

const ContactA = memo(() => {
  return <p>Aliquam iaculis a nisi sed ornare.</p>;
});

const ContactB = memo(() => {
  return (
    <p>
      Sed venenatis tellus vel consequat congue. In bibendum vestibulum orci et
      feugiat.
    </p>
  );
});

const Home = memo(() => {
  return (
    <>
      <h1>Home</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquet,
        purus vitae eleifend tristique, lorem magna volutpat orci, et vehicula
        erat erat nec elit. Aenean posuere nunc ac cursus facilisis. Aenean vel
        porta turpis, ut iaculis justo.
      </p>
    </>
  );
});

const router = createHashRouter([
  {
    path: "/",
    element: <Example />,
    children: [
      {
        index: true,
        element: <Navigate to="home"></Navigate>,
        handle: { animate: false },
      },
      { path: "/home", name: "Home", element: <Home /> },
      { path: "/about", name: "About", element: <About /> },
      {
        path: "/contact",
        name: "Contact",
        element: <Contact />,
        children: [
          { index: true, element: <Navigate to="a" /> },
          { path: "a", element: <ContactA /> },
          { path: "b", element: <ContactB /> },
        ],
      },
    ],
  },
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<RouterProvider router={router} />);
