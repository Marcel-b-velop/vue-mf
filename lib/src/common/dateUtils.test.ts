import { describe, it, expect } from "vitest";
import { dateUtils } from "./dateUtils";

describe("dateUtils", () => {
  describe("formatDate", () => {
    it("sollte ein Datum im Format dd.MM.yyyy formatieren", () => {
      const date = new Date(2024, 0, 15); // 15. Januar 2024
      const result = dateUtils.formatDate(date);
      expect(result).toBe("15.01.2024");
    });

    it("sollte ein Datum mit führender Null formatieren", () => {
      const date = new Date(2024, 0, 5); // 5. Januar 2024
      const result = dateUtils.formatDate(date);
      expect(result).toBe("05.01.2024");
    });

    it("sollte ein Datum am Monatsende korrekt formatieren", () => {
      const date = new Date(2024, 11, 31); // 31. Dezember 2024
      const result = dateUtils.formatDate(date);
      expect(result).toBe("31.12.2024");
    });

    it("sollte ein Datum am Jahresanfang korrekt formatieren", () => {
      const date = new Date(2024, 0, 1); // 1. Januar 2024
      const result = dateUtils.formatDate(date);
      expect(result).toBe("01.01.2024");
    });

    it("sollte verschiedene Jahre korrekt formatieren", () => {
      const date1 = new Date(2023, 5, 20);
      const date2 = new Date(2025, 5, 20);
      
      expect(dateUtils.formatDate(date1)).toBe("20.06.2023");
      expect(dateUtils.formatDate(date2)).toBe("20.06.2025");
    });
  });
});

