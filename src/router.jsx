import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { GamePage } from "./GamePage";
import { StartPage } from "./StartPage";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <Layout />,
      children: [
         {
            index: true,
            element: <StartPage />,
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
