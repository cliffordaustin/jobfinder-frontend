import Navbar from "../components/Navbar/Primary";
import Hero from "../components/HeroSection/Header";
import Form from "../components/Home/Form";
import Footer from "../components/Footer";
import Main from "../components/Main";
import { getUserProfile } from "@/actions/userProfile";

export default async function Home() {
  const user = await getUserProfile();

  return (
    <main className="relative">
      <Navbar user={user?.[0]}></Navbar>
      <Hero></Hero>

      <Main></Main>

      <div className="absolute -z-10 blur-3xl top-[150px] left-[200px] rounded-full w-[500px] h-[500px] bg-pink-500 bg-opacity-30"></div>
      <div className="absolute -z-10 blur-3xl top-[150px] right-[200px] rounded-full w-[500px] h-[500px] bg-purple-500 bg-opacity-30"></div>
      <div className="max-w-[550px] mx-auto px-8 border-b border-gray-200 md:border-none md:my-20">
        <Form login={true}></Form>
      </div>
      <div>
        <Footer></Footer>
      </div>
    </main>
  );
}
