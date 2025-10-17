---
date: 2025-10-10
title: Teaching AI to Write Like You (Without Selling Your Soul to OpenAI)
tags: [CREATIVE AI]
---

Was arguing with Claude about poetry formatting at 2am when I noticed something odd: after two hours of conversation, the model started generating lines that sounded exactly like mine. Not the usual LLM pastiche where it regurgitates "poetic" clichés. Actual structural patterns from my work - unusual line breaks, specific tonal shifts, the way I fuck with syntax when I'm trying to capture something uncomfortable.

### What's Happening (Mathematically)

In-context learning temporarily reweights the model's probability distributions. Feed it enough samples of your writing, discuss patterns explicitly, and it lowers confidence thresholds on token sequences that match your style. Builds a temporary manifold in latent space representing your voice.

Problem: context window ends, manifold evaporates. Two hours of perfect voice capture, then you close the chat and it's back to generic LLM slop.

### The Obvious Fix (That Nobody's Shipping)

LoRA fine-tuning makes temporary learning permanent. The concept is stupidly simple:

1. Upload 10-20 samples of your creative work
2. Chat with local LLM for an hour, explain what you're doing and why
3. Model generates samples, you approve/reject via UI
4. Backend trains small LoRA adapter (50-200MB) on approved samples
5. Load adapter anytime - model now starts conversations with your patterns baked in

Research question: minimum samples needed for voice capture? Hypothesis: 20-50, since LoRA's low-rank constraint prevents memorization. You're not overfitting to examples, you're finding the subspace projection that approximates your patterns.

### Why This Doesn't Exist Yet

Current options are either corporate (upload your data to OpenAI's servers, hope they don't train on it despite contractual language) or technical (install CUDA, configure PyTorch, understand backpropagation, debug cryptic error messages for 6 hours).

This approach would let non-technical people personalize models through conversation. No ML expertise required. More importantly: data never leaves your machine. No uploading to Anthropic, Google, or OpenAI. Actual ownership of your creative voice in model form.

### Technical Implementation

Flask app with file upload, Ollama for local inference, approve/reject UI for generated samples, Unsloth for LoRA training (optimized for consumer GPUs). Entire stack is open-source. No API keys, subscriptions, or data exfiltration.

This fits my broader research pattern: adversarial systems analysis (corporate AI is user-hostile), practical implementation (build the thing, measure results, publish), democratization (tools for individuals vs institutions). Apparently being a polymath just means you can't commit to a single research area.

### The Hardware Problem

Current rig: Ryzen 9 5900X, RX 7800 XT 16GB. Training 50 samples takes 10-15 minutes. Running dual models (generation + refinement) maxes out VRAM. Functional, barely.

Planned upgrade that will cost £2500-3000 instead of £5000-7000 for equivalent prebuilt:

<div style="background: var(--smoke); padding: 2rem; margin: 2rem 0; border-left: 5px solid var(--blood-red);">
  <h4 style="color: var(--blood-red); margin-bottom: 1rem; font-size: 1.3rem;">SPEC SHEET (OR: HOW TO JUSTIFY FINANCIAL IRRESPONSIBILITY)</h4>
  <ul style="margin: 0; list-style: none; line-height: 2;">
    <li><strong>CPU:</strong> Ryzen 9 9950X3D (16c/32t, 3D V-Cache for "workloads")</li>
    <li><strong>RAM:</strong> 96GB DDR5-6000 (finally enough for Firefox with 47 tabs)</li>
    <li><strong>GPU 1:</strong> 7900 XTX (24GB VRAM, required for "research")</li>
    <li><strong>GPU 2:</strong> 7800 XT (16GB VRAM, because one GPU is for cowards)</li>
    <li><strong>Storage:</strong> 2TB NVMe Gen5 (datasets load fast, Chrome cache still fills it)</li>
  </ul>
</div>

**Total VRAM: 40GB.** Run Qwen 2.5 Coder 32B (Q4, 18GB) on XTX. Smaller draft model (14B, 10GB) on XT. Still have 12GB for simultaneous LoRA training. Or run red team + blue team models in adversarial loop without swapping.

96GB system RAM means entire codebases stay in memory. No more waiting for grep to scan 200k files. 9950X3D's cache helps compilation. Two GPUs enable parallel inference/training without fighting for VRAM.

### Why This Is Necessary (According To Me)

Commercial workstations with similar specs: £5k-7k. DIY build: £2.5k-3k. That's the financial justification.

Real reason: enables research I can't do on current hardware. Run competing models simultaneously. Train LoRAs without stopping inference. Experiment with multi-model architectures. Creative LoRA project needs this. Autonomous red team agent needs this. Projects I haven't thought of yet will definitely need this.

You buy excessive hardware for research you haven't conceived. That's the justification I'm using and I'm sticking to it.

### Next: Building The Damn Thing

Creative LoRA trainer: Flask prototype this week. Test with my poetry (sample size n=1, extremely scientific). If voice capture works, automate pipeline. If it doesn't, debug for 12 hours then try again.

Hardware: order components when 9950X3D releases (Q1 2026 probably). Migrate current 7800 XT to second slot. Sell 5900X to offset costs. Justify expense by claiming it's "infrastructure investment."

Timeline works: build proof of concept on current hardware, validate approach, then scale up for proper testing and publication. Assuming nothing breaks catastrophically, which it will.

<div style="background: var(--ash-gray); padding: 2rem; margin: 2rem 0; border: 2px solid var(--blood-red);">
  <p style="font-size: 1.1rem; line-height: 1.8; opacity: 0.95;">
    <strong>Ablation study:</strong> Most researchers either experience creative AI, understand the math, build the systems, or publish. Attempting all four simultaneously. Results: excessive, probably unnecessary, definitely expensive. Reviewer 2 will have opinions.
  </p>
</div>
