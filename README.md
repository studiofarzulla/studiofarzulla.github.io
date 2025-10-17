# Studio Farzulla

Personal site for adversarial systems research, infrastructure chaos, and 3am experiments that probably should have stayed in `/tmp/`.

## What This Is

Static HTML/CSS/JS site. No frameworks, no JavaScript build nightmares, no corporate design systems. Just surveillance aesthetics and blood red accents because subtlety is for people with better impulse control.

Hosted on GitHub Pages because paying for hosting is admitting defeat.

## Adding Blog Posts

Write markdown, run script, deploy. That's it.

```bash
# Write post
vim posts/2025-10-17-something-broke.md

# Build
python build-blog.py

# Preview
python -m http.server 8000

# Deploy
git push
```

See `posts/README.md` for markdown format. See `CLAUDE.md` for why we don't say "production ready" or "revolutionary paradigm shift."

## Local Dev

```bash
python -m http.server 8000
```

That's the whole stack.

## Design Philosophy

Dystopian surveillance aesthetic. Glitch effects. Cursor-tracking eye. Typography that makes you slightly uncomfortable.

If it looks like something from a cyberpunk film noir directed by someone with trust issues and a CS degree, mission accomplished.

## Voice

Technical precision with casual chaos. Self-aware about mistakes. No hype, no LinkedIn-speak, no pretending prototypes are "enterprise-grade solutions."

Sample size n=1. Extremely scientific. Nobody asked for this. Built it anyway.

## License

MIT for code. Creative Commons for writing. Don't be weird about it.
