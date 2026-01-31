# @astrologer/react-chart

A comprehensive **Astrology Visualization Framework** for React. 

More than just a component library, this framework provides a composable architecture for building any type of astrological chart—from standard Natal/Transit wheels to completely custom visualizations—powered by the precision of `@astrologer/astro-core`.

## The Framework Philosophy

1.  **Context-Driven:** An `<AstroChart />` container manages the coordinate system, scaling, and data flow.
2.  **Composable Primitives:** Building blocks like `ZodiacWheel`, `PlanetRing`, and `AspectLines` automatically adapt to the chart's context.
3.  **Data-Agnostic Visuals:** Decoupled from calculation logic; render data from any source (server-side, client-side, or static JSON) as long as it matches the schema.

## Features

- **Component-Driven:** Build your own chart layouts using atomic components.
- **Pre-built Charts:** Includes ready-to-use Natal, Transit, and Synastry charts.
- **Themable:** Easy CSS-based styling with built-in support for light/dark modes and custom themes (e.g., Astrodienst/Co-Star style).
- **Responsive:** Fully SVG-based, scaling perfectly from mobile to desktop.
- **Lightweight:** Does not bundle astronomical calculation logic; accepts pure data objects.

## Installation

```bash
pnpm install @astrologer/react-chart @astrologer/astro-core
```

## Quick Start

```tsx
import { NatalChart } from '@astrologer/react-chart';
import '@astrologer/react-chart/dist/index.css';

// Data typically comes from @astrologer/astro-core
const MyChart = ({ chartData }) => (
  <NatalChart 
    data={chartData} 
    width={600} 
    height={600} 
  />
);
```

## Custom Chart Composition

You can compose a custom chart layout using the internal components:

```tsx
import { 
  AstroChart, 
  ZodiacWheel, 
  PlanetRing, 
  AspectLines, 
  HouseLines 
} from '@astrologer/react-chart';

const CustomChart = ({ data }) => (
  <AstroChart data={data} width={600} height={600}>
    <ZodiacWheel />
    <HouseLines />
    <PlanetRing />
    <AspectLines />
  </AstroChart>
);
```

## Advanced Usage: Server-Side Rendering (SSR)

Since this library handles only the visual layer, you can calculate chart data on your server (Node.js) using `@astrologer/astro-core` and pass the JSON to the client for rendering. This keeps your client-side bundle small and fast.

## Themes

The library uses CSS variables for all colors and stroke widths. You can override them globally or use the built-in themes:

```tsx
import { AstrodienstChart } from '@astrologer/react-chart';
// Imports the specific theme CSS automatically
```

## License

GNU Affero General Public License v3.0
