# 🔷 Sistema Modular de Formas 3D con Three.js + TWEEN  
Simulación interactiva donde un cubo compuesto por 27 mini-cubos puede transformarse en múltiples figuras: esfera, espiral, onda, ADN realista y ADN cartoon.  

Proyecto realizado por **Jesús Alberto Ortega Hernández**.

---

##  Vista previa y demostraciones

**Vídeo de demostración:** [https://youtu.be/c-0Mt5mwIk8](https://youtu.be/7anwPKw44ng)  
**Versión online (CodeSandbox):** [https://codesandbox.io/p/sandbox/loving-satoshi-y6zmm2](https://codesandbox.io/p/sandbox/loving-satoshi-y6zmm2) 

---

# Descripción general
Este proyecto muestra un sistema modular 3D en el que un cubo 3×3×3 puede reorganizarse en varias formas mediante animaciones procedurales. Las transformaciones se basan en operaciones matemáticas (seno, coseno, coordenadas esféricas) y transiciones suaves controladas con TWEEN.js.

Las formas generadas son:

- Cubo original  
- Esfera distribuida uniformemente  
- Espiral helicoidal  
- Onda sinusoidal tridimensional  
- ADN realista (doble hélice)  
- ADN cartoon  

---

# Tecnologías utilizadas
- Three.js  
- TWEEN.js  
- OrbitControls  
- JavaScript ES6  

---

# Variables globales
El sistema define las estructuras necesarias para:

- Controlar la escena, cámara y renderizado  
- Almacenar cada mini-cubo del sistema  
- Guardar la posición original de cada pieza  
- Gestionar el estado o modo de transformación  
- Controlar animaciones globales y transiciones  

---

# Código esencial y cómo construye el sistema

## Creación del cubo modular 3×3×3
```js
cube.position.set(x, y, z);
cube.userData.home = cube.position.clone();
cubes.push(cube);
group.add(cube);
```
**`cube.position.set(x, y, z);`**  
Coloca cada mini-cubo en su posición correspondiente dentro de la grilla 3×3×3.  
Esto forma el cubo inicial, que actúa como base para todas las transformaciones posteriores.

**`cube.userData.home = cube.position.clone();`**  
Guarda la posición original del cubo.  
Es fundamental para poder volver al modo “cubo” desde cualquier forma (esfera, espiral, ADN, etc.).

**`cubes.push(cube);`**  
Añade el cubo al array global `cubes[]`, lo cual permite manipularlos de manera individual en las transformaciones.

**`group.add(cube);`**  
Añade el cubo al grupo principal, permitiendo moverlos a todos como una sola entidad (rotación, animación global).
---

##  Animación global del sistema

Este bloque define la animación base que afecta continuamente a todos los cubos del proyecto, independientemente de la forma activa:

```js
group.rotation.y += 0.002;
c.scale.set(s, s, s);
c.material.color.setHSL(hue, 0.7, 0.5);
```
### Explicación dentro del contexto del proyecto

**`group.rotation.y += 0.002;`**  
El grupo que contiene los 27 cubos rota lentamente sobre el eje Y.  
Esto permite que cualquier forma (esfera, espiral, onda, ADN…) pueda verse desde todos los ángulos sin que el usuario mueva la cámara, haciendo que la visualización sea dinámica, fluida y siempre atractiva.

**`c.scale.set(s, s, s);`**  
Cada cubo individual cambia ligeramente su tamaño usando el valor `s`, que se calcula mediante una función seno dependiente del tiempo y del índice del cubo.  
Esto genera un efecto de “respiración” o pulsación, haciendo que la estructura parezca viva y evitando que se vea rígida o estática.

**`c.material.color.setHSL(hue, 0.7, 0.5);`**  
Cada cubo cambia de color con un matiz (`hue`) que avanza continuamente en el espectro HSL.  
Con ello se consigue un degradado animado que aporta dinamismo visual y hace que todas las formas resulten más llamativas y expresivas.

**En conjunto**, estas tres líneas proporcionan el movimiento, la pulsación y la variación cromática que mantienen el sistema activo incluso cuando no está cambiando de forma.  
Gracias a esto, el proyecto nunca se ve estático o vacío, reforzando el carácter visual y dinámico de todas las transformaciones.

---

### Creación del cubo modular 3×3×3

```js
cube.position.set(x, y, z);
cube.userData.home = cube.position.clone();
cubes.push(cube);
group.add(cube);
```
**`cube.position.set(x, y, z);`**  
Coloca cada mini-cubo en su posición correspondiente dentro de la grilla 3×3×3.  
Esto forma el cubo inicial, que actúa como base para todas las transformaciones posteriores.

**`cube.userData.home = cube.position.clone();`**  
Guarda la posición original del cubo.  
Es fundamental para poder volver al modo “cubo” desde cualquier forma.

**`cubes.push(cube);`**  
Añade el cubo al array global `cubes[]`, lo cual permite manipularlos de manera individual en las transformaciones.

**`group.add(cube);`**  
Añade el cubo al grupo principal, permitiendo moverlos a todos como una sola entidad (rotación, animación global).


---

### Transformación en esfera

```js
phi = Math.acos(2 * (i / cubes.length) - 1);
theta = Math.sqrt(cubes.length * Math.PI) * phi;

target = {
  x: r * Math.sin(phi) * Math.cos(theta),
  y: r * Math.cos(phi),
  z: r * Math.sin(phi) * Math.sin(theta)
};
```

**`phi = Math.acos(2 * (i / cubes.length) - 1);`**  
Calcula el ángulo polar de manera uniforme usando una técnica de distribución esférica.  
Evita que los cubos se acumulen en los polos.

**`theta = Math.sqrt(cubes.length * Math.PI) * phi;`**  
Genera el ángulo azimutal distribuyendo los cubos de forma homogénea alrededor de la esfera.

**Coordenadas finales:**
**`x = r * Math.sin(phi) * Math.cos(theta)`**  
**`y = r * Math.cos(phi)`**  
**`z = r * Math.sin(phi) * Math.sin(theta)`**  
Definen la posición final del cubo en la superficie de una esfera.

Esta fórmula es crucial para obtener una esfera equilibrada y estéticamente agradable.

---
### Transformación en espiral helicoidal

```js
const a = i * 0.4;
const r = 0.6 * i;

target = {
  x: Math.cos(a) * r * 0.2,
  y: i * 0.15 - 2,
  z: Math.sin(a) * r * 0.2
};

```
**`const a = i * 0.4;`**  
Ángulo creciente que define la rotación de la hélice.

**`const r = 0.6 * i;`**  
Radio progresivo que expande la espiral hacia afuera.

**Coordenadas helicoidales:**
**`x = Math.cos(a) * r * 0.2`**  
**`y = i * 0.15 - 2`**  
**`z = Math.sin(a) * r * 0.2`**  

La combinación del ángulo creciente, el radio ascendente y la altura lineal crea una estructura helicoidal clara y armónica.

---

### Transformación en onda 3D

```js
target = {
  x: (i - 13) * step,
  y: Math.sin(i * freq) * amp,
  z: Math.cos(i * freq * 0.7) * amp * 0.5
};
```
**`x = (i - 13) * step;`**  
Distribuye los cubos de forma lineal a lo largo del eje X.

**`y = Math.sin(i * freq) * amp;`**  
El eje vertical oscila usando una función seno, creando la forma de onda.

**`z = Math.cos(i * freq * 0.7) * amp * 0.5;`**  
Un coseno suavizado desplaza ligeramente los cubos hacia adelante y atrás, añadiendo profundidad tridimensional.

Este bloque genera una serpiente u onda fluida con muy pocas operaciones matemáticas.

---

### Transformación en ADN realista

```js
helixIndex = i % 3;
t = i * 0.35;
height = (i - 13) * 0.18;

target = {
  x: Math.cos(t) * radius,
  y: height,
  z: Math.sin(t) * radius
};
```
**`const helixIndex = i % 3;`**  
Divide los cubos en tres grupos:  
- Hélice izquierda  
- Hélice derecha  
- Columna central  

**`t = i * 0.35;`**  
Define la fase de giro de cada cubo, generando la rotación helicoidal.

**`height = (i - 13) * 0.18;`**  
Subida lineal hacia arriba, formando el típico ascenso del ADN.

**Coordenadas helicoidales:**
**`x = Math.cos(t) * radius`**  
**`y = height`**  
**`z = Math.sin(t) * radius`**

Esto construye una doble hélice perfectamente reconocible y científicamente coherente.

---
### Transformación en ADN estilo cartoon
```js
type = i % 2 ? "red" : "blue";
t = index * k;

target = {
  x: type === "blue" ? Math.sin(t) : -Math.sin(t),
  y: Math.sin(t * 2) * 0.3,
  z: i * 0.25 - 3
};
```
**`type = i % 2 ? "red" : "blue";`**  
Alterna cada cubo entre azul y rojo, formando dos hebras visuales simples.

**`t = index * k;`**  
Define la fase del movimiento animado de cada hebra.

**Coordenadas animadas:**
**`x = ±Math.sin(t)`**  
Define la oscilación lateral.  
**`y = Math.sin(t * 2) * 0.3`**  
Genera ondulación vertical suave.  
**`z = i * 0.25 - 3`**  
Crea una hebra lineal extendida.

Este modo sacrifica realismo para priorizar claridad visual y estilo animado.
