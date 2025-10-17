---
date: 2025-10-09
title: "Polishing the Chaos: From Prototype to Publication"
tags: [AI RESEARCH, MACHINE LEARNING, INFRASTRUCTURE, DOCUMENTATION, GIT]
---

Woke up and realized yesterday's 3am "breakthrough" had my actual internal IPs hardcoded in 47 places. `192.168.1.99` everywhere. Great for rapid prototyping, terrible for publishing to GitHub without announcing my exact network topology to the internet.

### The Configuration Problem (Or: Why Hardcoding Is Bad, Actually)

Built a three-tier config system because apparently I care about OpSec now:

- `config.template.yaml` - Documented blueprint with all options
- `config.example.yaml` - TEST-NET IPs (192.0.2.0/24) for public repo
- `config.local.yaml` - My actual IPs, gitignored aggressively

Copy template, customize, gitignore handles the rest. No more "oops I leaked my entire network" moments.

### Making The LLM Shut Up

Default settings (temperature 0.7) made Qwen 2.5 Coder 14B abliterated repeat itself constantly. It would suggest the same command three times with minor variations. Not helpful for autonomous agents that need to make decisions and move on.

Adjusted inference parameters:

<div style="background: var(--smoke); padding: 1.5rem; margin: 1rem 0; border-left: 3px solid var(--blood-red);">
  <code style="display: block; line-height: 1.8;">
    temperature: 0.4         # deterministic (boring but effective)<br />
    min_p: 0.08              # dynamic sampling threshold<br />
    repeat_penalty: 1.08     # stops endless loops<br />
    cache_prompt: True       # speed boost
  </code>
</div>

Min-P sampling adapts to model confidence. When model is 80% confident on top token, keeps tokens above 6.4%. When 20% confident, keeps tokens above 1.6%. Dynamic threshold beats static top-p. Model now gives decisive answers instead of verbal diarrhea.

### Metrics (Because "It Works" Isn't Science)

Added performance tracking so I can quantify whether changes actually help:

- Timing: total runtime, avg iteration time, min/max
- Objectives: completion rate, success percentage
- Commands: executed count, success/fail breakdown, blocked attempts
- AI ops: RAG queries, LLM calls, iteration details

Everything dumps to JSON. Now I can prove my optimizations work instead of relying on vibes.

### The LM Studio Bug (Or: Why Abliteration Has Costs)

Discovered abliterated models break LM Studio's tool calling API. Uncensored Qwen 2.5 Coder returns:

<div style="background: var(--ash-gray); padding: 1rem; margin: 1rem 0; border: 2px solid var(--warning-red);">
  <code>{"error": "Unexpected empty grammar stack after accepting piece: {\"" }</code>
</div>

Hypothesis: abliteration (removing safety filters by modifying weights) degrades structured output capability. Model can't consistently follow JSON schemas anymore. You get uncensored outputs but lose function calling reliability.

This forced me toward agent-orchestrated architecture (Python controls flow, LLM just advises) instead of LLM-orchestrated (LLM controls flow via tool calls). Better for debugging, transparency, and not having the agent decide to delete everything autonomously. Sometimes bugs force better designs.

### Documentation Marathon (2,500+ Lines)

Spent 6 hours writing docs so future-me remembers why things work:

- `README.md` - 423 lines, includes origin story
- `docs/ARCHITECTURE.md` - 1,100+ lines, every design decision justified
- `docs/MCP-PROTOCOL.md` - 800+ lines on implementation details
- `docs/CONFIGURATION.md` - usage guide for people who aren't me
- `docs/KNOWN-ISSUES.md` - LM Studio bug, abliteration trade-offs

Origin story: threat actors use local LLMs + abliterated models for offensive work. To understand their methods, built similar tools. Then realized: if LLM finds vulnerabilities, another LLM could patch them. With dual GPUs, run both simultaneously in adversarial loop. Build red team agent first, blue team agent later, watch them fight.

### Repository Status

Six commits. 3,627 lines (code + docs). MIT license. Zero sensitive data leaked. Ready to publish.

Hit disk quota trying to import container to K8s, but that's trivial. Code is done: optimized inference, comprehensive metrics, sensible config system, excessive documentation.

<div style="background: var(--smoke); padding: 2rem; margin: 2rem 0; border: 2px solid var(--blood-red); text-align: center;">
  <p style="font-size: 1.2rem; color: var(--blood-red); margin-bottom: 1rem;">
    <strong>RESULTS: Kubernetes-Native Autonomous Red Team Agent</strong>
  </p>
  <p style="opacity: 0.9;">
    2000+ BlackArch tools, MCP RAG knowledge base, LLM decision-making, declarative network isolation. Functional proof of concept. Nobody asked for this. Built it anyway.
  </p>
</div>

From chaotic 3am prototype to shareable proof of concept in one day. Tomorrow: push to GitHub, write release post, pretend this was planned all along.
