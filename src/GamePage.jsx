import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

export function GamePage() {
   const image = useRef(null);
   const [x, setX] = useState();
   const [y, setY] = useState();
   const [targetLocation, targetHighlightLocation] = useState({ x, y });
   const [displayMenu, setDisplayMenu] = useState(false);
   const [marks, setMarks] = useState([]);

   function handleClick(e) {
      const { width, height } = e.target;
      const { offsetX, offsetY } = e.nativeEvent;
      setX(Math.round((offsetX / width) * 1920));
      setY(Math.round((offsetY / height) * 2715));

      targetHighlightLocation({ x: offsetX, y: offsetY });
      setDisplayMenu(!displayMenu);
      console.log(`range: x(${offsetX - 20} - ${offsetX + 20})`);
   }

   function placeMark() {
      setMarks([...marks, { x: targetLocation.x, y: targetLocation.y }]);
      setDisplayMenu(false);
   }

   return (
      <section>
         <p>X: {x}</p>
         <p>Y: {y}</p>
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
                  <ul
                     className={"absolute bg-color1 z-10 rounded-lg"}
                     style={{ left: `${targetLocation.x + 30}px`, top: `${targetLocation.y}px` }}
                  >
                     <li onClick={placeMark} className="hover:bg-color2 p-2 rounded-lg">
                        Character 1
                     </li>
                     <li className="hover:bg-color2 p-2 rounded-lg">Character 2</li>
                  </ul>
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
      </section>
   );
}
