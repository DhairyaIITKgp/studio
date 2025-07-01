import Image from 'next/image';

interface VirtualTreeProps {
  progress: number; // 0-100
  isWithered?: boolean;
  size?: number;
}

export function VirtualTree({ progress, isWithered = false, size = 180 }: VirtualTreeProps) {
  const src = `https://placehold.co/${size}x${size}/0000/0000.png`;
  let alt = "A growing tree";
  let hint = "seedling";
  let key = "seedling";

  if (isWithered) {
    alt = "A withered tree";
    hint = "withered tree";
    key = "withered";
  } else if (progress < 1) {
    alt = "A seed waiting to be planted";
    hint = "seed ground";
    key = "seed";
  } else if (progress < 25) {
    alt = "A seedling sprouting";
    hint = "seedling sprout";
    key = "sprout";
  } else if (progress < 50) {
    alt = "A small, young tree";
    hint = "small tree";
    key = "small-tree";
  } else if (progress < 99) {
    alt = "A healthy, medium-sized tree";
    hint = "medium tree";
    key = "medium-tree";
  } else {
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
