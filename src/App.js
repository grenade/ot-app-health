import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import ApplicationList from './ApplicationList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ApplicationList />,
  },
]);

const App = () => {
  return (
    <Container>
      <RouterProvider router={router} />
    </Container>
  );
}

export default App;
