import React, { useState, useEffect } from "react";
import { Mic, RotateCcw } from "lucide-react";


export default function App() {
const [productos, setProductos] = useState([]);
const [input, setInput] = useState("");
const [reconociendo, setReconociendo] = useState(false);


useEffect(() => {
const guardados = localStorage.getItem("productos");
if (guardados) setProductos(JSON.parse(guardados));
}, []);


useEffect(() => {
localStorage.setItem("productos", JSON.stringify(productos));
}, [productos]);


const agregarProducto = () => {
if (input.trim() === "") return;
setProductos([...productos, { nombre: input.trim().toLowerCase(), tachado: false }]);
setInput("");
};


const resetearLista = () => {
setProductos([]);
};


const toggleTachar = (index) => {
const copia = [...productos];
copia[index].tachado = !copia[index].tachado;
setProductos(copia);
};


const iniciarVoz = () => {
if (!("webkitSpeechRecognition" in window)) {
alert("Tu navegador no soporta reconocimiento de voz");
return;
}


const reconocimiento = new window.webkitSpeechRecognition();
reconocimiento.lang = "es-ES";
reconocimiento.continuous = false;
reconocimiento.interimResults = false;


reconocimiento.onstart = () => setReconociendo(true);
reconocimiento.onend = () => setReconociendo(false);


reconocimiento.onresult = (event) => {
const dicho = event.results[0][0].transcript.trim().toLowerCase();
const copia = [...productos];
copia.forEach((p) => {
if (dicho.includes(p.nombre)) {
p.tachado = true;
}
});
setProductos(copia);
};


reconocimiento.start();
};


return (
<div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center p-4 sm:p-6 md:p-8 lg:p-10">
<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-center text-green-900 drop-shadow-lg">🛒 Control de Mercadería El Nahuel</h1>


<div className="flex flex-col sm:flex-row gap-2 mb-6 w-full max-w-sm">
<input
type="text"
value={input}
onChange={(e) => setInput(e.target.value)}
placeholder="Agregar producto..."
className="px-4 py-3 rounded-2xl border border-green-400 shadow focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
/>
<button
onClick={agregarProducto}
className="bg-green-600 text-white px-6 py-3 rounded-2xl shadow hover:bg-green-700 transition w-full sm:w-auto"
>
Agregar
</button>
</div>


<div className="flex flex-col sm:flex-row gap-2 mb-8 w-full max-w-sm">
<button
onClick={iniciarVoz}
className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white w-full sm:w-auto transition-all shadow-lg ${
reconociendo ? "bg-red-500 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
}`}
>
<Mic size={22} /> {reconociendo ? "Escuchando..." : "Hablar"}
</button>


<button
onClick={resetearLista}
className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gray-600 text-white hover:bg-gray-700 transition shadow-lg w-full sm:w-auto"
>
<RotateCcw size={22} /> Resetear
</button>
</div>


<ul className="w-full max-w-sm space-y-3">
{productos.map((p, i) => (
<li
key={i}
onClick={() => toggleTachar(i)}
className={`cursor-pointer px-5 py-3 rounded-2xl flex justify-between items-center bg-white shadow-md transition transform hover:scale-105 ${
p.tachado ? "line-through text-gray-400 bg-gray-200" : "text-gray-800"
}`}
>
{p.nombre}
{p.tachado && <span className="text-sm font-bold text-green-600">✔</span>}
</li>
))}
</ul>
</div>
);
}