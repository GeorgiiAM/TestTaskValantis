import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout'
import NotFound from './components/NotFound/NotFound';


function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
