import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateProfileForUser } from "@/lib/setups";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function MyProfileRedirectPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const profile = await getOrCreateProfileForUser(userId, user);

  if (profile?.username) {
    redirect(`/u/${profile.username}`);
  }

  redirect("/editor");
}
