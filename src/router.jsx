import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";

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
            element: <></>,
         },
      ],
   },

   {
      path: "*",
      element: <></>,
   },
]);
