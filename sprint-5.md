# Sprint Narrative

This week the groups swap and your team becomes a front-end team for the first time. Before you take on consuming a partner's API, you build a small front-end on the API you know best: your own. The job is a public bug-report form that posts to your own POST /issues. No login, no triage dashboard, no admin views. Your downstream partner — paired with your API at the start of this week — will use this form during Sprints 6–8 every time something breaks. Triage stays on your side of the wall: you'll work the queue from Postman or Prisma Studio against the admin routes you shipped in Sprint 4.

This sprint is also where AI scaffolding becomes the explicit workflow. You haven't been taught React or Next.js yet — that arrives this week and across the rest of the quarter. What you're practicing now is the prompt-and-iterate loop: feed an agent a real spec, read what it produces, decide what to keep. Code-level understanding follows in the Week 7+ readings, lectures, and Check-Off 6. For this sprint, the bar is "I can describe my workflow," not "I can explain every line."

# Course Learning Objectives

This sprint contributes to the following course learning objectives:

- LO 4: Build interactive front-end applications using a component-based framework (Next.js)
- LO 5: Deploy full-stack applications to cloud infrastructure
- LO 7: Collaborate in teams using version control workflows, sprint milestones, and code review

It also supports these course outcomes:

- Inquiry and Critical Thinking — designing the prompt that gets a useful first cut from an agent, judging which of multiple AI-scaffolded builds is the strongest, and deciding what to merge versus throw out
- Communication/Self-Expression — your individual workflow writeup (the prompts, the iterations, what you kept and cut) is the artifact this sprint produces; the team's final README is what your downstream partner reads

# How This Sprint Works

This sprint is structured differently from earlier sprints. You haven't learned React or Next.js yet — that comes in the readings and lectures across Week 7 and beyond. The point of Sprint 5 is the AI-driven scaffolding workflow itself.

The flow is:

1. **Individually.** Each team member scaffolds their own Bug Tracker FE with an agentic coding tool (Claude Code, Cursor, etc.) against the team's OpenAPI spec. Solo work — local-only on your machine, or in any personal repo of your choosing. There is no GitHub Classroom repo for individual scaffolds; bring your build (and your workflow writeup) to the team meeting.

2. **Together.** The team meets, walks through each member's build, and either:
   - Picks the strongest individual build to be the team's final, or
   - Merges the best features from multiple builds into a composite. An agent can drive this merge — that's a fair use of AI here.

3. **Ship once.** The team's selected or merged build goes into the team's Sprint 5 GitHub Classroom repository (one repo per group, not per member). That repo — and only that repo — is what's deployed and what your downstream partner uses.

4. **Document.** Each member writes up their individual AI workflow (prompts used, what came back, what was kept and cut, what they'd do differently next time). Those writeups are committed to the final team repo so the prompt-and-iterate process is captured as the learning artifact.

# User Stories

## As a visitor (your downstream partner), I want to file a bug report against your API without creating an account so that reporting friction is zero.

The form is the entire app for an unauth visitor. They land on the URL, fill out the fields, submit, and see a confirmation. Field set should match the request body your POST /issues already accepts — required vs. optional follows the OpenAPI spec.

The route this app calls is the same public POST /issues you stood up in Sprint 3. No JWT, no auth headers — your BE accepts unauthenticated reports by design.

## As a visitor, I want clear feedback when my submission succeeds, fails validation, or fails because the API is down so that I know whether my report actually got through.

A real user hits all three states. Success: confirmation message, form clears or redirects. Validation failure: inline errors next to the offending fields, surfaced from the response your API returned. Network or server failure: a non-cryptic message that doesn't suggest the user did something wrong, and that preserves what they typed so they can retry.

## As a teammate, I want to scaffold my own Bug Tracker FE solo with an agentic coding tool against our team's OpenAPI spec so that I get hands-on time with AI-driven scaffolding before the underlying tech is taught.

This is your individual work for the sprint. Open Claude Code, Cursor, or your team's tool of choice. Feed it your team's /api-docs spec (or paste the relevant slice). Ask for a Next.js app with a single public form that posts to POST /issues. Iterate — prompt, read what comes back, prompt again to fix or extend. Take the build as far as you reasonably can on your own.

You are not expected to fully understand the code the agent produced this week. React and Next.js are introduced in the Week 7+ readings, lectures, and Check-Off 6. The skill being practiced now is the workflow itself: writing a prompt that gets a useful first cut, recognizing when to redirect the agent, and judging when "good enough" is good enough.

Where your build lives is your call — local-only on your laptop, or in any personal repo of your choosing. There's no GitHub Classroom repo for individual scaffolds. Either way, bring the build (and your workflow writeup) to the team meeting.

## As a teammate, I want to write up my individual AI workflow — what I prompted, what the agent produced, what I kept and cut — so that the team's final repo captures the prompt-and-iterate process as a learning artifact.

Your writeup is short and concrete. What did your first prompt look like? What did the agent produce on the first cut? What was good, what missed? What was your second prompt — a redirect, an extension, a fix? What did you ultimately keep, what did you throw out, and what would you prompt differently next time?

This is what gets graded for understanding this sprint, not the code. "I prompted X, got Y, kept Z because…" is the explanation form.

Each member's writeup goes into the final team repo (in the README, or in a WORKFLOWS.md linked from the README — your team's call). Your downstream partner doesn't need to read these — but you and your future self do.
