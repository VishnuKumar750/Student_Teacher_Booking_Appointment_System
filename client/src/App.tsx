import { useRoutes } from "react-router-dom";
import { AdminRoutes } from "./routes/adminRoutes.tsx";
import { TeacherRoutes } from "./routes/teacherRoutes.tsx";
import { PublicRoutes } from "./routes/publicRoutes.tsx";
import { StudentRoutes } from "./routes/studentRoutes.tsx";
import NotFound from "./features/NotFound.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppRoutes = () => {
  return useRoutes([
    ...AdminRoutes,
    ...TeacherRoutes,
    ...StudentRoutes,
    ...PublicRoutes,

    {
      path: "*",
      element: <NotFound />,
    },
  ]);
};

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

export default App;
