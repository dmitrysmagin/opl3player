import { mount } from 'svelte';
import App from './app.svelte';
import './styles.css';

const appContainer = document.getElementById('app');
if (appContainer) {
    mount(App, {
        target: appContainer,
    });
} else {
    console.error('App container not found');
}
