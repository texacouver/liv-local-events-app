# Liv

## From discovering local experiences to confidently choosing one

Liv is a product concept and functional prototype for personalized local discovery. I built the initial prototype after noticing that interesting, smaller-scale experiences were difficult to find unless someone already knew where to look.

The initial ambition was broad: put the interesting things happening in a city in one place. Research later changed the product question. People could usually find options; the harder problem was deciding whether an option was relevant, feasible, trustworthy, and worth sending to friends.

> **Current product thesis:** Liv should help people move from “What should we do?” to “Let’s do this.”

**My role:** Product concept, product decisions, prototype direction, AI-assisted implementation, discovery research, synthesis, and V2 concept testing.

**Status:** Functional prototype and qualitative research project. No commercial launch, revenue, or product-market validation is being claimed.

### Evidence key

Throughout this case study, **observed** refers to behaviour documented in the research archive or functionality confirmed in the repository. **Interpretation** refers to my synthesis of that evidence. **Proposal** refers to what I would test or build if Liv were developed further.

---

## 1. The original problem

When I was visiting unfamiliar cities, major events and mainstream attractions were easy to find. Smaller, more distinctive experiences were not. The information existed, but it was dispersed across social feeds, event platforms, maps, venue pages, community forums, and personal recommendations.

My initial framing was:

> **Local discovery should not depend on being “in the know.”**

I hypothesized that a product combining local inventory with personalization could reduce the effort required to discover worthwhile things to do.

### Initial hypothesis

If Liv aggregates local experiences and personalizes them around a person’s tastes, location, and behaviour, people should be able to discover relevant options with less effort.

This was a starting hypothesis, not a validated conclusion.

---

## 2. Building the first prototype

I built a functional mobile-first web prototype using Replit and AI-assisted development. I am not presenting this as conventional software-engineering work. My contribution was translating product ideas and requirements into a working prototype, evaluating the results, and iterating on the product direction.

The repository confirms prototype functionality for:

- Vancouver listings across events, restaurants, attractions, and retail offers
- Search and category filtering
- Geolocation and distance calculations
- Interactive map discovery
- Favorites and profile/preferences flows
- QR-code deal redemption
- Interaction tracking for views, favorites, deal use, and sharing
- Preference- and interaction-based recommendation scoring

The recommendation system is best described as a **rule-based scoring prototype**, not machine learning. It combines factors such as category preference, price range, tags, interaction history, ratings, and recency.

The prototype helped make the idea tangible, but it did not prove that people wanted the product or that the underlying data could be kept reliable. I stopped development after exhausting the Replit resources I was using; the product was not commercially complete.

---

## 3. What needed validation

The prototype made several assumptions that needed testing:

1. People would want a broad local discovery product rather than separate specialized services.
2. Personalization would be more useful than popularity-based ranking.
3. Aggregation would reduce effort rather than create another cluttered directory.
4. Users would trust recommendations enough to act on them.
5. Information such as price, timing, food, distance, and availability could reduce decision friction.
6. Liv needed to own social coordination rather than simply produce recommendations people could share elsewhere.

Because the prototype came first, I conducted product discovery afterward. This chronology matters: **idea → prototype → later discovery → revised strategy**.

---

## 4. Discovery research

I used formative field surveys, retrospective behavioural walkthroughs, and qualitative prototype think-aloud sessions.

### Survey sample

- 12 respondents total
- 8 Vancouver locals and 4 visitors
- Ages 19–34
- Vancouver, Calgary, Melbourne, Seattle, Toronto, Montreal, and London represented

In the raw survey data, **8 of 12 respondents explicitly said they checked multiple sources** when deciding what to do. This is a small qualitative sample, so I use it to identify patterns and questions—not to estimate population prevalence.

### Behavioural walkthroughs

Four participants reconstructed recent discovery journeys. The workflows differed, but each used social or interpersonal sources alongside logistical verification:

| Participant | Situation | Observed workflow | Decision friction |
|---|---|---|---|
| P1 | Visitor, post-seawall bike ride | Reddit → Google Maps → Instagram | Confirming patio reality, food, and travel time |
| P2 | Local planning an indie Friday event | Instagram saves → Do604 → Instagram → Google Maps → group chat → Eventbrite | Dietary verification and group consensus |
| P3 | Solo traveller in Chicago | Reddit → Google Maps → bartender referral | Avoiding tourist traps and finding a comfortable next stop |
| P4 | UBC student already dressed for a night out | Instagram Stories → direct message → TikTok backup → rideshare | Wait time, cover charge, and indecision |

P1 described spending “twenty minutes juggling three different apps” to confirm basic logistics. P2’s process shows that discovery and commitment were separate: finding the event was not enough; he still checked the venue, food, and group willingness before purchasing tickets.

---

## 5. What users actually needed

The research changed my understanding of the problem. Participants were not simply asking, “Where are the events?” They were assembling enough evidence to answer several different questions:

| User question | Common source or signal |
|---|---|
| What exists? | Instagram, TikTok, event platforms, Reddit |
| Is it genuinely good or local? | Reddit, tagged photos, trusted people |
| Is it right for me? | Taste, atmosphere, food, social context |
| Can I realistically go? | Time, distance, price, hours, availability |
| Is it viable right now? | Wait time, current operations, ticket or seating availability |
| Will my friends agree? | Group chats, shares, direct messages |

### Insight 1: Discovery is fragmented, but the fragmentation is functional

Different platforms perform different jobs. A single aggregator would only be useful if it bundled enough of the evidence people currently gather elsewhere.

### Insight 2: Trust depends on context, not just ratings

Participants wanted recent visual proof, candid local information, menus, prices, and operating reality. A star rating alone did not answer whether an option fit the current situation.

### Insight 3: Group coordination is part of the decision journey

All five V2 testers described sharing an option with a friend or group before committing. The four behavioural walkthroughs also showed social or interpersonal input shaping the final decision. This suggested that Liv does not need to become a new social network. It needs to produce recommendations worth sharing and eventually support lightweight coordination.

### Insight 4: Local supply is a product risk

The smaller and more distinctive the experience, the less likely it is to appear in major event databases. APIs could provide mainstream inventory, but Liv’s differentiation would depend on reliable venue, organizer, community, or contributor supply.

---

## 6. The problem reframe

### Original framing

> Everything happening in a city, in one place.

### Revised opportunity

> **How might Liv help someone move from “I want to do something” to confidently deciding “this is what we’re doing” without juggling multiple apps and sources?**

This reframe narrowed the product’s job. Liv does not need to maximize listing volume. It needs to show people the best options they can actually act on.

### Current positioning

> **Liv is personalized local discovery that helps people quickly decide what is actually worth doing based on their tastes, location, budget, timing, and what is happening right now.**

---

## 7. V2 concept

The V2 testing concept focused on three elements:

1. Personalized recommendations
2. Decision context directly in the recommendation card
3. Real-time or recently reported operational information

The cards showed examples such as start time, travel time, price, ticket availability, food and dietary information, atmosphere tags, people interested, and an explanation for why an option was recommended.

The concept was explicitly a **prototype for user testing, not a working product**. Values such as match percentages, interested-user counts, wait times, and seats remaining were test stimuli, not observed Liv metrics.

---

## 8. What the five V2 tests suggested

Five local participants explored the concept using the scenario: “It’s Friday at 7 PM. You and a friend want to do something tonight, but neither of you has anything particular in mind. You open this app. Show me what you would do.”

### Logistics shaped the choice

Testers repeatedly focused on time, price, distance, availability, wait time, food, and whether they could realistically get ready and travel. UT2 described “Free before 10” and “9 min away” as removing decision pressure. UT5 valued a later start because it allowed time to eat and decompress.

This suggested that recommendation quality should combine taste fit with situational fit. I would treat that as a future recommendation-model hypothesis, not a finalized algorithm.

### Explainability increased perceived trust

UT1 and UT3 responded positively to “Because you listen to electronic & indie music.” The explanation made the recommendation feel intentional rather than like generic promotion.

Potential principle:

> **Liv should not merely recommend something; it should explain why.**

### Sharing appeared throughout the tests

Each tester naturally described sending an option to a friend or group before committing. This supports prioritizing shareability and lightweight coordination before building a full social network.

### Real-time context appeared valuable

Wait time, ticket scarcity, cover rules, and current availability were repeatedly used in the testers’ reasoning. These signals may differentiate Liv from a static event directory, but the tests establish perceived value—not operational reliability or real-world impact.

### Cross-app leakage remained

Testers still wanted recent photos, crowd context, music previews, menus, checkout, and surrounding-area information. This is not evidence that Liv must build every one of these features. It is evidence that the product would need to decide which missing information is most important to bring into the decision flow first.

---

## 9. Product priorities

These are current product recommendations, not a claim about what is already implemented.

### P0: Reduce decision friction

- Personalized recommendation feed
- Explainable recommendation rationale
- Time, distance, price, food, atmosphere, and availability context
- Simple sharing into existing messaging and social channels

### P1: Increase confidence

- Reliable real-time signals such as wait time and ticket availability
- Recent photos, menus, performer previews, and venue verification
- Map clusters that show nearby backup options

### P2: Enable transactions

- Ticketing and reservation deep links or integrations
- Eventually, embedded transaction flows where the value justifies the complexity

I would not prioritize a full social network or broad feature expansion before proving that Liv can reliably help users choose and act.

---

## 10. How I would measure Liv if developed further

I would avoid using downloads or time spent as the primary measure. Liv’s job is to help someone make a useful decision.

### Proposed north-star behaviour

**Qualified discovery-to-action rate:** the percentage of recommendation sessions in which a user opens a relevant option and takes a meaningful next step, such as saving, sharing, requesting directions, or initiating a ticket/reservation flow.

This would need a carefully defined session and minimum quality criteria. A click alone would be too weak; a confirmed attendance signal would be stronger but harder to obtain consistently.

### Supporting measures

- Recommendation-card open rate
- Save rate and share rate
- Directions or ticket/reservation initiation rate
- Time from opening Liv to selecting an option
- Repeat use for a new local decision
- User-reported confidence after choosing

### Guardrails

- Incorrect or stale availability reports
- Mismatch or dissatisfaction after attending
- Sponsored-content complaints
- Over-concentration on large commercial venues
- Recommendation diversity and local-business representation
- Privacy and consent for location, preference, and behavioural data

These are proposed measures only. No product performance results are being claimed.

---

## 11. Next experiments: reduce uncertainty in sequence

I would sequence future work around the biggest risks rather than adding features indiscriminately.

1. **Supply reliability:** Can Liv obtain enough current, distinctive local inventory in one neighbourhood?
2. **Decision value:** Does showing logistics and context reduce time-to-choice or increase confidence compared with a basic listing feed?
3. **Personalization:** Do users perceive recommendations as relevant and understand why they were selected?
4. **Group decisions:** Does sharing a recommendation help groups converge faster?
5. **Repeat value:** After one successful decision, do people return when they next want something to do?

The first experiment I would run is a narrow concierge-style pilot in one Vancouver neighbourhood. I would manually curate a small set of experiences, attach verified logistics, and measure whether users can choose and share an option faster than with their existing workflow. This would test the product’s core value before investing heavily in integrations or automated supply acquisition.

---

## 12. Reflection

The most important change was not a screen-level redesign. It was changing the product’s job.

I began with an aggregation idea: put more local experiences in one place. Research showed that abundance alone would not solve the problem. Users already found options; they struggled to establish enough confidence to act.

That changed how I thought about personalization, social features, real-time data, and prioritization. Personalization became more than “show users things they may like.” It had to be explainable and grounded in the current situation. Social functionality became less about building a network and more about helping people share a decision. Real-time data became valuable because it could prevent a recommendation from becoming a bad plan.

The project also clarified the limits of the evidence. The research was small and formative. The prototype contains simulated or seeded content. The recommendation engine is an early rule-based implementation. The next challenge would be proving that Liv can maintain trustworthy supply and produce decisions that users would otherwise struggle to make.

That is the product question I would carry forward:

> **Can Liv reliably turn scattered local information into a decision people feel good acting on?**
