// src\features\admin\components\users\shared\UserAvatar.tsx
interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ name, size = "md", className = "" }: UserAvatarProps) {
  const initials = name.split(" ").map(n => n[0]).join("");
  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-16 text-2xl",
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black ${sizeClasses[size]} ${className}`}>
      {initials}
    </div>
  );
}