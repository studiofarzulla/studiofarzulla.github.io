---
date: 2025-10-07
title: Late Night K3s Cluster Planning
tags: [INFRASTRUCTURE, KUBERNETES, PROXMOX, PRIVACY, GRAPHENEOS]
---

11pm. Couldn't sleep. Decided to plan entire homelab rebuild instead. Three hours later: have a Kubernetes deployment strategy. Also ordered a phone. Not sure which was more impulsive.

### The Pixel 9a Decision (Or: Escaping Apple)

Ordered Google Pixel 9a. Switching from iPhone 14 Pro Max to GrapheneOS. Completing ecosystem pivot: Windows → Arch, corporate broadband → Community Fibre, iPhone → privacy-focused Android. Why do anything halfway.

24-month contract with Three at £40/month (£15 cheaper than EE). Economics of giving iPhone to mum in Azerbaijan: iPhones there cost 4000₼ (~£2350) vs £1000 here. After import tax (£235-320), she saves £1440+. Arbitrage via international gift-giving.

GrapheneOS installation guide already written. Tomorrow: pick up phone, flash immediately, hope nothing breaks.

### Privacy Stack (Completed at 1am)

Built full privacy setup tonight because apparently this was urgent:

- **Mullvad VPN:** UK London server, DNS protection, ad blocking
- **MAC Randomization:** systemd-networkd with persistent fake MAC
- **UFW Firewall:** Default deny incoming, SSH from LAN only
- **3TB Archive Drive:** Mounted at /mnt/archive (Google Drive migration)

systemd-networkd config: `MACAddressPolicy=persistent` in `/etc/systemd/network/20-ethernet.network`. ISP now thinks I'm different device every boot. Good.

### Proxmox Setup (Named It "pwnie-den")

Server names should be entertaining. Proxmox VE 9.0.3 on Ryzen 2700X. Storage config:

- `local`: 70GB SSD (ISOs, templates)
- `local-lvm`: 146GB SSD (fast VM storage)
- `vm-storage`: 1.9TB across 3 HDDs (bulk storage)

**Total: 2.1TB for VMs/containers.** More than enough until it isn't.

Disabled enterprise repos. SSH key auth (no passwords). Removed subscription nag. System updated. Functional.

### K3s Cluster Plan (Four Mismatched Nodes)

Planning K8s cluster across whatever hardware I have lying around:

<div style="background: var(--smoke); padding: 1.5rem; margin: 1rem 0;">
  <ol style="margin-left: 1.5rem; line-height: 1.8;">
    <li><strong>Proxmox server (192.168.1.181):</strong> Ryzen 2700X, 16GB - Control Plane + Worker</li>
    <li><strong>MSI laptop (192.168.1.99):</strong> i7-7700HQ, 7.6GB - Primary Worker</li>
    <li><strong>Mac Pro 2012 (192.168.1.105):</strong> i5-3210M, 3.7GB - Worker + pentesting target</li>
    <li><strong>Old ASUS (192.168.1.148):</strong> Celeron N2830, 3.7GB - The underdog</li>
  </ol>
</div>

**Cluster total: 18 cores / 34 threads, ~31GB RAM, 2TB+ storage.** Enough to run services until I inevitably over-provision.

Using K3s: lightweight enough for Celeron, full K8s functionality. Perfect for homelab (or so they claim).

### The Rebuild (Accidentally Deleted Everything)

Wiped MCP RAG server when installing Proxmox. 24 hours of indexing gone. Lesson: don't install hypervisors while sleep-deprived.

New plan (with persistent storage this time):

- PersistentVolume on Proxmox's 1.9TB storage
- MCP server with mount to `/mnt/vm-storage/mcp-data`
- Re-index repositories (survives pod restarts now)
- NodeSelector pins to ASUS (strongest worker, somehow)

Then: Prometheus + Grafana monitoring, Uptime Kuma, random services I'll forget about in 3 weeks.

### Tomorrow's Agenda (Optimistic)

**Morning:** Pick up Pixel, backup iPhone, flash GrapheneOS, configure profiles (Main/Work/Burner), migrate apps, factory reset iPhone.

**Evening:** Install K3s cluster, deploy MCP server, set up monitoring. Celebrate having home K8s cluster, question life choices.

### Current State (12:47am)

Four monitors: 4K Dell S2725QS 240Hz + two 1080p. Showing Proxmox UI, SSH sessions, docs, this post. Arch + Hyprland on Ryzen 9 5900X + RX 7800 XT. Everything responsive until it isn't.

Progress summary: Windows → Arch. Corporate ISP → Community Fibre. iPhone → GrapheneOS. Cloud → homelab K8s. Every step: more freedom, more control, absolutely unnecessary, complete headache. Worth it (probably).
