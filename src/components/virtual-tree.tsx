import Image from 'next/image';

interface VirtualTreeProps {
  progress: number; // 0-100
  isWithered?: boolean;
  size?: number;
}

export function VirtualTree({ progress, isWithered = false, size = 180 }: VirtualTreeProps) {
  let src = "https://placehold.co/200x200.png";
  let alt = "A growing tree";
  let hint = "seedling";
  let key = "seedling";

  if (isWithered) {
    src = "https://placehold.co/200x200.png";
    alt = "A withered tree";
    hint = "withered tree";
    key = "withered";
  } else if (progress < 1) {
    src = "https://placehold.co/200x200.png";
    alt = "A seed waiting to be planted";
    hint = "seed ground";
    key = "seed";
  } else if (progress < 25) {
    src = "https://placehold.co/200x200.png";
    alt = "A seedling sprouting";
    hint = "seedling sprout";
    key = "sprout";
  } else if (progress < 50) {
    src = "https://placehold.co/200x200.png";
    alt = "A small, young tree";
    hint = "small tree";
    key = "small-tree";
  } else if (progress < 99) {
    src = "https://placehold.co/200x200.png";
    alt = "A healthy, medium-sized tree";
    hint = "medium tree";
    key = "medium-tree";
  } else {
    src = "https://placehold.co/200x200.png";
    alt = "A full, lush tree";
    hint = "large tree";
    key = "large-tree";
  }

  return (
    <div key={key} className="animate-in fade-in duration-1000">
        <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            data-ai-hint={hint}
            className="transition-all duration-500 drop-shadow-lg"
        />
    </div>
  );
}
