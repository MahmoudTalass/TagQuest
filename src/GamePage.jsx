import { faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Buffer } from "buffer";
import { WinScreen } from "./WinScreen";
import { formatTime } from "./timeFormatter";
import { Link } from "react-router-dom";

export function GamePage() {
   const image = useRef(null);
   const stopWatchId = useRef(null);

   const [token, setToken] = useState(null);
   const [tokenContent, setTokenContent] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const [characters, setCharacters] = useState([]);

   const [targetLocation, targetHighlightLocation] = useState();
   const [displayMenu, setDisplayMenu] = useState(false);
   const [displayWin, setDisplayWin] = useState(false);

   const [marks, setMarks] = useState([]);
   const [x, setX] = useState();
   const [y, setY] = useState();
   const [seconds, setSeconds] = useState(0);

   const [displayMissedTargetMsg, setDisplayMissedTargetMsg] = useState(false);

   function triggerMissedTargetMsg() {
      setDisplayMissedTargetMsg(true);

      setTimeout(() => {
         setDisplayMissedTargetMsg(false);
      }, 2000);
   }

   function handleClick(e) {
      const { width, height } = e.target;
      const { offsetX, offsetY } = e.nativeEvent;

      const xCoordinate = Math.round((offsetX / width) * 1920);
      const yCoordinate = Math.round((offsetY / height) * 2715);

      setDisplayMenu(!displayMenu);

      targetHighlightLocation({ x: offsetX, y: offsetY });
      setX(xCoordinate);
      setY(yCoordinate);
   }

   async function checkAttempt(characterId) {
      try {
         const xLocationRange = [x - 20, x + 20];
         const yLocationRange = [y - 20, y + 20];

         const requestBody = {
            token,
            characterId,
            xLocationRange,
            yLocationRange,
         };
         const response = await fetch("https://tagquestapi.fly.dev/api/game/check-attempt", {
            method: "POST",
            headers: {
               "content-type": "application/json",
            },
            body: JSON.stringify(requestBody),
         });

         const json = await response.json();

         if (!response.ok) {
            setToken(null);
            setTokenContent(null);
            setCharacters([]);
            return setError(json.error.message);
         }

         const hitTarget = json.hitTarget;

         const decodedToken = jwtDecode(json.token);
         setToken(json.token);
         setTokenContent(decodedToken);
         setCharacters(
            characters.map((character) => {
               if (hitTarget && characterId === character._id) {
                  character.found = true;
               }
               return character;
            })
         );
         if (json.hitTarget) {
            setMarks([...marks, { x: targetLocation.x, y: targetLocation.y }]);
         } else {
            triggerMissedTargetMsg();
         }
         if (json.hasWon) {
            setDisplayWin(true);
            clearInterval(stopWatchId.current);
         }
         setDisplayMenu(false);
      } catch (err) {
         setError(err.message);
      }
   }

   useEffect(() => {
      setLoading(true);

      const controller = new AbortController();

      async function startGame() {
         try {
            const [tokenResponse, charactersResponse] = await Promise.all([
               fetch("https://tagquestapi.fly.dev/api/game/start", {
                  method: "POST",
                  signal: controller.signal,
               }),
               fetch("https://tagquestapi.fly.dev/api/characters", {
                  signal: controller.signal,
               }),
            ]);

            if (!tokenResponse.ok || !charactersResponse) {
               setError("Error occurred");
               setCharacters(null);
               return setToken(null);
            }

            const [tokenJson, charactersJson] = await Promise.all([
               tokenResponse.json(),
               charactersResponse.json(),
            ]);

            const decodedToken = jwtDecode(tokenJson.token);
            setToken(tokenJson.token);
            setTokenContent(decodedToken);
            setCharacters(
               charactersJson.map((character) => {
                  return {
                     ...character,
                     image: `data:image/webp;base64,${Buffer.from(character.image).toString(
                        "base64"
                     )}`,
                     found: false,
                  };
               })
            );

            setError(null);
            setLoading(false);
         } catch (err) {
            if (controller.signal.aborted) return;
            setError("Something went wrong. Please try again later.");
            setLoading(false);
         }
      }

      startGame();

      stopWatchId.current = setInterval(() => {
         setSeconds((curr) => curr + 1);
      }, 1000);

      return () => {
         controller.abort();
         clearInterval(stopWatchId.current);
      };
   }, []);

   if (loading) {
      return (
         <div className="w-full mt-20 flex justify-center items-center">
            <FontAwesomeIcon icon={faSpinner} size="3x" spin />
         </div>
      );
   }

   if (error) {
      return <div>{error}</div>;
   }

   if (!characters || !token) return;

   return (
      <section className="relative">
         <div className="flex px-4 justify-between gap-10 items-center p-2">
            <Link className="text-2xl" to="/">
               Home
            </Link>
            <p className="text-2xl font-bold">{formatTime(seconds)}</p>
            <div className="flex justify-center items-center gap-5">
               {characters.map((character) => {
                  return (
                     <div
                        key={character._id}
                        className={` ${character.found ? "opacity-40" : "opacity-100"}`}
                     >
                        <img
                           src={character.image}
                           alt={`image of $character.name}`}
                           className="size-24 object-contain"
                        />
                     </div>
                  );
               })}
            </div>
         </div>

         <div className="relative w-fit h-fit">
            <img
               src="tagquest_image.jpg"
               alt="find the characters image"
               ref={image}
               onClick={handleClick}
               className="w-full h-full hover:cursor-crosshair"
            />
            {displayMenu && (
               <>
                  <div
                     className={`absolute bg-transparent -translate-x-1/2 -translate-y-1/2 z-10 border-4 border-red-600 w-10 h-10 rounded-md`}
                     style={{ left: `${targetLocation.x}px`, top: `${targetLocation.y}px` }}
                  ></div>
                  <div
                     className={"absolute bg-color1 z-10 rounded-lg"}
                     style={{ left: `${targetLocation.x + 30}px`, top: `${targetLocation.y}px` }}
                  >
                     {characters.map((character) => {
                        if (!character.found) {
                           return (
                              <li
                                 className="hover:bg-color2 p-2 rounded-lg flex items-center gap-2"
                                 key={character._id}
                                 onClick={() => {
                                    checkAttempt(character._id);
                                 }}
                              >
                                 <img
                                    src={character.image}
                                    alt={`image of ${character.name}`}
                                    className="w-10"
                                 />
                                 <p>{character.name}</p>
                              </li>
                           );
                        }
                     })}
                  </div>
               </>
            )}
            {marks.map((mark) => {
               return (
                  <div
                     key={mark.x}
                     className="absolute -translate-x-1/2 -translate-y-1/2 z-8"
                     style={{ left: `${mark.x}px`, top: `${mark.y}px` }}
                  >
                     <FontAwesomeIcon icon={faXmark} color="rgb(220 38 38)" size="3x" />{" "}
                  </div>
               );
            })}
         </div>
         {displayWin && <WinScreen tokenContent={tokenContent} token={token} />}
         <p
            className={`fixed z-10 text-4xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 text-red-600 ${
               displayMissedTargetMsg ? "opacity-100" : "opacity-0"
            }`}
         >
            Incorrect!
         </p>
      </section>
   );
}
