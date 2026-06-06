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
import Profile from "../pages/User/Profile/Profile.tsx";

// Admin pages
import Dashboard from "../pages/Admin/Dashboard/Dashboard.tsx";
import AdminMovies from "../pages/Admin/Movies/Movies.tsx";
import AdminCinemaSystems from "../pages/Admin/CinemaSystems/CinemaSystems.tsx";
import AdminCinemaComplexes from "../pages/Admin/CinemaComplexes/CinemaComplexes.tsx";
import AdminCinemas from "../pages/Admin/Cinemas/Cinemas.tsx";
import AdminShowtimes from "../pages/Admin/Showtimes/Showtimes.tsx";
import AdminFoods from "../pages/Admin/Foods/Foods.tsx";
import AdminBanners from "../pages/Admin/Banners/Banners.tsx";
import AdminStaff from "../pages/Admin/Staff/Staff.tsx";

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
      {
        path: "profile",
        element: <Profile />,
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
    nested: [
      { path: "", element: <Dashboard /> },
      { path: "movies", element: <AdminMovies /> },
      { path: "cinema-systems", element: <AdminCinemaSystems /> },
      { path: "cinema-complexes", element: <AdminCinemaComplexes /> },
      { path: "cinemas", element: <AdminCinemas /> },
      { path: "showtimes", element: <AdminShowtimes /> },
      { path: "foods", element: <AdminFoods /> },
      { path: "banners", element: <AdminBanners /> },
      { path: "staff", element: <AdminStaff /> },
    ],
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