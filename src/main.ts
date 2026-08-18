/**
 * DEMO APP — shows how to wire the Ponytail Pro Max library together.
 * Delete everything in this file and start fresh for your competition.
 * Keep the patterns: landmark HTML, aria labels, error handling, loading state.
 */

import './lib/style.css';
import { createState } from './lib/state';
import { createStore } from './lib/storage';
import { escapeHtml } from './lib/render';
import { openModal, announce } from './lib/a11y';
import { $, html } from './lib/dom';
import { isString, isNumber } from './lib/validate';

// --- Types ---
interface DemoItem {
  id: string;
  name: string;
  done: boolean;
  createdAt: number;
}

// --- Storage ---
function isItem(v: unknown): v is DemoItem {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    isString(o.id) &&
    isString(o.name) &&
    typeof o.done === 'boolean' &&
    isNumber(o.createdAt)
  );
}

const store = createStore<DemoItem>('demo:v1', isItem);

// --- State ---
const { getState, setState } = createState({
  items: [] as DemoItem[],
  loading: false,
  error: null as string | null,
});

const root = $('#app');

// --- Render ---
function render(): void {
  if (!root) return;
  const { items, error } = getState();

  root.innerHTML = `
    <div class="app">
      <header aria-label="Page header">
        <h1>Ponytail Pro Max</h1>
        <p>Battle-tested template. Delete this demo and build your app.</p>
      </header>

      <main aria-label="Main content">
        ${error ? `<div class="error-banner" role="alert"><span>${escapeHtml(error)}</span><button class="error-banner__close" data-action="dismiss-error" aria-label="Dismiss">×</button></div>` : ''}

        <form id="add-form" aria-label="Add item">
          <div class="field">
            <label for="item-name">Name</label>
            <input id="item-name" name="name" type="text" required placeholder="Item name" class="input" />
          </div>
          <button type="submit" class="btn btn--primary">Add</button>
        </form>

        <ul aria-label="Items list">
          ${items.map(item => `
            <li data-id="${item.id}">
              <input type="checkbox" ${item.done ? 'checked' : ''} data-action="toggle" data-id="${item.id}" aria-label="Mark ${escapeHtml(item.name)} done" />
              <span>${escapeHtml(item.name)}</span>
              <button class="btn btn--ghost btn--danger" data-action="delete" data-id="${item.id}" aria-label="Delete ${escapeHtml(item.name)}">Delete</button>
            </li>
          `).join('')}
        </ul>

        ${items.length === 0 ? '<div class="empty">No items yet. Add one above.</div>' : ''}

        <div class="toast-container" aria-live="polite"></div>
        <div class="loading-overlay" ${getState().loading ? '' : 'hidden'}>
          <div class="loading-overlay__spinner" aria-hidden="true"></div>
          <p>Loading…</p>
        </div>
      </main>
    </div>
  `;
}

// --- Actions ---
function persist(): void {
  const result = store.save(getState().items);
  if (!result.ok) {
    setState({ error: result.error ?? 'Save failed.' });
  }
}

function addItem(name: string): void {
  const item: DemoItem = { id: crypto.randomUUID(), name, done: false, createdAt: Date.now() };
  setState(s => ({ items: [item, ...s.items] }));
  persist();
  announce('Item added.');
  render();
}

function toggleItem(id: string): void {
  setState(s => ({ items: s.items.map(i => i.id === id ? { ...i, done: !i.done } : i) }));
  persist();
  render();
}

function deleteItem(id: string): void {
  const trigger = $(`[data-action="delete"][data-id="${id}"]`);
  const modal = html('div', `<div class="modal-backdrop" role="dialog" aria-modal="true"><div class="modal"><h2>Delete item?</h2><p>This can't be undone.</p><button class="btn btn--ghost" id="modal-cancel">Cancel</button> <button class="btn btn--danger" id="modal-confirm">Delete</button></div></div>`);
  document.body.appendChild(modal);
  const close = openModal(modal, trigger, { initialFocus: '#modal-cancel' });

  $('#modal-cancel')?.addEventListener('click', () => { modal.remove(); close(); });
  $('#modal-confirm')?.addEventListener('click', () => {
    setState(s => ({ items: s.items.filter(i => i.id !== id) }));
    persist();
    modal.remove();
    close();
    announce('Item deleted.');
    render();
  });
}

// --- Events ---
function bindEvents(): void {
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLElement;
    if (form.id === 'add-form') {
      e.preventDefault();
      const input = $('#item-name') as HTMLInputElement;
      if (input.value.trim()) {
        addItem(input.value.trim());
        input.value = '';
      }
    }
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const action = target.closest('[data-action]') as HTMLElement | null;
    if (!action) return;

    const act = action.dataset.action;
    const id = action.dataset.id;
    if (act === 'dismiss-error') { setState({ error: null }); render(); }
    else if (act === 'delete' && id) deleteItem(id);
  });

  document.addEventListener('change', (e) => {
    const target = e.target as HTMLElement;
    if (target.dataset.action === 'toggle' && target.dataset.id) {
      toggleItem(target.dataset.id);
    }
  });
}

// --- Boot ---
function boot(): void {
  if (!root) return;
  setState({ loading: true });
  render();

  setTimeout(() => {
    const result = store.load();
    setState({ items: result.data, loading: false });
    if (!result.ok && result.error) {
      setState({ error: result.error });
    } else if (result.error) {
      announce(result.error);
    }
    bindEvents();
    render();
  }, 200);
}

boot();
