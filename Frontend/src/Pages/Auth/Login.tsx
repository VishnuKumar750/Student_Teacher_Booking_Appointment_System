import AuthForm from "@/components/AuthForm"
import TeamIllus from '@/assets/TeamMeetIllustration.jpg';


const Login = () => {
  return (
    <div className="w-full min-h-svh flex flex-col lg:flex-row items-center justify-center p-6">
      <div className="w-full h-full ">
        <img src={TeamIllus} alt="some image"
            className="size-48 md:size-72 mx-auto lg:w-full lg:h-full  object-cover"
        />
      </div>
      <div className="w-full h-full flex flex-col items-center">
        <div className="my-4">
          <h1 className="text-5xl font-bold tracking-tight">EduBook</h1>
          <p className="text-gray-400 text-sm mb-4 tracking-tight">Dashboard for managing Appointments.</p>
        </div>
          <AuthForm /> 
      </div>
    </div>
  )
}

export default Login
