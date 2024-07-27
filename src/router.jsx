import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { GamePage } from "./GamePage";
import { StartPage } from "./StartPage";
import { Leaderboard } from "./Leaderboard";

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
         {
            path: "/leaderboard",
            element: <Leaderboard />,
         },
      ],
   },

   {
      path: "*",
      element: <></>,
   },
]);
