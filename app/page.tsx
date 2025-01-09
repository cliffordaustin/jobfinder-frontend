import Navbar from "../components/Navbar/Primary";
import Hero from "../components/HeroSection/Header";
import Form from "../components/Home/Form";
import Footer from "../components/Footer";
import Main from "../components/Main";
import { getUserProfile } from "@/actions/userProfile";
import MobileNavbar from "@/components/Navbar/Mobile";

export default async function Home() {
  const user = await getUserProfile();

  return (
    <main className="relative overflow-x-hidden">
      <div className="md:hidden">
        <MobileNavbar user={user?.[0]}></MobileNavbar>
      </div>
      <div className="hidden md:block">
        <Navbar user={user?.[0]}></Navbar>
      </div>

      <Hero></Hero>

      <Main></Main>

      <div className="absolute -z-10 blur-3xl top-[150px] left-[200px] rounded-full w-[500px] h-[500px] bg-pink-500 bg-opacity-30"></div>
      <div className="absolute -z-10 blur-3xl top-[150px] right-[200px] rounded-full w-[500px] h-[500px] bg-purple-500 bg-opacity-30"></div>
      <div className="max-w-[550px] mx-auto px-6 my-10 md:my-20">
        <Form login={true}></Form>
      </div>
      <div>
        <Footer></Footer>
      </div>
    </main>
  );
}
