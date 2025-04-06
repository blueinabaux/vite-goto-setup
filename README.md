# ⚡ vite-goto-setup

> 🛠️ Effortlessly scaffold essential folders and boilerplate in your Vite + React project with one command.

---

## 📦 What It Does

`vite-goto-setup` sets up your Vite project by:
- 📁 Creating essential folders: `Layout`, `Components`, and `Pages`
- 📄 Generating a basic `Layout.jsx` file with `react-router-dom`
- 🔧 Overwriting `main.jsx` with a router-ready template
- 🧩 Optionally installing useful packages like:
  - `axios`
  - `react-router-dom`
  - `react-icons`

---

## 🚀 Getting Started

### ✅ Prerequisites

- A [Vite](https://vitejs.dev/) project initialized with **React** template.
- Node.js installed (`v14+` recommended)

<!-- ### 💻 Installation -->

## 🚀 How to Use vite-goto-setup

Follow these steps to quickly scaffold your Vite + React project structure with `vite-goto-setup`.

---

### 🧩 Step 1: Install the package

You can install it locally using:

```bash
npm install vite-goto-setup
```
### ⚙️ Step 2: Run the CLI

Once installed (or with `npx`), run the following command inside the root of your **Vite + React** project:

```bash
npx vite-goto-setup
```

### 📁 Step 3: Folder & File Generation

The CLI will automatically:

- 📂 Create the following folders inside your `src/` directory:
  - `Layout/`
  - `Components/`
  - `Pages/`

- 📄 Generate a `Layout.jsx` file with a basic `<Outlet />` and layout structure.

- ⚙️ Overwrite your existing `main.jsx` with routing logic using `react-router-dom`.

### 📦 Step 4: Install Optional Dependencies

The CLI will ask you which packages you'd like to install from:

- `axios`
- `react-router-dom`
- `react-icons`

Simply use the **spacebar** to select/deselect during the prompt and hit **Enter** to confirm your choices.

### ✅ Step 5: You're All Set!

Now you can start your development server with:
```bash
npm run dev
```


## ✍️ Author

Made with ❤️ by [Neel](https://github.com/blueinabaux)

If you liked this package, consider giving it a ⭐ on [GitHub](https://github.com/blueinabaux/vite-goto-setup) and sharing it with your friends!


## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check the [issues page](https://github.com/blueinabaux/vite-goto-setup/issues) or submit a [pull request](https://github.com/blueinabaux/vite-goto-setup/pulls).

---




