import { useRef, useState } from "react";

export function GamePage() {
   const image = useRef(null);
   const [x, setX] = useState();
   const [y, setY] = useState();

   function handleClick(e) {
      const { width, height } = e.target.getBoundingClientRect();
      const { offsetX, offsetY } = e.nativeEvent;
      setX(Math.round((offsetX / width) * 100));
      setY(Math.round((offsetY / height) * 100));
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
