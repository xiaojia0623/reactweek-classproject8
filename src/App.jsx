import { RouterProvider } from "react-router-dom"
import router from "./router/index"
import Toast from "./components/Toast"
import "./assets/styles/all.scss"

function App() {

  return (
    <>
      <Toast />
      <RouterProvider router={router} />
    </>
  )
}

export default App
