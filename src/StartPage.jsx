import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { Link } from "react-router-dom";

export function StartPage() {
   const [characters, setCharacters] = useState([]);

   useEffect(() => {
      async function fetchCall() {
         const response = await fetch("http://localhost:3000/api/characters");
         const json = await response.json();

         setCharacters(
            json.map((character) => {
               return {
                  ...character,
                  image: `data:image/webp;base64,${Buffer.from(character.image).toString(
                     "base64"
                  )}`,
               };
            })
         );
      }
      fetchCall();
   }, []);

   return (
      <section className="mt-10 flex items-center justify-center">
         <div className="bg-color1 rounded-lg shadow-lg">
            <div className="w-full max-w-[700px] flex flex-col items-center p-8 gap-12">
               <div className="flex items-center w-full">
                  <h1 className="text-3xl font-bold grow ">Wecome to Tag Quest!</h1>
                  <Link to="/leaderboard">Leaderboard</Link>
               </div>

               <div className="flex flex-col gap-8">
                  <p className="text-lg">Your task is to find the following characters:</p>
                  <div className="flex gap-16 items-end">
                     {characters.map((character) => {
                        return (
                           <div key={character._id} className="flex flex-col items-center">
                              <img
                                 src={character.image}
                                 alt={`image of ${character.name}`}
                                 className="w-40 hover:scale-105"
                              />
                              <p>{character.name}</p>
                           </div>
                        );
                     })}
                  </div>
               </div>
               <Link to={"/gameplay"}>
                  <button className="mt-6 bg-green-500 rounded-lg px-8 py-3 text-md">Start</button>
               </Link>
            </div>
         </div>
      </section>
   );
}
