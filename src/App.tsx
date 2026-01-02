import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ListProvider } from './context/ListContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';

import MovieDetails from './pages/MovieDetails';

import Movies from './pages/Movies';
import Anime from './pages/Anime';

import MyList from './pages/MyList';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Genres from './pages/Genres';
import WebSeries from './pages/WebSeries';
import Dramas from './pages/Dramas';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <ListProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/web-series" element={<WebSeries />} />
              <Route path="/dramas" element={<Dramas />} />

              <Route path="/mylist" element={<MyList />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/tv/:id" element={<MovieDetails />} />
            </Routes>
          </Layout>
        </Router>
      </ListProvider>
    </AuthProvider>
  );
}

export default App;
