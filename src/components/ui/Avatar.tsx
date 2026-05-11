'use client';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-lg',
  } as const;

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`${sizes[size]} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-500 font-semibold text-white`}>
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials || '?'}
    </div>
  );
}
