import Image from "next/image";
import Icon from "@/app/favicon.ico";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const formAction = async (formData: FormData) => {
  "use server";

  //TODO: Call API to login
  /*console.log(
    await fetch("http://127.0.0.1:5000/user", {
      method: "POST",
      body: formData,
    })
  );*/

  let response = {
    user_id: 1,
    username: "johndoe",
  };
  const cookieStore = await cookies();
  cookieStore.set("userID", response.user_id.toString());
  redirect("/problem/26");
};
export default function Login() {
  return (
    <form
      action={formAction}
      className="flex flex-col items-center justify-center h-screen bg-[white]"
    >
      <Image src={Icon} width={100} height={100} alt="Title Icon" />
      <div className="flex flex-col mb-[5px]">
        <label className="mb-[.3rem] text-[.9rem] text-[#05060f99] font-bold hover:text-[#05060fc2]">
          Username:
        </label>
        <input
          className="w-[512px] text-[#05060fc2] border-2 border-transparent border rounded-lg h-[44px] bg-[#05060f0a] p-3 hover:border-[#05060fc2] focus:border-[#05060fc2] focus:outline-none"
          type="text"
          name="username"
          placeholder="Enter username"
        />
      </div>
      <button className="cursor-pointer w-[512px] rounded-lg mt-[20px] relative px-10 py-3.5 overflow-hidden group bg-gradient-to-r from-gray-700 to-black relative hover:bg-gradient-to-r hover:from-gray-600 hover:to-black text-white transition-all ease-out duration-300">
        <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-36 ease"></span>
        <span className="relative text-xl font-semibold">Login</span>
      </button>
    </form>
  );
}
