import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";

export default async function SignIn() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        {user ? (
          <div className="text-center">
            <Image
              src={user.image}
              alt={user.name}
              width={96}
              height={96}
              className="mx-auto rounded-full shadow-md"
            />
            <p className="mt-4 text-lg font-semibold text-gray-800">
              Welcome, <span className="text-blue-600">{user.name}</span>
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="w-full mt-6 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-lg font-semibold text-gray-800">
              Welcome! Please sign in to continue.
            </p>
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Sign in with Google
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
