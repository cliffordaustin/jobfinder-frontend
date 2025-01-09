import Form from "@/components/Home/Form";
import NavbarComponent from "@/components/Navbar/Primary";
import React from "react";

function Login() {
  return (
    <div>
      <NavbarComponent></NavbarComponent>
      <div className="max-w-[450px] px-6 md:px-0 mx-auto my-8">
        <Form signup={true}></Form>
      </div>
    </div>
  );
}

export default Login;
