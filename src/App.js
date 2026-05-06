import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { ProfilePage } from "./pages/profile/profile-page";
import { SidebarLeft } from "./components/sidebar-left/sidebar-left";
import { SidebarRight } from "./components/sidebar-right/sidebar-right";
import { Home } from "./pages/home/home";
import { NewsPage } from "./pages/news-details/news-page";
import { AddNewsPage } from "./pages/add-news/add-news-page"; // Наша нова сторінка
import styles from "./app.module.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className={styles.appWrapper}>
        {/* Хедер тепер просто знає про користувача */}
        <Header user={user} setUser={setUser} />

        <div className={styles.mainLayout}>

          <aside className={styles.sidebarLeft}>
            <SidebarLeft />
          </aside>

          <main className={styles.contentCenter}>
            <Routes>
              {/* Головна сторінка зі стрічкою новин */}
              <Route path="/" element={<Home />} />

              {/* Сторінка однієї новини */}
              <Route path="/news/:id" element={<NewsPage user={user} />} />

              {/* Сторінка профілю */}
              <Route path="/profile" element={<ProfilePage user={user} />} />

              {/* НОВИЙ МАРШРУТ: Окрема сторінка створення новини */}
              {/* Додаємо перевірку прав прямо тут для безпеки роутингу */}
              <Route
                path="/add-news"
                element={
                  (user?.role === 'admin' || user?.role === 'author')
                    ? <AddNewsPage user={user} />
                    : <Home /> // Якщо прав немає, повертаємо на головну
                }
              />
            </Routes>
          </main>

          <aside className={styles.sidebarRight}>
            <SidebarRight user={user} />
          </aside>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
