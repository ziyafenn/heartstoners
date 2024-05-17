import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef, useEffect } from "react";

type Props = {
  currentCount: number;
  onAddCard: () => void;
  isDisabled: boolean;
  name: string;
  image: string;
};

export function HsCard({
  currentCount,
  isDisabled,
  onAddCard,
  name,
  image,
}: Props) {
  const cardRef = useRef(null);

  // useEffect(() => {
  //   const card = cardRef.current!;
  //   let bounds;

  //   function rotateToMouse(e) {
  //     const mouseX = e.clientX;
  //     const mouseY = e.clientY;
  //     const leftX = mouseX - bounds.x;
  //     const topY = mouseY - bounds.y;
  //     const center = {
  //       x: leftX - bounds.width / 2,
  //       y: topY - bounds.height / 2,
  //     };
  //     const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

  //     card.style.transform = `
  //       scale3d(1.07, 1.07, 1.07)
  //       rotate3d(
  //         ${center.y / 100},
  //         ${-center.x / 100},
  //         0,
  //         ${Math.log(distance) * 2}deg
  //       )
  //     `;

  //     // card.querySelector(".glow").style.backgroundImage = `
  //     //   radial-gradient(
  //     //     circle at
  //     //     ${center.x * 2 + bounds.width / 2}px
  //     //     ${center.y * 2 + bounds.height / 2}px,
  //     //     #ffffff55,
  //     //     #0000000f
  //     //   )
  //     // `;
  //   }

  //   function handleMouseEnter() {
  //     bounds = card.getBoundingClientRect();
  //     document.addEventListener("mousemove", rotateToMouse);
  //   }

  //   function handleMouseLeave() {
  //     document.removeEventListener("mousemove", rotateToMouse);
  //     card.style.transform = "";
  //     card.style.background = "";
  //   }

  //   card.addEventListener("mouseenter", handleMouseEnter);
  //   card.addEventListener("mouseleave", handleMouseLeave);

  //   return () => {
  //     card.removeEventListener("mouseenter", handleMouseEnter);
  //     card.removeEventListener("mouseleave", handleMouseLeave);
  //   };
  // }, []);

  return (
    <div className="card">
      <div className={cn("coin", !currentCount && "hidden")}>
        {currentCount}
      </div>
      <button
        onClick={onAddCard}
        disabled={isDisabled}
        type="button"
        className={cn(isDisabled && "grayscale")}
      >
        <Image
          draggable={false}
          className={cn("image", currentCount && "selected")}
          alt={name}
          src={image}
          height={530}
          width={384}
        />
      </button>
    </div>
  );
}
