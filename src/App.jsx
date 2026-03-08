import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Profile from './pages/Profile';
import Callback from './pages/Callback';

export default function App() {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/:username" element={<Profile />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}
