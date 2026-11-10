import { defineTheme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';

export const novoTempoTheme = defineTheme({
  name: 'novo-tempo',
  extends: neutralTheme,
  typography: {
    body: { family: 'Figtree', fallbacks: 'system-ui, sans-serif' },
    heading: { family: 'Fraunces', fallbacks: 'Georgia, serif' },
    scale: { base: 16, ratio: 1.2 },
  },
  motion: { character: 'crisp', fast: 150, medium: 250, ratio: 0.8 },
  localTokens: { '--nt-page-width': '75rem', '--nt-reading-width': '46rem', '--nt-map-height': '23rem' },
  tokens: {
    '--color-background-body': ['#f5ede3', '#2b1d16'],
    '--color-background-surface': ['#f5ede3', '#2b1d16'],
    '--color-background-card': ['#eee3d6', '#38271e'],
    '--color-background-muted': ['#eee3d6', '#38271e'],
    '--color-background-popover': ['#f5ede3', '#38271e'],
    '--color-text-primary': ['#2b1d16', '#f5ede3'],
    '--color-text-secondary': ['#6f4630', '#d9c4af'],
    '--color-icon-primary': ['#2b1d16', '#f5ede3'],
    '--color-icon-secondary': ['#6f4630', '#d9c4af'],
    '--color-accent': ['#3f7d3a', '#3f7d3a'],
    '--color-on-accent': ['#ffffff', '#ffffff'],
    '--color-text-accent': ['#315e2c', '#b0d5a4'],
    '--color-icon-accent': ['#315e2c', '#b0d5a4'],
    '--color-border': ['#c9b6a5', '#806954'],
    '--color-border-emphasized': ['#a88c74', '#a88c74'],
    '--color-overlay-hover': ['#2b1d160a', '#f5ede30a'],
    '--color-overlay-pressed': ['#2b1d1614', '#f5ede314'],
    '--color-neutral': ['#2b1d1610', '#f5ede318'],
    '--focus-outline-color': ['#315e2c', '#b0d5a4'],
  },
  components: {
    heading: { base: { fontFamily: 'var(--font-family-heading)', fontWeight: '500' }, 'type:display-2': { fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', lineHeight: '1.08' }, 'level:2': { fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: '1.15' } },
    'top-nav': { base: { width: '100%', padding: '0', backgroundColor: 'var(--color-background-body)', flexWrap: 'wrap', gap: 'var(--spacing-3)', height: 'auto' } },
    'top-nav-item': { base: { color: 'var(--color-text-primary)' } },
    link: { base: { color: 'var(--color-text-primary)', overflowWrap: 'anywhere' } },
    button: { base: { borderRadius: 'var(--radius-full)' } },
    'collapsible-trigger': { base: { paddingBlock: 'var(--spacing-6)', fontSize: 'var(--font-size-lg)' } },
  },
});

