# Design system: Dark Professional Cybersecurity

The same identity is used in the presentation and the learning module. Values below were taken from the final files (`web-module/source/src/styles.css` and the deck's theme), not from the original design brief.

## Principles

- Professional, enterprise cybersecurity appearance, not a gaming interface.
- Dark backgrounds throughout; no neon colors and no glow effects.
- Readable typography and strong contrast.
- Subtle 1 px borders, generous spacing, clear hierarchy.
- Blue and cyan used sparingly, for structure and interaction only.
- **Muted red is reserved for suspicious indicators, warnings and unsafe outcomes.** It is never decorative.

## Color palette

| Token | Name | Hex | Used for |
|---|---|---|---|
| `--bg` | Deep Navy | `#101820` | Primary background |
| `--panel` | Slate Navy | `#1B2838` | Cards and secondary surfaces |
| `--blue` | Muted Blue | `#3B82A0` | Primary accent: progress fills, selected states, button borders |
| `--cyan` | Soft Cyan | `#75A9B8` | Secondary accent: labels, links, focus ring |
| `--text` | Off White | `#E6EAF0` | Main text |
| `--red` | Muted Red | `#C65D63` | Security warnings and suspicious indicators |

**Supporting tints** (derived so that small text keeps enough contrast; they are not new brand colors):

| Token | Hex | Used for |
|---|---|---|
| `--muted` | `#A9B4C2` | Secondary text |
| `--red-text` | `#E3A2A6` | Text on red-tinted backgrounds and next to red indicators |
| `--line2` | `#2D3E54` | Borders and dividers |
| `--panel2` | `#16212F` | Inset surfaces (email header, browser mock) |
| (deck) `accent6` | `#24344A` | Mockup title bars in the presentation |
| rgba tints | `rgba(59,130,160,.16)` and `rgba(198,93,99,.14)` | Selected-state and warning backgrounds |
| button text | `#05080C` | Text on solid Muted Blue (4.67:1) |

The presentation theme maps these to its theme slots: `lt1` Deep Navy, `lt2` Slate Navy, `dk1` Off White, `dk2` muted text, `accent1` Muted Blue, `accent2` Soft Cyan, `accent3` Muted Red, `accent4` border, `accent5` red text, `accent6` title bar, `hlink` Soft Cyan.

## Contrast

Ratios computed from the hex values (WCAG relative luminance). Targets: 4.5:1 for normal text, 3:1 for large text.

| Pair | Ratio | Notes |
|---|---|---|
| Off White on Deep Navy | 14.82:1 | |
| Off White on Slate Navy | 12.36:1 | |
| Muted text on Deep Navy / Slate Navy | 8.52:1 / 7.10:1 | |
| Soft Cyan on Deep Navy / Slate Navy | 6.92:1 / 5.77:1 | |
| Red-tint text on Slate Navy | 7.10:1 | |
| Dark text on Muted Blue | 4.67:1 | Solid blue buttons |
| Muted Red on Deep Navy | 4.39:1 | **Below 4.5:1: use for borders, fills and icons, not small text** |
| Muted Blue on Deep Navy | 4.16:1 | **Below 4.5:1: use for fills and borders, not small text** |
| Off White on Muted Blue | 3.56:1 | **Do not use**; dark text is used on solid blue |

An automated check of rendered text found no contrast failures in the module (test A11Y-02 in the QA report).

## Typography

- **Font stack:** `Calibri, Carlito, "Segoe UI", "SF Pro Text", "Helvetica Neue", "Noto Sans", "Noto Sans Arabic", Tahoma, Arial, sans-serif`. The presentation theme uses Calibri. System fonts only, so nothing is downloaded. Arabic glyphs fall back to the Arabic-capable fonts in the stack.
- **Monospace** (addresses and URLs): `ui-monospace, "Cascadia Mono", "SF Mono", Consolas, monospace`.
- **Module hierarchy:** page title (h1) 1.65 to 2.375 rem, weight 650; section title 1.25 rem, weight 600; subsection 1.0625 rem, weight 600; body 1 rem; lede 1.0625 rem in muted text; small and meta text 0.8125 to 0.875 rem.
- **Presentation hierarchy:** slide titles 36 pt bold; card headings 16 to 22 pt bold; body text 14 to 18 pt; footnotes and sources 10 to 12 pt.
- Labels use sentence case. Arabic text uses zero letter-spacing and a taller line height (1.85).

## Components

| Component | Style |
|---|---|
| Panels and cards | Slate Navy fill, 1 px border `rgba(230,234,240,.12)`, 6 px radius |
| Primary button | Blue-tinted fill, Muted Blue border, 2 px inset bottom accent, 44 px minimum height |
| Secondary button | Faint off-white fill, `--line2` border |
| Navigation (sidebar) | Numbered path with a vertical connector; the current item has a blue tint and cyan ring; completed items show a filled blue check; becomes a slide-in menu on narrow screens |
| Tabs and chips | Outlined; selected state has blue tint and a cyan underline |
| Tap-to-inspect hotspot | Dashed cyan underline; after inspection a warning sign gets a solid red underline and a red tint; normal elements turn neutral grey |
| Badges | Red-tinted for warnings and wrong answers; blue-tinted for correct answers; plain for neutral |
| Progress meter | 6 px track with a Muted Blue fill |
| Warning callout | 3 px red inline-start rule on a red tint |
| Browser mock | Dark address bar with tappable address segments; simulated page has no input fields |
| Focus | 2 px Soft Cyan outline with 2 px offset |

## Diagram and chart style (presentation)

- Flow diagrams use Slate Navy cards joined by Soft Cyan arrows.
- A red outline and red tint mark the harmful or suspicious element in a diagram (for example, the "$120M+ wired" step).
- Statistics use large numerals with a thin horizontal bar: Soft Cyan or Muted Blue fill on a `--line2` track.
- Email and website mockups use the same surface colors as the module.

## Right-to-left and motion

- All layout uses logical properties (`inline-start`, `inline-end`), so the interface mirrors in Arabic. Directional icons are flipped, and addresses and URLs are isolated as left-to-right text.
- Transitions are short, are disabled when the user prefers reduced motion, and are suspended during a language switch.
