import PropTypes from "prop-types";
import { formatTime } from "./timeFormatter";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function WinScreen({ tokenContent, token }) {
   const [name, setName] = useState("");
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

   const handleNameChange = (e) => setName(e.target.value);

   async function handleSubmitScore(e) {
      e.preventDefault();
      setLoading(true);
      try {
         const response = await fetch("http://localhost:3000/api/players", {
            method: "POST",
            headers: {
               "content-type": "application/json",
            },
            body: JSON.stringify({ name, token }),
         });

         if (!response.ok) {
            setLoading(false);
            if (response.status === 400) {
               const json = await response.json();
               return setError(json.error.message);
            }
            throw new Error("Unexpected error");
         }

         setLoading(false);
         setError(null);
         setToken(null);
         setTokenContent(null);
         navigate("/leaderboard");
      } catch (err) {
         setLoading(false);
         setError(err.message);
      }
   }

   const timeToWin = Math.floor(
      (new Date(tokenContent.finishTime).getTime() - new Date(tokenContent.startTime).getTime()) /
         1000
   );
   const formattedTime = formatTime(timeToWin);

   return (
      <section
         className={`w-full h-full bg-black bg-opacity-50 fixed top-0 left-0 right-0 bottom-0 z-20`}
      >
         <div
            className={`fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-color1 max-w-[500px] p-4 w-[500px] flex flex-col items-center gap-4 rounded-lg shadow-lg`}
         >
            <p className="text-4xl">Congratulations!!</p>
            <p className="text-xl">You found the hidden characters in {formattedTime}</p>
            <form
               onSubmit={handleSubmitScore}
               className="flex flex-col items-center max-w-[300px] w-full gap-2"
            >
               <label htmlFor="name" className="text-lg">
                  Enter your name to record your score
               </label>
               <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full bg-color2 p-1 rounded-md"
                  onChange={handleNameChange}
                  required
               />
               <button type="submit" disabled={loading}>
                  Submit
               </button>
               {error && <p className="text-red-600 text-center">{error}</p>}
            </form>
         </div>
      </section>
   );
}

WinScreen.propTypes = {
   tokenContent: PropTypes.object,
   token: PropTypes.string,
};

export { WinScreen };