import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useCurrentSession } from "@/hooks/useCurrentSession";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const handleLogout = async () => {
  await signOut({ callbackUrl: "/" });
};

const UserCard = () => {
  const { session, status } = useCurrentSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center rounded-full p-1 hover:bg-subtle dark:hover:bg-primary/20"
          disabled={status === "loading"}
        >
          {status === "loading" && (
            <span className="size-8 animate-pulse rounded-full bg-subtle-hover/80 sm:size-10" />
          )}
          {status === "authenticated" && (
            <Avatar className="size-8 sm:size-10">
              <AvatarImage
                src={`${session?.user.image}?t=${Date.now()}`}
                alt="User Avatar"
              />
              <AvatarFallback className="bg-primary/50 uppercase">
                {session?.user?.first_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
          <ChevronDown
            className={cn(
              "size-4 text-neutral-dark-2 sm:size-5",
              status !== "authenticated" && "opacity-0"
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-1 w-56" align="end">
        <DropdownMenuLabel className="pb-0 pt-3">
          {session?.user?.first_name} {session?.user?.last_name}
        </DropdownMenuLabel>
        <span className="block px-2 pb-1 text-xs text-neutral-dark-1">
          {session?.user?.email ?? "Signed In"}
        </span>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href={"/dashboard"} passHref legacyBehavior>
            <DropdownMenuItem className="cursor-pointer">
              <span className="font-medium">Overview</span>
              <DropdownMenuShortcut>⇧O</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <span className="font-medium">Log out</span>
          <DropdownMenuShortcut>⇧Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserCard;
