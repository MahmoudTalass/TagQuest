import { useRef, useState } from "react";

export function GamePage() {
   const image = useRef(null);
   const [x, setX] = useState();
   const [y, setY] = useState();

   function handleClick(e) {
      const rect = e.target.getBoundingClientRect();
      const xcoord = e.clientX - rect.left; //x position within the element.
      const ycoord = e.clientY - rect.top; //y position within the element.
      console.log("Left? : " + x + " ; Top? : " + y + ".");
      setX(xcoord);
      setY(ycoord);
   }

   return (
      <section>
         <p>X: {x}</p>
         <p>Y: {y}</p>
         <img
            src="tagquest_image.jpg"
            alt="find the characters image"
            ref={image}
            onClick={handleClick}
            className="hover:cursor-crosshair"
         />
      </section>
   );
}
