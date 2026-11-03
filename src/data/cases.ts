export type CaseBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "stats"; items: Array<{ value: string; label: string }> }
  | { type: "link"; href: string; label: string }
  | { type: "media"; index: number; caption?: string };

export type CaseSection = {
  id: "overview" | "background" | "approach" | "solution" | "outcomes" | "reflection" | "close" | "end" | "follow" | "last";
  label: string;
  blocks: CaseBlock[];
};

export type CaseStudy = {
  title: string;
  headline: string;
  meta: string;
  role: string;
  timeline: string;
  team: string[];
  skills: string[];
  sections: CaseSection[];
};

const sections = (
  overview: CaseBlock[],
  background: CaseBlock[],
  approach: CaseBlock[],
  solution: CaseBlock[],
  outcomes: CaseBlock[],
  reflection: CaseBlock[],
): CaseSection[] => [
  { id: "overview", label: "Overview", blocks: overview },
  { id: "background", label: "Background", blocks: background },
  { id: "approach", label: "Approach", blocks: approach },
  { id: "solution", label: "Solution", blocks: solution },
  { id: "outcomes", label: "Outcomes", blocks: outcomes },
  { id: "reflection", label: "Reflection", blocks: reflection },
];

export const cases: Record<string, CaseStudy> = {
  facebook: {
    title: "Check, then switch",
    headline: "Page notifications",
    meta: "Facebook",
    role: "Product designer",
    timeline: "6 months",
    team: ["Underbelly", "Facebook"],
    skills: ["Interaction design", "Notifications", "Prototyping"],
    sections: sections(
      [
        {
          type: "p",
          text: "I joined this from Underbelly, embedded with the Pages team. The project was already underway, and the team was still exploring what checking a Page's activity could look like. I came in for three months. It became six, and most of that time was this work.",
        },
        {
          type: "p",
          text: "Checking a Page meant switching into that Page. That step kept admins from liking and commenting as themselves. The opportunity was the notification panel they already had open. Browse activity across Pages, see what needed a response, and switch into a Page only when opening a notification.",
        },
        {
          type: "p",
          text: "The interaction goal was to make the activity easy to check and keep a consistent profile presence. I worked with a design partner, a design manager, a PM, and a researcher.",
        },
        {
          type: "p",
          text: "Admins often looked after more than one Page. Checking any of them meant leaving the profile their friends knew, doing the work as the Page, and coming back. A like or a comment was a small job wrapped in a change of identity.",
        },
        {
          type: "ul",
          items: [
            "Role: product designer on the notification panel and, later, the settings.",
            "Who it was for: Page admins who had to switch into a Page just to see its activity.",
            "Timeline: six months. It started as three.",
            "Outcome: a panel and a settings model. This version did not reach a public launch.",
          ],
        },
      ],
      [
        { type: "h3", text: "Switching was the tax on a reply" },
        {
          type: "p",
          text: "The question the team was holding was how to raise the percentage of eligible admins who respond to at least one Page comment in a week. The friction in front of that was the switch. An admin could not see a Page's likes and comments without becoming that Page. The engagement Facebook wanted happened after a step that changed who they were.",
        },
        {
          type: "p",
          text: "That weekly number sat behind the costume change. An admin who never became the Page never showed up as someone who replied, even if they had already seen the comment and decided it could wait.",
        },
        { type: "h3", text: "The work was already on the table" },
        {
          type: "p",
          text: "When I joined, my design partner had two concepts she wanted to test. Before I drew my own, I spent about a week with the researchers, the PM, and the design manager. I read the PRD with the PM, to find the assignment and where there was room. The researchers had already shared readouts and clips on how admins used and managed Pages. I went through that before I contributed a screen.",
        },
        {
          type: "stats",
          items: [
            { value: "6 months", label: "Joined for three. The extension covered another project too. Most of the time was this one." },
            { value: "1 week", label: "With research, the PM, and the design manager before I drew my own concepts." },
            { value: "1 panel", label: "The notification panel admins already used. That was the place to look." },
          ],
        },
      ],
      [
        {
          type: "p",
          text: "Two things had to be true at once. An admin should see which Pages had something new. And comments should show up early, because a comment is what they might answer.",
        },
        { type: "h3", text: "Tuesday, then Thursday" },
        {
          type: "p",
          text: "Crit was twice a week. Tuesday was the design org, a show and tell. Thursday was the team. I would bring a version, take the note, and draw the next one.",
        },
        {
          type: "p",
          text: "The first versions I brought treated the count badge as given. Facebook already showed how many notifications a Page had, and I designed the panel around that. In crit, the badges were competing with the Page names in a space that was already tight. In a 1:1 with my design partner we moved to dots. A dot does not say how many. It says which Pages have something new.",
        },
        {
          type: "p",
          text: "A second direction came out of a conversation with the PM: a digest of the notifications that were most relevant, shown as cards. We never agreed on what most relevant meant. In the version we tried, the highlights were other public figures with huge followings. What felt relevant to an admin was not the same as a reply to a fan, and a reply to a fan was the behavior we were trying to move. The cards were also far enough from the panel that crit shut them down almost immediately.",
        },
        {
          type: "media",
          index: 3,
          caption: "A pass at surfacing the most relevant notifications as cards. Crit ended it. We could not agree on relevant, and a highlight was not the same as a reply to a fan.",
        },
        { type: "h3", text: "The panel they already open" },
        {
          type: "p",
          text: "The direction that stayed put the first look inside the existing notification panel. All brings every Page's activity together. A Page tab narrows the list. The tabs scroll sideways. A full-screen notifications page for Pages was the other option, and engineering did not have the bandwidth to build it. The panel was also the only surface they could actually staff. A new destination for Page notifications would have been a product of its own.",
        },
        {
          type: "p",
          text: "Opening a Page's tab changes which notifications an admin is reading. It does not change the profile they are using. They are still on Facebook as themselves. A dot on another tab says that Page has something new before they open it. They switch into the Page when they open a notification.",
        },
      ],
      [
        {
          type: "p",
          text: "The panel and the settings are two parts. One is a way to check activity. The other is a way to decide what arrives.",
        },
        {
          type: "ul",
          items: [
            "All, then a tab per Page, in a horizontal scroll.",
            "Dots for which Pages have new activity, instead of a count badge.",
            "Selecting a Page filters the list. The active profile stays.",
            "An admin switches into the Page when they open a notification.",
            "Settings for which Pages can notify them, and which categories, per Page.",
          ],
        },
        {
          type: "p",
          text: "The settings were a solo pass I took once the panel's direction was set. Choose the Pages, then set comments, likes, tags, and the rest for one Page at a time. The panel only helps if the right activity arrives. Someone running several Pages does not want a like from all of them, and does want a comment on the one that needs a reply.",
        },
        {
          type: "media",
          index: 2,
          caption: "Notification settings for one Page. Which Pages can reach an admin, and which kinds of activity, set separately.",
        },
        {
          type: "p",
          text: "When the direction was defined, my design partner and I documented the screens and the design-system components in Figma, and refined them together. With engineering I followed up in messages and on calls, mostly to pin down a behavior that was easy to miss in the file.",
        },
      ],
      [
        {
          type: "p",
          text: "To my recollection, this version did not reach a public launch. I was not part of the release decision, so I cannot say why. What we left was the model: check activity across Pages without becoming the Page, and a settings screen for what each Page is allowed to send.",
        },
        {
          type: "p",
          text: "Inside the team, the direction was specific enough to argue with. Dots instead of counts. A switch that happens when a notification is opened, not when a tab is. Settings that treat each Page as its own sender.",
        },
        {
          type: "stats",
          items: [
            { value: "No launch", label: "This version did not reach the public, as I remember it. I was not in the release decision." },
            { value: "Dots", label: "A count badge gave way. You can see which Pages are active. You cannot see how many." },
            { value: "2 parts", label: "A panel for checking activity, and settings for what each Page sends." },
          ],
        },
      ],
      [
        {
          type: "p",
          text: "What stayed with me was how to contribute on a team that was already in motion. I got more confident explaining a decision, working a note from crit, and bringing my own idea into a conversation that had started without me.",
        },
        {
          type: "p",
          text: "I also learned the difference between holding a position and hearing one. I had treated the count badge as standard. The tight space was the actual problem. The habits I kept are smaller than the panel: understand the context before drawing, say why a version is the way it is, and pick up the piece the experience is missing. The settings were that piece. The panel was the assignment. The settings were what I noticed was missing once the panel made sense.",
        },
      ],
    ),
  },
  square: {
    title: "Enhanced email security",
    headline: "Email design",
    meta: "Square",
    role: "Email system and sender identity",
    timeline: "Sep – Dec 2021",
    team: ["Square", "Underbelly"],
    skills: ["Design systems", "Email", "Security"],
    sections: sections(
      [
        {
          type: "p",
          text: "Square's email system came out of a sharp uptick in phishing attempts on sellers in 2020 and 2021. Business owners were receiving Covid checks, and they were the target of fraud across the U.S. The mail Square itself sent made that worse. Every department had its own template, so a seller had no reliable way to tell a real message from a fake one.",
        },
        {
          type: "p",
          text: "I was on the Risk team. The job was the connective tissue between every department that sent email, and a clear read on how sellers perceived those messages when they arrived.",
        },
        {
          type: "p",
          text: "With the design system team, that became one email system: seven thematic buckets, shared components, and sender rules that still read as Square when the hard cases show up. I owned the component library, the bucket model, and those sender rules. The design system team and the email owners set which messages moved first.",
        },
        {
          type: "p",
          text: "A seller checking their phone between customers does not compare headers. They recognize a shape. When that shape changes with every department, the real mail and the fake mail start to look like the same kind of surprise.",
        },
        {
          type: "ul",
          items: [
            "Role: product designer on the email system and sender identity.",
            "Who it was for: Square sellers who could not tell a real message from a phishing attempt.",
            "Timeline: September to December 2021.",
            "Outcome: seven thematic buckets, adopted by moving the highest-volume emails first.",
          ],
        },
      ],
      [
        { type: "h3", text: "The brand was not a reliable signal" },
        {
          type: "p",
          text: "A seller learns what Square looks like from the mail they already get. When every team ships a different header, a different footer, and a different sender, the real messages train people to trust the fakes. The phishing reports were a design-system failure showing up in an inbox.",
        },
        {
          type: "p",
          text: "On a given morning the three messages might be a signup, a notice that an account was under review, and a refund. None of them looked related. A phish only had to look as official as the plainest of the three.",
        },
        {
          type: "media",
          index: 3,
          caption: "Seller mail before the system. A signup, an account notice, and a refund. Same company, three different senders.",
        },
        {
          type: "stats",
          items: [
            { value: "7", label: "Thematic buckets. Every seller email had to land in one of them." },
            { value: "1", label: "Library. Header, body, and footer as pieces, not a new template per team." },
            { value: "First", label: "Highest-volume emails moved first, so the rest of the company would follow." },
          ],
        },
        { type: "h3", text: "Adoption had to be voluntary" },
        {
          type: "p",
          text: "A mandate to redraw every email would have stalled. The teams sending the most mail moved first. Once those messages were recognizable, the other templates had a reason to match them. I sat with the people who owned the templates. Each one had a reason theirs looked the way it did. The work was finding the pieces that could be shared without taking the job of the email away.",
        },
      ],
      [
        {
          type: "p",
          text: "The design question was: what does a seller need to see, before they click, to know this is Square? A shared illustration style was not enough. The structure of the message had to be the same even when the job of the email changed.",
        },
        { type: "h3", text: "Design the message that still works with images off" },
        {
          type: "p",
          text: "Phishing hides in the cases a template ignores. Dynamic content, a plain-text fallback, and a client that blocks images all have to read as the same sender. Those were the rules, not a polish pass at the end. A seller who blocks images still has to see Square. A seller reading the plain-text version has to see the same sender. If either of those looks like a different company, the system has not done the job.",
        },
        {
          type: "media",
          index: 1,
          caption: "Two templates from the system: a card added to a wallet, and a card on its way. Same sender, different job.",
        },
        { type: "media", index: 0 },
      ],
      [
        {
          type: "p",
          text: "The system is a small set of pieces and a rule for which bucket a message belongs in. A seller can recognize Square before they follow anything into the dashboard. A new email does not start from a blank file. It joins a bucket, takes the shared header and footer, and fills a body that already knows what to do when the image is missing.",
        },
        {
          type: "ul",
          items: [
            "Header, body, and footer as separate pieces, shared across teams.",
            "Seven thematic buckets, so a new email joins a family instead of inventing one.",
            "Sender rules for dynamic content, plain-text fallbacks, and images blocked.",
            "Highest-volume emails migrated first, so adoption was something teams chose.",
          ],
        },
        {
          type: "media",
          index: 2,
          caption: "Header, body, and footer as separate pieces, so every seller email can be recognized as Square.",
        },
      ],
      [
        {
          type: "p",
          text: "The highest-volume seller emails moved onto the system. A message could be recognized as Square before anyone opened the dashboard, including the versions where the images never load. The change a seller would feel was quiet. The next email, from a different team, arrived in a shape they had already learned. For the teams, it was a template they could join instead of one they had to invent.",
        },
        {
          type: "stats",
          items: [
            { value: "7 buckets", label: "Templates were grouped so no two departments invented their own Square." },
            { value: "Images off", label: "The sender still reads as Square when a client blocks the pictures." },
            { value: "Voluntary", label: "Other teams followed after the highest-volume mail moved first." },
          ],
        },
      ],
      [
        {
          type: "p",
          text: "The phishing reports looked like a security incident. The fix was a design system. Sellers were not failing to spot a fake. They had been taught, by Square's own mail, that Square can look like anything. Risk had been asked to stop the fraud. The lever in reach was the mail Square sent every day.",
        },
      ],
    ),
  },
  slide: {
    title: "45% of claims, no call",
    headline: "Insurance claims intake",
    meta: "Slide",
    role: "Claims intake and service blueprint",
    timeline: "Jun – Oct 2022",
    team: ["Slide", "Underbelly"],
    skills: ["Research", "Service design", "Prototyping"],
    sections: sections(
      [
        {
          type: "p",
          text: "The phone was the product. An agent spent about twenty minutes triaging a claim, choosing what kind of loss it was, and collecting the minimum Slide needed to start. The website could not do that. Anyone who wanted to file still had to reach a person.",
        },
        {
          type: "p",
          text: "After a week with agents in Tampa, I turned their triage into an online flow: first identify the claim type, then ask only for the information Slide needed to start it. The flow shipped. Six months later, 45% of claims started without a call.",
        },
        {
          type: "p",
          text: "I owned the service blueprint, the self-serve flow, prototypes, and handoff details for the intake experience. I worked with claims agents to turn their judgment into decision rules, then partnered with Slide's product and engineering teams to separate what a customer could answer alone from what still required an adjuster.",
        },
        {
          type: "p",
          text: "A claim is a bad day. The person filing it is often still in it. Twenty minutes on the phone was the price of a claim number, and most of those minutes were the same opening every time.",
        },
        {
          type: "stats",
          items: [
            { value: "20 min", label: "Average time an agent spent taking one claim over the phone." },
            { value: "45%", label: "Of claims came in with no phone call, within six months of launch." },
            { value: "1 week", label: "In Tampa with agents, learning the triage before drawing the flow." },
          ],
        },
      ],
      [
        { type: "h3", text: "The script lived with people, not in the interface" },
        {
          type: "p",
          text: "Agents already knew how to sort a claim. They knew which question actually changed the path, and which details could wait until a person was on it. None of that was on the site. Customers who would have finished a short form were sitting in a queue for a twenty-minute conversation that mostly collected the same few facts.",
        },
        {
          type: "p",
          text: "The business cost was the queue. The customer cost was the wait, and the feeling that you could not start until someone picked up. Both of those are the same design problem: the judgment for \"what kind of claim is this, and what do you need from me\" had never been written down as a flow. The call was not twenty minutes of judgment. Most of it was what happened, what kind of loss it was, and the few facts Slide needed before anyone could be assigned.",
        },
      ],
      [
        { type: "h3", text: "Learn the triage before removing the agent" },
        {
          type: "p",
          text: "A week in Tampa was the spec. We watched how agents decided what they were looking at, which branches were real, and where they stopped asking because Slide already had enough to open the claim. The temptation in a room like that is to transcribe the whole call. The useful edit is to find the minimum.",
        },
        {
          type: "p",
          text: "I owned that edit. Choosing the right claim online, and providing the smallest set of information for Slide to get started. Everything else could stay with a person, later, if the claim needed it. The useful moments in Tampa were the ones where an agent stopped asking. They had the claim type and enough to open a file. Everything after that was a different job, and it did not belong on the first form.",
        },
        {
          type: "media",
          index: 1,
          caption: "Study of the self-serve intake: claim type first, then only the facts required to start.",
        },
        { type: "media", index: 0 },
      ],
      [
        {
          type: "p",
          text: "The web flow keeps the first part of the phone script: identify the claim type and collect only the facts a customer can provide without an agent. The site still hands a person to an adjuster when the claim needs one. It no longer makes them wait in a queue to say what happened and leave a phone number.",
        },
        {
          type: "ul",
          items: [
            "A first step that chooses the kind of claim, the same sort an agent made at the start of the call.",
            "A short set of questions for the minimum Slide needs to open it.",
            "A handoff that does not pretend the website replaced every later conversation, only the twenty minutes it took to begin.",
          ],
        },
        {
          type: "media",
          index: 2,
          caption: "Filing, tracking, payment, and the policy sit around the intake. The intake is the part that left the phone.",
        },
      ],
      [
        {
          type: "p",
          text: "Within six months, 45% of claims started online without a phone call. The phone queue was no longer the only way to begin a claim. The phone did not go away. Eligible claims could start without it, and the agents who remained were on the part of the call that had always needed a person.",
        },
        {
          type: "stats",
          items: [
            { value: "45%", label: "Of claims started online without a phone call within six months." },
            { value: "1", label: "Self-serve entry point added alongside the phone queue." },
            { value: "20 min", label: "Average agent intake call replaced for eligible claims." },
          ],
        },
      ],
      [
        {
          type: "p",
          text: "Another round of screens would have guessed at the script. The flow worked because it followed how agents actually sorted a claim, then dropped everything a customer did not need to provide up front. The number that matters is the 45%. The reason it moved is the week in Tampa, and the decision to digitize the start of the claim instead of the entire phone call. The week in the room was short. The edit it produced was the product.",
        },
      ],
    ),
  },
  "true-see": {
    title: "From the chart to the camera",
    headline: "EHR-agnostic capture",
    meta: "TRUE-See",
    role: "Sole product designer",
    timeline: "Feb – Jun 2025",
    team: ["TRUE-See"],
    skills: ["Research", "Workflow", "Interface"],
    sections: sections(
      [
        {
          type: "p",
          text: "TRUE-See makes clinical photos. Capture, share, analyze. The app lived inside one record, Altera, and the integration only went one way. I led the redesign that pulls it out, so a photo does not depend on that vendor.",
        },
        {
          type: "p",
          text: "We started in February 2025. It was a twelve-week remote project, research through QA. Ten weeks in, two left to code the screens. It has not launched. We are piloting in June, and what we know so far is from the prototype.",
        },
        {
          type: "p",
          text: "I was the only designer. In-house was the CEO, the CPO, and an onboarding specialist. With me, a PM, and an engineering team in India: two architects and four engineers.",
        },
        {
          type: "p",
          text: "A wound photo is a clinical record. The phone in a nurse's pocket was already good enough to take it. The product in front of them was not fast enough to be the place they did.",
        },
      ],
      [
        { type: "h3", text: "She had not added the patient in Altera" },
        {
          type: "p",
          text: "A nurse had a new patient. The chart had not been updated, so TRUE-See could not see them. She took the photos on her iPhone and Airdropped them to the doctor. The doctor emailed them to herself to get them into the EHR. That was the workflow we were replacing.",
        },
        {
          type: "p",
          text: "Twenty-two hospitals and private practices in the Southeast. About 115 photos a day. 59% of people who opened the app took a photo. The integration was custom, not bidirectional, and not FHIR. One vendor, and only the patient data that vendor had already sent. It took three clicks just to reach the camera.",
        },
        {
          type: "stats",
          items: [
            { value: "22", label: "Hospitals and private practices in the Southeast." },
            { value: "115", label: "Photos a day, on average." },
            { value: "59%", label: "Of people who opened the app took a photo." },
          ],
        },
        {
          type: "media",
          index: 1,
          caption: "Three clicks to the camera. Home, the list, the patient, then the shot.",
        },
        { type: "h3", text: "Nurses take the photo. Doctors read it." },
        {
          type: "p",
          text: "Eight interviews. The two founders, the onboarding specialist, and five physicians, fifteen to thirty minutes each. Nurses were the ones taking the photos. Doctors were looking at the images and the notes. When a doctor had to take the photo, they used their iPhone, Airdropped it to a specialist, and updated the chart back at the office. That lines up with the 59%. I am not sure if it is correlation or causation. It is a HIPAA problem either way.",
        },
        {
          type: "p",
          text: "Reshoots slowed the nurses down. Sharing in the moment mattered to the doctors. Analysis was an eyeball test. Nothing, including TRUE-See, could put two photos side by side. Altera was the partner that got the app into clinics, and the reason a patient added in TRUE-See never showed up in the chart. The nurse's workaround was the honest map of that limit.",
        },
      ],
      [
        {
          type: "p",
          text: "The goal was a phone-first photo that still lands in the chart, and an app that can sit next to any EHR, not the next custom integration.",
        },
        { type: "h3", text: "The camera first, then what you do with the photo" },
        {
          type: "p",
          text: "I sketched from what already worked, and from what people asked for. Take the photo. Share it. The prototype put a camera on the global tab, so the shot does not start inside a chart. The sync was going to be bidirectional, which means a new patient can be added in the app and written back to the record.",
        },
        {
          type: "p",
          text: "Before the tests we still had open questions. Assign had to cover the patient and the wound type. We might not be able to show wound info in the camera until the session was saved. Nurses needed notes immediately. Share, with nothing attached to the photo, might not be useful.",
        },
        {
          type: "p",
          text: "Both architects already built in Bootstrap, so I designed in that kit, and prototyped in Cursor to find the gaps while handoff was still a conversation and not a document. The twelve weeks were remote, founders in one time zone and engineers in another. I demoed the prototype as it moved, including to people who were not users yet.",
        },
        {
          type: "media",
          index: 2,
          caption: "The global camera. Take the photos, then assign, measure, note, and share.",
        },
        {
          type: "p",
          text: "We tested with three physicians in private practice. Shoot in a row, assign, search, analyze, share. Selecting photos to assign was the friction. Hashtags were the part people liked. A doctor who lectures at Duke said she would use them to group wounds before a talk. A real use. Not clear it matters to most people.",
        },
        {
          type: "p",
          text: "Selection became one click, on every image. You can no longer tap a photo to expand it. Speed, or visibility. Both are how this product earns trust, and for v1 it was not clear which one would win. Share was the other open question. The base was small, so I tested button variants one session at a time.",
        },
      ],
      [
        {
          type: "p",
          text: "In the mock, a physician opens the app, takes the photos, closes it, and assigns them when she is back at her office. That is the path the interviews described. Phone out, photos taken, gloves changed. The filing happens at a desk. The other half is what a doctor does once the photo exists: share it, and put it next to an older one.",
        },
        {
          type: "ul",
          items: [
            "A global camera, so the photo does not start in the chart.",
            "Add a patient in the app, and it writes back to the record.",
            "Share and analyze on the row. The patient page leads with the wound.",
            "Another photo of an existing wound skips assignment.",
            "A border when the frame is off, so the reshoot happens in the room.",
            "Hashtags, kept for the lecture case, with the question of how widely they get used still open.",
            "Side-by-side analysis, which the record could not do.",
          ],
        },
        {
          type: "media",
          index: 3,
          caption: "The list, before and after. Share and analyze sit on the row.",
        },
        {
          type: "media",
          index: 4,
          caption: "The patient page leads with the wound. A missing type is flagged. Another photo of that wound skips assignment.",
        },
      ],
      [
        {
          type: "p",
          text: "It has not launched. A few letters of intent came off the prototype demos. Adoption, core use, retention, performance, and conversion are in PostHog for the beta. The small UI changes are what make the photo faster to take, share, and look at. Private beta is the next read. The prototype already showed a faster capture. The metrics are waiting on real sessions: whether people open it, whether they use the camera and the share, and whether they come back.",
        },
        {
          type: "stats",
          items: [
            { value: "12 weeks", label: "Research through QA. Ten weeks in, two left to code the screens." },
            { value: "3", label: "Physicians in private practice, on the moderated prototype tests." },
            { value: "PostHog", label: "Adoption, use, retention, performance, and conversion, set before launch." },
          ],
        },
      ],
      [
        {
          type: "p",
          text: "I was the only designer on it. The part I cared about was getting the rest of the team to make design calls in critique, in the tests, and in QA. The product call I am still holding is the small one. One click to select a photo, and no way to open it. We put the speed in the prototype. We do not know yet which one clinicians will trust. The Duke lecture was a reminder that a feature can be loved for a reason you did not design. Hashtags stayed in. The open question is whether a clinic, not a lecture hall, will use them.",
        },
      ],
    ),
  },
  arcoscan: {
    title: "Open your mouth",
    headline: "Age verification",
    meta: "Arcoscan",
    role: "Onboarding liveness check",
    timeline: "Productized from the lab scan",
    team: ["Arcoscan"],
    skills: ["Onboarding", "Prototyping", "Biometrics"],
    sections: sections(
      [
        {
          type: "p",
          text: "Arcoscan had a biometric age check. It lived as a scan, not as a step a person could finish. Onboarding still needed someone to prove they were present, and old enough, without abandoning the flow to do it.",
        },
        {
          type: "p",
          text: "I turned the scan into the prompt. A face outline, one instruction, open your mouth, and the check continues. Age and liveness are the same moment, so the person never leaves for a second verification site.",
        },
        {
          type: "p",
          text: "I owned the onboarding step around the existing scan: the prompt, the face guide, and the states that keep someone in the session. The scan itself came from Arcoscan's work with SRI. I designed the product surface that asks for it.",
        },
        {
          type: "p",
          text: "Age checks usually send a person away. A vendor site, a document, a wait. Arcoscan already had the scan. What it did not have was a moment someone could finish without feeling they had left the signup.",
        },
      ],
      [
        { type: "h3", text: "A lab demo is not an onboarding step" },
        {
          type: "p",
          text: "The technology could look at a face and judge age. What a person actually met was unclear: grant the camera, hold still, do something a photo of a face cannot do, wait, then land back in the product they were trying to join. Any one of those as a separate site is where people leave. A person joining a product does not want a tour of how the scan works. They want to know where to put their face, what to do, and that they can try again if it misses.",
        },
        {
          type: "stats",
          items: [
            { value: "1", label: "Instruction. Open your mouth. The prompt is the check." },
            { value: "1", label: "Session. Camera, prompt, result, then the next screen." },
            { value: "0", label: "Handoffs to a separate verification site." },
          ],
        },
      ],
      [
        {
          type: "p",
          text: "The design question was how little chrome a liveness check needs. A dashboard of scan quality would have made people perform for the software. One sentence and an outline tell them what to do with their face.",
        },
        { type: "h3", text: "The instruction is the interface" },
        {
          type: "p",
          text: "Open your mouth is specific enough that a still photo fails it, and short enough that nobody needs a help doc. The outline shows where the face goes. Everything else, the age result, the retry, the return to onboarding, happens around that one action. The outline is doing the job a paragraph used to do. Retry stays on that same screen, because a second page is another place to abandon the signup.",
        },
        {
          type: "media",
          index: 0,
          caption: "The check is the prompt. Open your mouth, hold still inside the outline, and continue.",
        },
      ],
      [
        {
          type: "p",
          text: "The step that shipped in the prototype is the age check as a moment inside onboarding, not a product beside it. Nothing in the step explains biometrics. The camera opens, the outline appears, the person opens their mouth, and the flow they were already in continues.",
        },
        {
          type: "ul",
          items: [
            "Camera access, then the outline, without a detour to explain the technology.",
            "One instruction: open your mouth, to prove a person is present.",
            "Age and liveness resolved together, then the flow continues.",
            "A retry that stays on the same screen when the scan does not catch.",
          ],
        },
      ],
      [
        {
          type: "p",
          text: "The scan can be asked for in the middle of onboarding. A person proves they are present without leaving the session they were already in. The check is still a prototype around a lab scan. What changed is where it lives.",
        },
        {
          type: "stats",
          items: [
            { value: "In flow", label: "The age check is a step, not a separate product." },
            { value: "1 prompt", label: "Open your mouth. The outline does the rest of the explaining." },
            { value: "Same session", label: "Camera, check, and the next screen stay together." },
          ],
        },
      ],
      [
        {
          type: "p",
          text: "Biometric technology wants a screen that explains how clever it is. The person in onboarding wants to be done. The useful design was the sentence. The scan can stay in the lab. The prompt is the product. People were not stuck on the science. They were stuck on not knowing what the screen wanted.",
        },
      ],
    ),
  },
  peridot: {
    title: "Cite the minute",
    headline: "Peridot",
    meta: "Independent",
    role: "Solo 0→1 product design and development",
    timeline: "2025 – 2026",
    team: ["Solo"],
    skills: ["0→1 product", "Research", "Interface"],
    sections: sections(
      [
        {
          type: "p",
          text: "I spoke with hundreds of researchers, designers, and PMs while building Peridot. The same problem kept appearing: teams had highlights and summaries, but could not get back to the sentence or recording that supported them.",
        },
        {
          type: "p",
          text: "Peridot makes interviews searchable and keeps every insight connected to the moment in the call it came from. A team can then turn that cited insight into a Linear ticket without losing the source.",
        },
        {
          type: "p",
          text: "I owned the 0→1 product from discovery through public launch: user interviews, the citation model, prototypes, design, and development. The central decision was that every generated insight must link to a moment in the call. Fast output is not useful if a team cannot verify its source.",
        },
        {
          type: "p",
          text: "The people I talked to already had too many summaries. They could generate a highlight. They could not defend it in a meeting, because the recording was a file and the finding was a slide.",
        },
        { type: "link", href: "https://askperidot.com", label: "askperidot.com" },
      ],
      [
        { type: "h3", text: "Synthesis was disappearing into decks" },
        {
          type: "p",
          text: "A finding without a citation is a claim. Teams were making more of them, faster, and could not get back to who said it or when. That is a retrieval problem dressed up as an insight problem. The models were happy to write the summary. They were not being asked to keep the timestamp. A deck of quotes with no minute attached is how a team loses an afternoon. Someone asks who said it. Someone else scrubs a ninety-minute call.",
        },
        {
          type: "stats",
          items: [
            { value: "100s", label: "Conversations with researchers, designers, and PMs while it was being built." },
            { value: "1", label: "Click back to the moment in the call the insight came from." },
            { value: "2026", label: "Public launch, including on Product Hunt." },
          ],
        },
      ],
      [
        {
          type: "p",
          text: "The line I kept coming back to: do not automate the conversation. Automate everything around it. The interview is the part a person should still do. The finding, the citation, and the handoff into the backlog are the parts that were eating the week.",
        },
        { type: "h3", text: "A memory, not a summary" },
        {
          type: "p",
          text: "Search is useful only if the result can be audited. An insight in Peridot points at the moment in the recording. If you cannot land on the sentence, it does not ship as a finding. That rule kept the product from becoming another generator of plausible paragraphs. I built it as well as designed it, and the rule lives in the data. An insight without a moment in the call does not get to look like a finding.",
        },
        {
          type: "media",
          index: 0,
          caption: "Study of a cited insight, and the handoff from that citation into a ticket.",
        },
      ],
      [
        {
          type: "ul",
          items: [
            "Interviews become searchable insights, not a folder of recordings nobody reopens.",
            "Each insight cites the moment in the call.",
            "An insight can become a Linear ticket with a summary and a goal, still tied to that moment.",
            "The conversation itself stays human. The product starts when the call ends.",
          ],
        },
        {
          type: "p",
          text: "The handoff is what teams asked for once they trusted the citation. A finding can become a ticket with a summary and a goal, and the ticket still points at the minute it came from.",
        },
      ],
      [
        {
          type: "p",
          text: "Peridot launched publicly in 2026, including on Product Hunt, at askperidot.com. Users can search an interview, open the supporting sentence or moment in the call, and turn that evidence into a backlog item. On a first day, that is the whole product. Search the call, land on the sentence, and send it into the backlog without retyping it.",
        },
        {
          type: "stats",
          items: [
            { value: "Public launch", label: "Peridot launched in 2026, including on Product Hunt." },
            { value: "1 click", label: "Each insight links back to the sentence or moment that supports it." },
            { value: "Linear", label: "Cited insights can become backlog tickets without losing their source." },
          ],
        },
      ],
      [
        {
          type: "p",
          text: "Observations can be found. Insights still belong to a person who was in the room, or who can get back to the sentence in one click. The hundreds of conversations did not ask for more output. They asked for a way to trust the output they already had, which means being able to check it. People were already drowning in plausible text. What they wanted was a way back to the person who said it.",
        },
      ],
    ),
  },
  "southeast-bank": {
    title: "Understanding fixed rates",
    headline: "Student loan rates",
    meta: "ELFI",
    role: "Sole designer",
    timeline: "5 months",
    team: ["Product", "Engineering", "Underwriting"],
    skills: ["Research", "Product design", "Prototyping"],
    sections: sections(
      [
        {
          type: "p",
          text: "ELFI offered private student loans and student loan refinancing.",
        },
        {
          type: "p",
          text: "As the sole designer, I owned all-things research and design.",
        },
        {
          type: "p",
          text: "New projects typically started with a phone call with the CTO or an email with the Head of Product, describing their pain points and anyone I could talk to in order to kick off the new initiative.",
        },
        {
          type: "p",
          text: "For this particular project, a stakeholder flagged low pre-qualification rates on our student loan application. The question I could investigate became, “Did students understand the options well enough to continue?”",
        },
        {
          type: "ul",
          items: [
            "Role: sole designer. Research, the rate view, and the versions the team reviewed.",
            "Who it was for: students deciding what they would owe.",
            "Timeline: five months.",
            "Outcome: pre-qualification to signup moved from 40% to 67%.",
          ],
        },
        {
          type: "media",
          index: 3,
          caption: "Example of an email from the Head of Product. Only 40% continue from the pre-qualification stage, which became my new initiative to improve.",
        },
      ],
      [
        {
          type: "p",
          text: "To kick off this new initiative, I ran a few usability tests on the existing application to understand where students were dropping off, and why.",
        },
        {
          type: "p",
          text: "I didn’t know exactly what I was looking for, so the instructions were straightforward. I told students to “take out a loan using ELFI.” We used a demo environment that replicated our rate terms.",
        },
        {
          type: "p",
          text: "What I found were much broader comprehension problems, and those were what led to the drop-off.",
        },
        {
          type: "p",
          text: "The repayment options up top were not clearly labeled. The fixed and variable rate tables were not easy to understand. APR was not universally understood. The grand total of a loan was hidden behind a click.",
        },
        {
          type: "p",
          text: "The question for me then became, “Could fixing these points of confusion help students understand such a critical decision, and have enough confidence to continue?”",
        },
        {
          type: "media",
          index: 4,
          caption: "The rate screen from the tests, marked where students got stuck.",
        },
      ],
      [
        {
          type: "p",
          text: "Took those findings and created a highlight reel based on the feedback I received.",
        },
        {
          type: "p",
          text: "As part of my design process, something I do very frequently is provide updates to whoever needed them:",
        },
        {
          type: "ul",
          items: [
            "I shared highlight reels from interviews.",
            "I provided mid-week updates via email to stakeholders.",
            "And shared demos via Loom based on whatever updates they might want to see.",
          ],
        },
        {
          type: "media",
          index: 5,
          caption: "A highlight reel from the usability tests, with the notes on what students said about the rates.",
        },
        {
          type: "media",
          index: 6,
          caption: "A mid-week update to Tom, the CTO, and his reply.",
        },
      ],
      [
        {
          type: "p",
          text: "This is where my design process gets a little unorthodox, living in this AI world where processes in general have been turned on their head.",
        },
        {
          type: "p",
          text: "My process was as follows:",
        },
        {
          type: "ul",
          items: [
            "My first step was to clone our demo environment and bring it down to Cursor (if I don't have it already).",
            "I would then begin chatting with Cursor about the feedback I received from my interviews.",
            "I would then create a space somewhere in the UI for the stakeholders to easily toggle between my design explorations.",
          ],
        },
        {
          type: "p",
          text: "I like having this within the UI to have one central area to look at.",
        },
        {
          type: "p",
          text: "In this particular case, I added the versions to the top nav as \"V1\" \"V2\" \"V3\" \"V4\".",
        },
        {
          type: "media",
          index: 7,
          caption: "V1 through V4 lived in the product. What shipped was a combination of a couple of them.",
        },
      ],
      [
        {
          type: "p",
          text: "Once I have a place in the UI to showcase my design iterations, I'll:",
        },
        {
          type: "ul",
          items: [
            "Articulate to Cursor what it is I'm thinking of building for each version.",
            "Once I've exhausted ideas that I have, I'll let Cursor take the wheel for a minute to see what it can come up with.",
            "Sometimes I'll end up with 8 different versions, but the chances of having 8 feasible versions is very low.",
            "So I'll eliminate a few towards the end of the exploration process.",
          ],
        },
        {
          type: "p",
          text: "This approach let me explore a wide array of designs that I have thought of and have not thought of, which is fantastic.",
        },
        {
          type: "p",
          text: "As a result of this process, I'm able to send one link to my teammates and they can click around the various versions. We'll then get together and discuss what they liked and did not like about them.",
        },
        {
          type: "p",
          text: "The 4 iterations were all focused on making it easier to understand those 4 key ideas:",
        },
        {
          type: "ul",
          items: ["Repayment plans", "Interest types", "APR", "Total amounts"],
        },
        {
          type: "media",
          index: 8,
          caption: "Repayment plans, each one named and explained, before a student picks a rate.",
        },
        {
          type: "media",
          index: 9,
          caption: "The grand total in the table, in the open.",
        },
      ],
      [
        {
          type: "p",
          text: "One iteration we liked as a group was breaking up the Repayment Plan and the Interest Types into two separate steps.",
        },
        {
          type: "p",
          text: "It played well into the core user experience we offered, which was breaking up the content thematically so that no single screen is overwhelming, but all related information is next to each other.",
        },
        {
          type: "media",
          index: 10,
          caption: "Part 1. The rate, with a note that the repayment plan comes next.",
        },
        {
          type: "media",
          index: 11,
          caption: "Part 2. The repayment plan, with the rate they already chose still on screen.",
        },
      ],
    ).map((section) => {
      if (section.id === "overview") return { ...section, label: "Business goals without a cause" };
      if (section.id === "background") return { ...section, label: "Fixed meant two different things" };
      if (section.id === "approach") return { ...section, label: "Continually getting buy-in" };
      if (section.id === "solution") return { ...section, label: "Using AI to explore alternatives" };
      if (section.id === "outcomes") return { ...section, label: "Iterating on what matters" };
      if (section.id === "reflection") return { ...section, label: "Considering our ecosystem to finalize the design" };
      return section;
    }).concat({
      id: "close",
      label: "Using ChatGPT as my junior designer",
      blocks: [
        {
          type: "p",
          text: "My final step in this new AI design process is to feed ChatGPT the GitHub repo and the Vercel build.",
        },
        {
          type: "p",
          text: "I give ChatGPT access to the repo so it can detect the screens and turn them into Figma designs that are entirely editable. GPT is also really good at applying Auto Layout and naming each frame.",
        },
        {
          type: "p",
          text: "Once the GPT designs are in my Figma file, I reference those designs to rebuild them using our proper design system. I call this the “Paint by Numbers” approach.",
        },
        {
          type: "p",
          text: "I’m only doing this because our engineers still like to inspect designs in Figma and have that source of truth. If our engineers were okay with me polishing in Cursor and pushing the PRs myself, I don’t even think we’d be in Figma nearly as often.",
        },
        {
          type: "media",
          index: 12,
          caption: "The thread with ChatGPT. Keep pasting the screens into Figma, including the components.",
        },
        {
          type: "media",
          index: 13,
          caption: "The file after that pass. Users, email, configuration, authentication, and the component set.",
        },
      ],
    },
    {
      id: "end",
      label: "End result with some polish",
      blocks: [
        {
          type: "p",
          text: "What we ended up shipping was a version that combines a few aspects of a couple different versions.",
        },
        {
          type: "ul",
          items: [
            "We kept the separate pages for repayment and interest rates.",
            "We added the grand total directly in the table.",
            "We got a bit more descriptive with the existing tooltip.",
            "We added a tooltip to explain what APR was.",
            "We turned the summary along the bottom into a sentence that was much easier to read.",
          ],
        },
        {
          type: "p",
          text: "There was initial pushback on the second screen. The concern was that students might forget their rate selection, which is significantly affected by the repayment plan they chose.",
        },
        {
          type: "p",
          text: "So we added a summary of their selection to the top of the next screen.",
        },
        {
          type: "media",
          index: 14,
          caption: "What shipped. The grand total sits in the table, and the summary along the bottom is a sentence.",
        },
        {
          type: "media",
          index: 15,
          caption: "The next screen. The rate they already chose stays at the top, next to the repayment plan.",
        },
      ],
    },
    {
      id: "follow",
      label: "Solid numbers reported after launch",
      blocks: [
        {
          type: "p",
          text: "We kept a close eye on the numbers after launch, and what we observed was a 27% increase in conversion from the Pre-Qualification to Signup.",
        },
        {
          type: "p",
          text: "One nit-picky downside of these results is that I can't isolate the exact design contribution that impacted the %.",
        },
        {
          type: "p",
          text: "I just know the design changes as a whole created a much clearer experience that results in a 27% conversion increase.",
        },
        {
          type: "media",
          index: 16,
          caption: "Pre-qualification to signup after launch. The lift was 27%, across the changes as a whole.",
        },
      ],
    },
    {
      id: "last",
      label: "Key takeaways",
      blocks: [
        {
          type: "p",
          text: "This is a project that I’m very proud of, because we made a very difficult life decision more understandable.",
        },
        {
          type: "p",
          text: "And with something like rates, the concept of rates is not going anywhere. If we were able to educate students about rates, they will probably make better financial decisions in the future when taking out a business loan or a mortgage.",
        },
        {
          type: "p",
          text: "If I really think about this project, success to me wasn’t getting every student to apply for an ELFI loan. Success to me was knowing that these students understand what they are signing up for.",
        },
        {
          type: "p",
          text: "Having been a student who didn’t fully understand my own loans, this felt like a very meaningful experience to contribute to.",
        },
      ],
    }),
  },
};
