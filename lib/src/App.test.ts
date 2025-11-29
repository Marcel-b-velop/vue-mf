import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import Confirm from "./components/Confirm.vue";
import { apiClient } from "./services/apiClient";
import type { ConfirmData } from "./stores/confirmStore";

// Mock des apiClient
vi.mock("./services/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("App - Confirm Dialog", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("sollte einen Dialog mit Tabelle anzeigen, wenn der Confirm-Button geklickt wird", async () => {
    // Mock-Daten für die API
    const mockData: ConfirmData[] = [
      { id: 1, name: "Test Kunde 1" },
      { id: 2, name: "Test Kunde 2" },
    ];

    vi.mocked(apiClient.get).mockResolvedValue(mockData);

    // App-Komponente mit PrimeVue und Pinia mounten
    const wrapper = mount(App, {
      global: {
        plugins: [PrimeVue, createPinia()],
      },
    });

    // Prüfen, dass der Button vorhanden ist
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain("Open da Confirm");

    // Prüfen, dass die Confirm-Komponente vorhanden ist
    const confirmComponent = wrapper.findComponent(Confirm);
    expect(confirmComponent.exists()).toBe(true);

    // Prüfen, dass der Dialog initial nicht sichtbar ist (visible sollte false sein)
    expect(confirmComponent.props("visible")).toBe(false);

    // Button klicken
    await button.trigger("click");
    await wrapper.vm.$nextTick();

    // Prüfen, dass visible jetzt true ist
    expect(confirmComponent.props("visible")).toBe(true);

    // Warten auf async onMounted in Confirm-Komponente
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Prüfen, dass die Confirm-Komponente jetzt gerendert wurde
    // PrimeVue Dialog rendert oft per Teleport, daher prüfen wir im document.body
    await wrapper.vm.$nextTick();
    
    // Suche nach Dialog im gesamten Dokument (auch außerhalb des Wrappers)
    const dialog = document.querySelector('.p-dialog') || document.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();

    // Prüfen, dass die Tabelle vorhanden ist
    const table = document.querySelector('table') || wrapper.find('table');
    expect(table).toBeTruthy();

    // Prüfen, dass die Tabellen-Header vorhanden sind
    const headers = document.querySelectorAll('th');
    expect(headers.length).toBeGreaterThan(0);
    
    // Prüfen, dass die Spalten "Id" und "Name" vorhanden sind
    const headerTexts = Array.from(headers).map((h) => h.textContent?.trim());
    expect(headerTexts).toContain("Id");
    expect(headerTexts).toContain("Name");
  });

});

