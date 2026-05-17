import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { ProfilePage } from "./pages/profile/profile-page";
import { SidebarLeft } from "./components/sidebar-left/sidebar-left";
import { SidebarRight } from "./components/sidebar-right/sidebar-right";
import { Home } from "./pages/home/home";
import { NewsPage } from "./pages/news-details/news-page";
import { AddNewsPage } from "./pages/add-news/add-news-page"; 
import { EditNewsPage } from "./pages/edit-news-page/edit-news-page";
import styles from "./app.module.css";

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation(); // ТЕПЕР ВІН ПРАЦЮЄ!

  // Перевірка: ми на головній?
  const isHomePage = location.pathname === '/';

  return (
    <div className={styles.appWrapper}>
      <Header user={user} setUser={setUser} />

      <div className={styles.mainLayout}>
        <aside className={styles.sidebarLeft}>
          <SidebarLeft />
        </aside>

        <main className={styles.contentCenter}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/news/:id" element={<NewsPage user={user} />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route
              path="/add-news"
              element={
                (user?.role === 'admin' || user?.role === 'author')
                  ? <AddNewsPage user={user} />
                  : <Home />
              }
            />
            <Route
              path="/edit-news/:id"
              element={
                (user?.role === 'admin' || user?.role === 'author')
                  ? <EditNewsPage user={user} />
                  : <Home user={user} />
              }
            />
          </Routes>
        </main>

        <aside className={styles.sidebarRight}>
          {/* ПЕРЕДАЄМО ПАРАМЕТР showTags ПРЯМО СЮДИ */}
          <SidebarRight user={user} showTags={isHomePage} />
        </aside>
      </div>
      <Footer />
    </div>
  );
}

// ГОЛОВНИЙ КОМПОНЕНТ ТЕПЕР ТІЛЬКИ ОБГОРТКА
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}