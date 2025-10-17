#!/usr/bin/env python3
"""
Blog build script - converts markdown posts to HTML and generates blog.html

Usage:
    python build-blog.py

Reads all .md files from posts/, converts to HTML, and generates blog.html
"""

import os
import re
from pathlib import Path
from datetime import datetime
import markdown


def parse_frontmatter(content):
    """Extract YAML frontmatter from markdown content"""
    pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)'
    match = re.match(pattern, content, re.DOTALL)

    if not match:
        return {}, content

    frontmatter_text = match.group(1)
    body = match.group(2)

    # Parse YAML manually (simple key: value format)
    frontmatter = {}
    for line in frontmatter_text.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()

            # Handle tags as list
            if key == 'tags':
                # Remove brackets and split
                value = value.strip('[]').split(',')
                value = [tag.strip().strip('"\'') for tag in value]

            frontmatter[key] = value

    return frontmatter, body


def format_date(date_str):
    """Convert YYYY-MM-DD to 'DD MONTH YYYY' format"""
    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
    return date_obj.strftime('%d %B %Y').upper()


def generate_post_html(post_data):
    """Generate HTML for a single blog post"""
    meta = post_data['meta']
    html_content = post_data['html']

    # Format date
    formatted_date = format_date(meta['date'])

    # Generate post ID from date
    post_id = meta['date'].replace('-', '-')

    # Get primary tag for header
    primary_tag = meta['tags'][0] if meta['tags'] else 'GENERAL'

    # Generate footer tags
    footer_tags = '\n            '.join([
        f'<span class="post-tag">{tag.title()}</span>'
        for tag in meta['tags']
    ])

    # Build article HTML
    article_html = f'''
        <!-- Post: {meta['date']} -->
        <article class="blog-post" id="{post_id}">
          <div class="post-header">
            <div class="post-meta">
              <span class="post-date">{formatted_date}</span>
              <span class="meta-divider">•</span>
              <span class="post-tag">{primary_tag}</span>
            </div>
            <h2 class="post-title">{meta['title']}</h2>
          </div>

          <div class="post-content">
{html_content}
          </div>

          <div class="post-footer">
            {footer_tags}
          </div>
        </article>
'''

    return article_html


def process_markdown_content(html):
    """Post-process markdown HTML to match site styling"""

    # Convert h3 to subsection-title class
    html = re.sub(
        r'<h3>(.*?)</h3>',
        r'<h3 class="subsection-title">\1</h3>',
        html
    )

    # Add inline styles to lists (matching current blog style)
    html = re.sub(
        r'<ol>',
        r'<ol style="margin: 1rem 0; margin-left: 2rem; line-height: 1.8;">',
        html
    )

    html = re.sub(
        r'<ul>',
        r'<ul style="margin: 1rem 0; list-style: none;">',
        html
    )

    # Add padding to list items
    html = re.sub(
        r'<li>',
        r'<li style="padding: 0.5rem 0;">',
        html
    )

    return html


def load_posts():
    """Load all markdown posts from posts/ directory"""
    posts_dir = Path(__file__).parent / 'posts'
    posts = []

    for post_file in sorted(posts_dir.glob('*.md'), reverse=True):
        # Skip README
        if post_file.name == 'README.md':
            continue
        content = post_file.read_text()
        meta, body = parse_frontmatter(content)

        # Convert markdown to HTML
        md = markdown.Markdown(extensions=['extra', 'codehilite'])
        html = md.convert(body)

        # Post-process HTML
        html = process_markdown_content(html)

        # Indent HTML content for readability
        indented_html = '\n'.join('            ' + line for line in html.split('\n'))

        posts.append({
            'meta': meta,
            'html': indented_html,
            'filename': post_file.name
        })

    return posts


def generate_blog_html(posts):
    """Generate complete blog.html with all posts"""

    # Generate HTML for all posts
    posts_html = '\n'.join(generate_post_html(post) for post in posts)

    # Read current blog.html to extract header/footer
    blog_file = Path(__file__).parent / 'blog.html'
    current_html = blog_file.read_text()

    # Find the blog posts section
    # We'll replace everything between <!-- Blog Posts --> and <!-- End Posts -->

    # Full HTML template
    html = f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Lab Notes & Technical Blog - Studio Farzulla - Homelab adventures, offensive security, and infrastructure experiments" />
    <meta name="author" content="Studio Farzulla" />
    <title>Lab Notes - Studio Farzulla</title>
    <link rel="stylesheet" href="css/dystopia.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Bebas+Neue&family=Oswald:wght@700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <!-- Static Overlay -->
    <div class="static-overlay"></div>

    <!-- Surveillance Eye -->
    <div class="surveillance-eye">
      <div class="eye-outer">
        <div class="eye-inner"></div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="surveillance-nav">
      <a href="index.html" class="brand-mark">STUDIO FARZULLA</a>
      <ul class="nav-links">
        <li><a href="index.html#about">About</a></li>
        <li><a href="systems-research.html">Systems Research</a></li>
        <li><a href="expression-synthesis.html">Expression Synthesis</a></li>
        <li><a href="blog.html">Lab Notes</a></li>
        <li><a href="index.html#contact">Contact</a></li>
      </ul>
    </nav>

    <!-- Hero Section -->
    <header class="hero-dystopia">
      <div class="hero-content">
        <h1 class="massive-title glitch" data-text="LAB NOTES">LAB NOTES</h1>
        <p class="subtitle-brutal">
          Technical Experiments | Infrastructure Adventures | Things I Broke and Fixed
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="content-block">

      <!-- Blog Posts -->
      <section class="blog-posts">
{posts_html}
      </section>

    </main>

    <!-- Footer -->
    <footer class="brutal-footer">
      <p>&copy; 2025 Studio Farzulla. Lab notes from the chaos.</p>
    </footer>

    <script src="js/dystopia.js"></script>
  </body>
</html>
'''

    return html


def main():
    print("🔨 Building blog from markdown posts...")

    # Load all posts
    posts = load_posts()
    print(f"✓ Loaded {len(posts)} posts")

    # Generate blog.html
    blog_html = generate_blog_html(posts)

    # Write output
    output_file = Path(__file__).parent / 'blog.html'
    output_file.write_text(blog_html)

    print(f"✓ Generated blog.html with {len(posts)} posts")
    print("\nPosts included:")
    for post in posts:
        print(f"  - {post['meta']['date']}: {post['meta']['title']}")

    print("\n✅ Build complete!")


if __name__ == '__main__':
    main()
