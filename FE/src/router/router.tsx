import React from "react";
import { Route } from "react-router-dom";
import HomeTemplate from "../layouts/HomeTemplate.tsx";
import AdminTemplate from "../layouts/AdminTemplate.tsx";
import HomePage from "../pages/User/Home/Home.tsx";
import Login from "../pages/User/Login/Login.tsx";
import Register from "../pages/User/Register/Register.tsx";
import Movies from "../pages/User/Movies/Movies.tsx";
import MovieDetail from "../pages/User/MovieDetail/MovieDetail.tsx";
import BookTicket from "../pages/User/BookTicket/BookTicket.tsx";
import SelectSeat from "../pages/User/SelectSeat/SelectSeat.tsx";
import Cinemas from "../pages/User/Cinemas/Cinemas.tsx";
import CinemaDetail from "../pages/User/CinemaDetail/CinemaDetail.tsx";

export type AppRoute = {
  path: string;
  element: React.ReactElement;
  nested?: AppRoute[];
};

export const routes: AppRoute[] = [
  {
    path: "",
    element: <HomeTemplate />,
    nested: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "movies",
        element: <Movies />,
      },
      {
        path: "movies/:id",
        element: <MovieDetail />,
      },
      {
        path: "movies/:id/book",
        element: <BookTicket />,
      },
      {
        path: "movies/:id/book/seats",
        element: <SelectSeat />,
      },
      {
        path: "cinemas",
        element: <Cinemas />,
      },
      {
        path: "cinemas/:id",
        element: <CinemaDetail />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
    nested: [],
  },
  {
    path: "register",
    element: <Register />,
    nested: [],
  },
  {
    path: "admin",
    element: <AdminTemplate />,
    nested: [],
  },
];

export const generateRoutes = (routes: AppRoute[]) => {
  return routes.map((route) => {
    if (route.nested && route.nested.length > 0) {
      return (
        <Route path={route.path} element={route.element} key={route.path}>
          {route.nested.map((nestedRoute) => (
            <Route
              path={nestedRoute.path}
              element={nestedRoute.element}
              key={nestedRoute.path}
            />
          ))}
        </Route>
      );
    }
    return <Route path={route.path} element={route.element} key={route.path} />;
  });
};