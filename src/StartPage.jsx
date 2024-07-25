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
         <div className="border w-full max-w-[700px] flex flex-col items-center p-8 gap-4">
            <h2>Welcome!</h2>
            <p>Your task is to find the following characters:</p>
            <div className="flex gap-8 items-end">
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
            <Link to={"/gameplay"}>
               <button className="mt-4 border rounded-md px-6 py-2 text-lg">Start</button>
            </Link>
         </div>
      </section>
   );
}
