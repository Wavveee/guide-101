import { Header } from "./elements/header/header";
import { News } from "./elements/news/news";
import { Main } from "./elements/main/main";
import { useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Header user={user} setUser={setUser} />

      <News></News>

      <Main></Main>
    </>
  );
}

export default App;
