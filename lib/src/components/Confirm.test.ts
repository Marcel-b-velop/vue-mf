import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
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
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("sollte einen Dialog mit Tabelle anzeigen, wenn visible true ist", async () => {
    // Mock-Daten für die API
    const mockData: ConfirmData[] = [
      { id: 1, name: "Test Kunde 1" },
      { id: 2, name: "Test Kunde 2" },
    ];

    vi.mocked(apiClient.get).mockResolvedValue(mockData);

    // Confirm-Komponente mit PrimeVue und Pinia mounten
    const wrapper = mount(Confirm, {
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

    const wrapper = mount(Confirm, {
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
});

