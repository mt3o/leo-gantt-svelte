import { mount } from 'svelte';
import './app.css';
import App from './lib/demo/App.svelte'; // Import the new demo component

const app = mount(App, { // Mount HeatmapDemo instead of App
  target: document.getElementById('app')!,
});

export default app;
