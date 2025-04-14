// src/components/ui/__test__/fonts.test.js
import * as fonts from "../fonts";

describe("Fonts Module", () => {
  it("exports all the different font options", () => {
    // Check for all numbered font exports
    expect(fonts._1).toBeDefined();
    expect(fonts._2).toBeDefined();
    expect(fonts._3).toBeDefined();
    expect(fonts._4).toBeDefined();
    expect(fonts._5).toBeDefined();
    expect(fonts._6).toBeDefined();
    expect(fonts._7).toBeDefined();
    expect(fonts._8).toBeDefined();
    expect(fonts._9).toBeDefined();
    expect(fonts._10).toBeDefined();
    expect(fonts._11).toBeDefined();
    expect(fonts._12).toBeDefined();
    expect(fonts._13).toBeDefined();
    expect(fonts._14).toBeDefined();
  });

  it("exports an activeFont", () => {
    expect(fonts.activeFont).toBeDefined();
  });

  it("sets activeFont to the Josefin_Sans font by default", () => {
    // The active font should be the first one (_1)
    expect(fonts.activeFont).toBe(fonts._1);
  });

  it("configures each font with the correct options", () => {
    // Check that fonts are configured with the correct properties
    // Note: We can't fully test the font objects as they're created by Next.js font functions,
    // but we can check they have some expected properties

    const fontKeys = Object.keys(fonts).filter((key) => key.startsWith("_"));

    fontKeys.forEach((key) => {
      const font = fonts[key];

      // Each font should have a className property at minimum
      expect(font).toHaveProperty("className");

      // The className should be a string
      expect(typeof font.className).toBe("string");
    });
  });
});
