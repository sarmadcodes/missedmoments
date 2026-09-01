/**
 * Cap on the OS font-scale multiplier.
 *
 * The design uses small labels (9-12px) inside fixed-height controls, so an
 * unbounded system font scale overflows them. Clamping keeps large-text
 * settings usable without breaking the layout; pass it to <Text> and
 * <TextInput> via `maxFontSizeMultiplier`.
 */
export const MAX_FONT_SCALE = 1.25;
