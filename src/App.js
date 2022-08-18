import './App.css';
import { db } from "./firebase.config";
import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, addDoc, deleteDoc } from "firebase/firestore";

function App() {

  const [recipes, setRecipes] = useState([])
  const [form, setForm] = useState({
    title: "",
    desc: "",
    ingredients: [],
    steps: []
  })

  const [popupActive, setPopupActive] = useState(false)

  const recipesCollectionRef = collection(db, "recipes");

  useEffect(() => {
    onSnapshot(recipesCollectionRef, snapshot => {
      setRecipes(snapshot.docs.map(doc => {
        return {
          id: doc.id,
          viewing: false,
          ...doc.data()
        }
      }))
      console.log(snapshot)
    })
  }, []);

  const handleView = id => {
    const recipesClone = [...recipes]

    recipesClone.forEach(recipe => {
      if (recipe.id === id) {
        recipe.viewing = !recipe.viewing
      } else {
        recipe.viewing = false
      }
    })
    setRecipes(recipesClone)
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!form.title || !form.desc || !form.ingredients || !form.steps) {
      alert("Error...Llenar todos los campos")
      return
    }
    addDoc(recipesCollectionRef, form)

    setForm({
      title: "",
      desc: "",
      ingredients: [],
      steps: []
    })
    setPopupActive(false)
  }

  const handleIngredient = (e, i) => {
    const ingredientsClone = [...form.ingredients]

    ingredientsClone[i] = e.target.value

    setForm({
      ...form,
      ingredients: ingredientsClone
    })
  }

  const handleStep = (e, i) => {
    const stepsClone = [...form.steps]

    stepsClone[i] = e.target.value

    setForm({

      ...form,
      steps: stepsClone
    })
  }

  const handleIngredientCount = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, ""]
    })
  }

  const handleStepCount = () => {
    setForm({
      ...form,
      steps: [...form.steps, ""]
    })
  }

  const removeRecipe = id => {
    deleteDoc(doc(db, "recipes", id))
  }

  return (
    <div className="App">
      <h1>Mis Recetas</h1>

      <button onClick={() => setPopupActive(!popupActive)}>Añadir Recetas</button>

      <div className="recipes">
        {recipes.map((recipe, i) => (
          <div className='recipe' key={recipe.id}>
            <h3>{recipe.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: recipe.desc }}></p>
            {recipe.viewing && <div>
              <h4>Ingredientes</h4>
              <ul>
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
              <h4>Pasos</h4>
              <ol>
                {recipe.steps.map((step, i) => (
                  <li key={i}> {step}</li>
                ))}
              </ol>
            </div>}

            <div className='buttons'>
              <button onClick={() => handleView(recipe.id)}>View {recipe.viewing ? 'less' : 'more'}</button>
              <button onClick={() => removeRecipe(recipe.id)} className='remove'>Borrar Receta</button>
            </div>

          </div>
        ))}
      </div>

      {popupActive && <div className='popup'>
        <div className='popup-inner'>
          <h2>Agregar una Receta</h2>

          <form onSubmit={handleSubmit}>

            <div className='form-group'>
              <label>Titulo</label>
              <input type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className='form-group'>
              <label>Descripcion</label>
              <textarea
                type="text"
                value={form.desc}
                onChange={e => setForm({ ...form, desc: e.target.value })} />
            </div>

            <div className='form-group'>
              <label>Ingredientes</label>
              {
                form.ingredients.map((ingredient, i) => (
                  <input
                    type="text"
                    key={i}
                    value={ingredient}
                    onChange={e => handleIngredient(e, i)} />
                ))
              }
              <button type="button" onClick={handleIngredientCount}>Agregar un Ingrediente</button>
            </div>

            <div className='form-group'>
              <label>Pasos</label>
              {
                form.steps.map((step, i) => (
                  <textarea
                    type="text"
                    key={i}
                    value={step}
                    onChange={e => handleStep(e, i)} />
                ))
              }
              <button type="button" onClick={handleStepCount}>Agregar un paso</button>
            </div>

            <div className='buttons'>
              <button type="submit">Guardar</button>
              <button
                type="button"
                className='remove'
                onClick={() => setPopupActive(false)}
              >
                Cerrar
              </button>
            </div>

          </form>
        </div>
      </div>}
    </div>
  );
}

export default App;
