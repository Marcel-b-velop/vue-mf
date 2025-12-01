import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import PrimeVue from "primevue/config";
import Confirm from "./Confirm.vue";
import { apiClient } from "../services/apiClient";
import type { ConfirmData } from "../stores/confirmStore";

// Mock des apiClient
vi.mock("../services/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("Confirm Component", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    // DOM aufräumen vor jedem Test
    document.body.innerHTML = "";
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it("sollte einen Dialog mit Tabelle anzeigen, wenn visible true ist", async () => {
    // Mock-Daten für die API
    const mockData: ConfirmData[] = [
      { id: 1, name: "Test Kunde 1" },
      { id: 2, name: "Test Kunde 2" },
    ];

    vi.mocked(apiClient.get).mockResolvedValue(mockData);

    // Confirm-Komponente mit PrimeVue und Pinia mounten
    wrapper = mount(Confirm, {
      props: {
        visible: true,
      },
      global: {
        plugins: [PrimeVue, createPinia()],
      },
    });

    // Warten auf async onMounted
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Prüfen, dass der Dialog gerendert wurde
    const dialog = document.querySelector('.p-dialog') || document.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();

    // Prüfen, dass die Tabelle vorhanden ist
    const table = document.querySelector('table');
    expect(table).toBeTruthy();

    // Prüfen, dass die Tabellen-Header vorhanden sind
    const headers = document.querySelectorAll('th');
    expect(headers.length).toBeGreaterThan(0);
    
    // Prüfen, dass die Spalten "Id" und "Name" vorhanden sind
    const headerTexts = Array.from(headers).map((h) => h.textContent?.trim());
    expect(headerTexts).toContain("Id");
    expect(headerTexts).toContain("Name");
  });

  it("sollte die Tabelle mit Daten aus dem Store anzeigen", async () => {
    const mockData: ConfirmData[] = [
      { id: 1, name: "Test Kunde 1" },
      { id: 2, name: "Test Kunde 2" },
      { id: 3, name: "Test Kunde 3" },
    ];

    vi.mocked(apiClient.get).mockResolvedValue(mockData);

    wrapper = mount(Confirm, {
      props: {
        visible: true,
      },
      global: {
        plugins: [PrimeVue, createPinia()],
      },
    });

    // Warten auf async onMounted
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Prüfen, dass die Tabelle vorhanden ist
    const table = document.querySelector('table');
    expect(table).toBeTruthy();

    // Prüfen, dass Tabellenzellen vorhanden sind
    const cells = document.querySelectorAll('td');
    expect(cells.length).toBeGreaterThan(0);
  });

  it("sollte Vorselektion anwenden wenn modelValue übergeben wird", async () => {
    const mockData: ConfirmData[] = [
      { id: 1, name: "Test Kunde 1" },
      { id: 2, name: "Test Kunde 2" },
      { id: 3, name: "Test Kunde 3" },
    ];

    vi.mocked(apiClient.get).mockResolvedValue(mockData);

    wrapper = mount(Confirm, {
      props: {
        visible: true,
        modelValue: ["1", "3"], // Vorselektion: ID 1 und 3
      },
      global: {
        plugins: [PrimeVue, createPinia()],
      },
    });

    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Prüfen, dass 2 Zeilen selektiert sind (Checkboxen)
    const selectedRows = document.querySelectorAll('tr.p-datatable-row-selected, tr[data-p-selected="true"]');
    expect(selectedRows.length).toBe(2);
  });

  it("sollte ohne Vorselektion keine Zeilen selektieren", async () => {
    const mockData: ConfirmData[] = [
      { id: 1, name: "Test Kunde 1" },
      { id: 2, name: "Test Kunde 2" },
    ];

    vi.mocked(apiClient.get).mockResolvedValue(mockData);

    wrapper = mount(Confirm, {
      props: {
        visible: true,
        // Kein modelValue übergeben
      },
      global: {
        plugins: [PrimeVue, createPinia()],
      },
    });

    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 200));

    const selectedRows = document.querySelectorAll('tr.p-datatable-row-selected, tr[data-p-selected="true"]');
    expect(selectedRows.length).toBe(0);
  });

  it("sollte beim Speichern das modelValue mit selektierten IDs aktualisieren", async () => {
    const mockData: ConfirmData[] = [
      { id: 1, name: "Test Kunde 1" },
      { id: 2, name: "Test Kunde 2" },
    ];

    vi.mocked(apiClient.get).mockResolvedValue(mockData);

    wrapper = mount(Confirm, {
      props: {
        visible: true,
        modelValue: ["1"],
      },
      global: {
        plugins: [PrimeVue, createPinia()],
      },
    });

    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Save-Button über document.body finden (PrimeVue teleportiert den Dialog)
    const buttons = Array.from(document.querySelectorAll('button'));
    const saveButton = buttons.find(b => b.textContent?.includes('Save'));
    expect(saveButton).toBeDefined();
    
    saveButton?.click();
    await wrapper.vm.$nextTick();

    // Prüfen, dass update:modelValue emittiert wurde
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted).toHaveLength(1);
    expect(emitted?.[0]?.[0]).toEqual(["1"]);
  });

  it("sollte saved Event mit den selektierten Daten emittieren", async () => {
    const mockData: ConfirmData[] = [
      { id: 1, name: "Test Kunde 1" },
      { id: 2, name: "Test Kunde 2" },
    ];

    vi.mocked(apiClient.get).mockResolvedValue(mockData);

    wrapper = mount(Confirm, {
      props: {
        visible: true,
        modelValue: ["2"],
      },
      global: {
        plugins: [PrimeVue, createPinia()],
      },
    });

    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Save-Button über document.body finden (PrimeVue teleportiert den Dialog)
    const buttons = Array.from(document.querySelectorAll('button'));
    const saveButton = buttons.find(b => b.textContent?.includes('Save'));
    expect(saveButton).toBeDefined();
    
    saveButton?.click();
    await wrapper.vm.$nextTick();

    // Prüfen, dass saved Event emittiert wurde
    const savedEmitted = wrapper.emitted('saved');
    expect(savedEmitted).toBeTruthy();
    expect(savedEmitted).toHaveLength(1);
    expect(savedEmitted?.[0]?.[0]).toEqual([{ id: 2, name: "Test Kunde 2" }]);
  });
});

