import { ChangeEvent, useState, useEffect } from "react";
import styles from "./App.module.css";

const host = "localhost";
const port = "3080";

const App = () => {
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [filters, setfilters] = useState({
    4771: false,
    123: false, // test
  });
  const [querys, setQuerys] = useState("");

  useEffect(() => {
    const arrayQuerys: string[] = [];
    Object.entries(filters).forEach(([key, value]) => {
      value && arrayQuerys.push(key);
    });
    setQuerys(arrayQuerys.toString());
  }, [filters]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleSendFile = () => {
    if (!file) {
      return;
    }
    setLoading(true);
    fetch(`http://${host}:${port}/api/automatic-filters?filters=${querys}`, {
      method: "POST",
      body: file,
    })
      .then((res) => console.log(res))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <h2 className={styles.title}>Filtros automáticos</h2>
      <h3 className={styles.subtitle}>
        Cliente: <strong>Contenidos (Área)</strong>
      </h3>
      <br />
      <form className={styles.form}>
        <div className={`${styles.file} ${file ? styles.fileSelected : ""}`}>
          <input
            className={styles.inputFile}
            type="file"
            name="file"
            id="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file" className={styles.textFile}>
            {file ? file.name : "Selecciona tu archivo"}
          </label>
        </div>
        <section>
          <h4>Selecciona filtros:</h4>
          <label htmlFor="" className={styles.inputCheck}>
            <input
              type="checkbox"
              name="filtersGroup"
              value="4771"
              checked={filters[4771]}
              onChange={() => setfilters({ ...filters, 4771: !filters[4771] })}
            />
            <span>Vendido por</span>
          </label>
          <label htmlFor="" className={styles.inputCheck}>
            <input
              type="checkbox"
              name="filtersGroup"
              value="123"
              checked={filters[123]}
              onChange={() => setfilters({ ...filters, 123: !filters[123] })}
            />
            <span>Test</span>
          </label>
        </section>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <button onClick={handleSendFile}>Enviar</button>
        )}
      </form>
    </>
  );
};

export default App;
