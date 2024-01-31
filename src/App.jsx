import { useState, useEffect, useRef  } from "react";
import "./App.css";
import dan from "../public/dan.png"

//custom hook
import { useFetch } from "./hooks/usefetch";

const url = "http://localhost:3000/products";

function App() {
  const [prod, setProd] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [action, setAction] = useState(false);

  const LetterInput = useRef(null);

  //custom hook
  const { data: itens, httpConfig, httpDelete, loading, error } = useFetch(url);

  //adição de produtos
  const handlesubmit = async (e) => {
    e.preventDefault();

    const product = {
      posi: itens.length + 1,
      name,
      price,
    };
    LetterInput.current.focus()
    //refatorando post
    httpConfig(product, "POST");

    setName("");
    setPrice("");
  };

  const handleEdit = async (IDprod) => {
    IDprod.preventDefault();
    setnewname("");
    setNewPrice("");

    // Criar um novo objeto com os mesmos valores de seleProd e um campo extra name
    const replace = () => ({
      ...seleProd,
      name: newname == "" ? seleProd.name : newname,
      price: newPrice == "" ? seleProd.price : newPrice,
    });

    console.log(newname);
    console.log(seleProd);
    console.log(replace().id);

    httpDelete(replace().id);
    httpConfig(replace(), "POST");
    setAction(false);
  };

  const handleDelete = async (productId) => {
    await httpDelete(productId);
  };

  const [seleProd, setSeleProd] = useState([]);
  const [newname, setnewname] = useState("");
  const [newPrice, setNewPrice] = useState("")

  const hhtpEdit = (IDprod) => {
    console.log("O id do produto é" + IDprod);

    const productToEdit = itens.find((product) => product.id === IDprod);
    setSeleProd(productToEdit);
  };

  return (
    <>
      <a href="https://github.com/danilosiq/product-registration-system" target="new"><img src={dan} alt="" /></a>
      {!error ? (
        <div className="ContainerApp">
          {loading && <p>Garregando</p>}
          {error && <p>{error}</p>}
          <h1>Lista de Produtos</h1>
          <ul>
            {itens &&
              itens
                .sort((a, b) => a.posi - b.posi)
                .map((produ) => (
                  <li key={produ.id}>
                    <p>
                      {produ.name} - R${produ.price}{" "}
                    </p>
                    <button
                      onClick={() => httpDelete(produ.id)}
                      className="Del"
                    >
                      Delete
                    </button>
                    <button
                      className="Edit"
                      onClick={() => {
                        hhtpEdit(produ.id);
                        setAction(true);
                      }}
                    >
                      Editar
                    </button>{" "}
                  </li>
                ))}
          </ul>

          <div className="CadProd">
            {!action && (
              <form onSubmit={handlesubmit} >
                <h2>Adicionar novo Item!</h2>
                <label htmlFor="">
                  Nome: <br />
                  <input
                    type="text"
                    value={name}
                    placeholder="Nome"
                    onChange={(e) => setName(e.target.value)}
                    className="TextCamp"
                    ref={LetterInput}
                  />
                </label>
                <label htmlFor="">
                  preço:
                  <br />
                  <input
                    type="number"
                    value={price}
                    placeholder="Nome"
                    onChange={(e) => setPrice(e.target.value)}
                    className="TextCamp"
                  />
                </label>
                {!loading && (
                  <input type="submit" value="criar!" className="nut" />
                )}
              </form>
            )}
            {action && (
              <form onSubmit={handleEdit}>
                <h2>Editar item</h2>
                <h3>Item selecionado: {seleProd.name}</h3>
                <label htmlFor="">
                  Novo Nome: <br />
                  <input
                    type="text"
                    value={newname}
                    onChange={(e) => setnewname(e.target.value)}
                    className="TextCamp"
                    placeholder={seleProd.name}
                  />
                </label>
                <label htmlFor="">
                  Novo Preço: <br />
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="TextCamp"
                    placeholder={seleProd.price}
                  />
                </label>
                <input type="submit" value="Confirmar" className="nut" />
              </form>
            )}
            {action && (
              <button onClick={() => setAction(false)} className="sair">
                Cancelar
              </button>
            )}
          </div>
        </div>
      ) : (
        "Houve um erro!"
      )}
    </>
  );
}

export default App;
