import { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Editor from './pages/Editor';
import Profile from './pages/Profile';
import Callback from './pages/Callback';

function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf     = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.left = `${e.clientX}px`;
      dot.style.top  = `${e.clientY}px`;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);
      ring.style.left = `${ringPos.current.x}px`;
      ring.style.top  = `${ringPos.current.y}px`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const onEnter = (e) => {
      if (e.target.closest('a,button,[role="button"],input,textarea,select,label')) {
        ring.classList.add('hovering');
        dot.style.transform = 'translate(-50%,-50%) scale(1.8)';
      }
    };
    const onLeave = (e) => {
      if (e.target.closest('a,button,[role="button"],input,textarea,select,label')) {
        ring.classList.remove('hovering');
        dot.style.transform = 'translate(-50%,-50%) scale(1)';
      }
    };
    const onOut = () => { dot.classList.add('hidden'); ring.classList.add('hidden'); };
    const onIn  = () => { dot.classList.remove('hidden'); ring.classList.remove('hidden'); };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);
    document.addEventListener('mouseleave', onOut);
    document.addEventListener('mouseenter', onIn);

    return () => {
      cancelAnimationFrame(raf.current);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      document.removeEventListener('mouseleave', onOut);
      document.removeEventListener('mouseenter', onIn);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

export default function App() {
  return (
    <>
      <Cursor />
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/:username" element={<Profile />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </>
  );
}
