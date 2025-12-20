import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LoginForm from "./Form/LoginForm";
import RegisterForm from "./Form/RegisterForm";

const TabLayout = () => {
  return (
    <Tabs defaultValue="login" className="w-full sm:w-md md:w-lg ">
      
      {/* Tabs */}
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      {/* Login Form */}
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>

      {/* Register Form */}
      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>

    </Tabs>
  );
};

export default TabLayout;
