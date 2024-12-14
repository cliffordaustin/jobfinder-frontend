import Form from "@/components/Home/Form";
import NavbarComponent from "@/components/Navbar/Primary";
import React from "react";

function Login() {
  return (
    <div>
      <NavbarComponent></NavbarComponent>
      <div className="w-[500px] mx-auto mt-8">
        <Form login={true}></Form>
      </div>
    </div>
  );
}

export default Login;
