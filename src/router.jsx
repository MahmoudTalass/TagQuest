import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { GamePage } from "./GamePage";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <Layout />,
      children: [
         {
            index: true,
            element: <></>,
         },
         {
            path: "/gameplay",
            element: <GamePage />,
         },
      ],
   },

   {
      path: "*",
      element: <></>,
   },
]);
