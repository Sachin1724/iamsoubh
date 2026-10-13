Odisha Festival Sticker Asset Collection — extracted assets
=============================================================

_contact_sheet.png   numbered map of every sprite (match the number to the filename index)
manifest.json         index number, file path, pixel box and category for every sprite

Folders (PNG, transparent background, original resolution, ~6px padding):
  floral-sprays/    12 files  — hibiscus / jasmine / marigold sprays, palm frond
  corner-borders/   19 files  — gold corner frames, small flower/leaf sprigs, diamond motif
  nature-temple/    12 files  — palm trees, bird, temple cluster, chariot, face icon,
                                 shell, drum, sweets plate, lamp, clouds, sun, sparkles
  vine-dividers/     5 files  — floral vine strips, diamond dividers, lotus divider
  leaf-strips/      20 files  — dotted/wave border strips, small flower rows, leaf strip,
                                 small accent pieces split off during extraction
  sticker-chips/     9 files  — speech-bubble and badge stickers, the price tag
  buttons-icons/    11 files  — Order Now / View What's Inside / stepper, trust icons,
                                 social icons

Known limitations:
  - A handful of multi-part sprays (e.g. a flower cluster with a separate leaf sprig a
    short distance away) were extracted as 2 pieces rather than 1. Check the contact
    sheet: items that look like they belong together but have different numbers can be
    recombined in a design tool if you want them as one layer.
  - One very small sprite failed to vectorize (too few pixels) and has no SVG equivalent.

extracted_svg/ (same folder structure, .svg instead of .png)
  Auto-traced with potrace, 4-6 flat colour layers per sprite. This flattens the
  painted shading into a simplified "sticker" style — it looks clean on simple pieces
  (UI chips, dividers, the sun, sparkles) and loses some fine linework on the more
  detailed painted pieces (flowers, the temple cluster). Treat these as a flat-vector
  starting point, not a pixel-perfect vector copy of the painting. For true
  production vectors of the detailed pieces, a manual redraw in Illustrator/Figma
  from the PNGs will look better than any auto-trace.
