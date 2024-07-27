import { faAngleLeft, faAngleRight, faHome, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { formatTime } from "./timeFormatter";
import { Link } from "react-router-dom";

export function Leaderboard() {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const [page, setPage] = useState(1);

   const pageSize = 10;

   async function changePage(toNext) {
      let pageNumber;
      if ((!toNext && page === 1) || (toNext && page === data.metadata.totalPages)) {
         return;
      }
      if (toNext) {
         pageNumber = page + 1;
      } else {
         pageNumber = page - 1;
      }
      setPage(pageNumber);
      try {
         const response = await fetch(
            `http://localhost:3000/api/players?page=${pageNumber}&pageSize=${pageSize}`
         );

         const json = await response.json();

         if (!response.ok) {
            setPage(1);
            setData(null);
            return setError(json.error.message);
         }

         setData(json);
         setError(null);
         setLoading(false);
      } catch (err) {
         setLoading(false);
         setError("Something went wrong, please try again later");
      }
   }

   useEffect(() => {
      const controller = new AbortController();
      setLoading(true);
      async function fetchData() {
         try {
            const response = await fetch(
               `http://localhost:3000/api/players?page=1&pageSize=${pageSize}`,
               {
                  signal: controller.signal,
               }
            );

            const json = await response.json();

            if (!response.ok) {
               setPage(1);
               setData(null);
               return setError(json.error);
            }

            setData(json);
            setError(null);
            setLoading(false);
         } catch (err) {
            setLoading(false);
            setError("Something went wrong, please try again later");
         }
      }
      fetchData();
   }, []);

   if (!data || loading) {
      return (
         <div className="w-full mt-20 flex justify-center items-center">
            <FontAwesomeIcon icon={faSpinner} size="3x" spin />
         </div>
      );
   }

   return (
      <section className="mt-10 flex items-center justify-center">
         <div className="bg-color1 rounded-lg shadow-lg flex flex-col p-4 items-center gap-6 w-full max-w-[500px]">
            <div className="w-full">
               <Link to="/" className="float-left">
                  <FontAwesomeIcon icon={faHome} />{" "}
               </Link>
               <h1 className="grow-1 text-center text-2xl">Leaderboard</h1>
            </div>

            {data?.players.length === 0 && <p>Be the first player on the leaderboard!</p>}
            {error ? (
               <p>{error}</p>
            ) : (
               data.players.length > 0 && (
                  <table className="w-full text-center">
                     <thead>
                        <tr>
                           <th>Placement</th>
                           <th>Name</th>
                           <th>Score</th>
                        </tr>
                     </thead>
                     <tbody>
                        {data.players.length > 0 &&
                           data.players.map((player, index) => {
                              return (
                                 <tr key={player._id}>
                                    <td>{(page - 1) * pageSize + (index + 1)}</td>
                                    <td>{player.name}</td>
                                    <td>{formatTime(player.score)}</td>
                                 </tr>
                              );
                           })}
                     </tbody>
                  </table>
               )
            )}
            <div className="flex gap-6">
               <button
                  disabled={page === 1}
                  className={`${page === 1 && "opacity-50"}`}
                  onClick={() => changePage(false)}
               >
                  <FontAwesomeIcon icon={faAngleLeft} />{" "}
               </button>
               <p>
                  Page: {page} out of {data.metadata.totalPages}
               </p>
               <button
                  disabled={data.metadata.totalPages === page}
                  className={`${data.metadata.totalPages === page && "opacity-50"}`}
                  onClick={() => changePage(true)}
               >
                  <FontAwesomeIcon icon={faAngleRight} />{" "}
               </button>
            </div>
         </div>
      </section>
   );
}
