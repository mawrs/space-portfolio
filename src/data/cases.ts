export type CaseBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "stats"; items: Array<{ value: string; label: string }> }
  | { type: "link"; href: string; label: string }
  | { type: "media"; index: number; caption?: string };

export type CaseSection = {
  id: "overview" | "background" | "approach" | "solution" | "outcomes" | "reflection";
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
    title: "Three Pages, one account",
    headline: "Cross-profile notifications",
    meta: "Facebook · Shipped 2021",
    role: "Page switch and notification settings",
    timeline: "Apr – Sep 2021",
    team: ["Page admin product"],
    skills: ["Interaction design", "Settings", "Prototyping"],
    sections: sections(
      [
        {
          type: "p",
          text: "Page admins do not run one Page. The people this was for were running three or more, and every Page produced its own stream of comments, messages, and reviews. Facebook treated that as one pile attached to one account. Reading it meant either drowning, or logging out and back in as a different Page.",
        },
        {
          type: "p",
          text: "I worked on the interaction that lets an admin move between those streams without swapping the account, and on the settings where they decide which kinds of notifications are worth a ping, and from which Pages.",
        },
        {
          type: "p",
          text: "I owned the Page switch and notification settings from existing-flow mapping through prototypes and engineering handoff. The Pages PM, content design, and engineering set scope and technical constraints; I designed the interaction and its states.",
        },
        {
          type: "ul",
          items: [
            "Role: Product designer on the Page-switching interaction and notification settings.",
            "Who it was for: admins running three or more Pages.",
            "Timeline: April to September 2021.",
            "Outcome: shipped as Cross-Profile Notifications.",
          ],
        },
      ],
      [
        { type: "h3", text: "The notification list was organized around the wrong thing" },
        {
          type: "p",
          text: "A comment on a shop Page and a review on a studio Page are different jobs, but Facebook showed them in one account-level list. The work happened at the Page level. As admins added Pages, the list grew but the interface did not help them separate the work.",
        },
        {
          type: "stats",
          items: [
            { value: "3+", label: "Pages was the point where the single pile stopped being manageable." },
            { value: "1", label: "Account. The useful switch did not require a second login." },
            { value: "2", label: "Surfaces I owned: the Page switch, and the settings behind it." },
          ],
        },
        { type: "h3", text: "Why we did not build a new notification inbox" },
        {
          type: "p",
          text: "Switching the whole Facebook account just to see another Page's notifications was too disruptive. I explored several control models with the team and chose an in-place Page switch because it changed notification context without making admins leave their account.",
        },
      ],
      [
        {
          type: "p",
          text: "The design question was: what is the smallest change that lets an admin switch context? A new inbox would have created a second product. A Page switch works inside the notification list admins already use.",
        },
        { type: "h3", text: "Separate the stream from the settings" },
        {
          type: "p",
          text: "Switching and filtering are different jobs. Switching says which Page you are looking at right now. Settings say which types of events, from which Pages, are allowed to interrupt you at all. Putting both in one control would have made every glance into a configuration task. They shipped as a pair: a switch on the stream, and a settings model underneath it.",
        },
        {
          type: "media",
          index: 3,
          caption: "Study of the Page switch. The account stays. The stream changes.",
        },
        { type: "media", index: 0 },
        { type: "media", index: 2 },
      ],
      [
        {
          type: "p",
          text: "Cross-Profile Notifications is the name it shipped under. An admin stays in the account they are already using, moves between Page notification streams in place, and chooses notification types per Page.",
        },
        {
          type: "ul",
          items: [
            "A Page switch on the notification stream, so context changes without an account swap.",
            "Settings for which types of notifications arrive.",
            "Those settings scoped per Page, so a noisy Page can be quiet without silencing the others.",
            "Each notification identifies its source Page before an admin opens it.",
          ],
        },
        { type: "media", index: 1 },
        { type: "media", index: 4 },
      ],
      [
        {
          type: "p",
          text: "It shipped as Cross-Profile Notifications in 2021. Admins could switch Page notification streams and manage notification settings without leaving the Facebook account they were already using.",
        },
        {
          type: "stats",
          items: [
            { value: "Shipped", label: "Cross-Profile Notifications launched in 2021." },
            { value: "1 account", label: "Admins switch Pages without swapping Facebook accounts." },
            { value: "Per Page", label: "Notification settings can be managed independently for each Page." },
          ],
        },
      ],
      [
        {
          type: "p",
          text: "The temptation was a new notification center. The useful change was smaller. Scope the switch, not the whole product. People already knew how to be in Facebook. They needed a way to change which Page they were responsible for without starting over.",
        },
      ],
    ),
  },
  square: {
    title: "Seven buckets, one Square",
    headline: "Email design",
    meta: "Square · Shipped 2021",
    role: "Email system and sender identity",
    timeline: "Sep – Dec 2021",
    team: ["Square", "Underbelly"],
    skills: ["Design systems", "Email", "Security"],
    sections: sections(
      [
        {
          type: "p",
          text: "Sellers were reporting a spike in phishing, and the trail led back to Square's own mail. Every department had built its own template over the years. No two messages looked alike, so a seller had no reliable way to tell a real Square email from a fake one.",
        },
        {
          type: "p",
          text: "I worked with the design system team to turn that pile into one email system: seven thematic buckets, shared components, and sender rules that still read as Square when the hard cases show up.",
        },
        {
          type: "p",
          text: "I owned the component library, the bucket model, and the sender-identity rules, including dynamic content, plain-text fallbacks, and messages that stay legitimate with images blocked. The design system team and the email owners set which messages moved first.",
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
          text: "A mandate to redraw every email would have stalled. The teams sending the most mail moved first. Once those messages were recognizable, the other templates had a reason to match them.",
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
          text: "Phishing hides in the cases a template ignores. Dynamic content, a plain-text fallback, and a client that blocks images all have to read as the same sender. Those were the rules, not a polish pass at the end.",
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
          text: "The system is a small set of pieces and a rule for which bucket a message belongs in. A seller can recognize Square before they follow anything into the dashboard.",
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
          text: "The highest-volume seller emails moved onto the system. A message could be recognized as Square before anyone opened the dashboard, including the versions where the images never load.",
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
          text: "The phishing reports looked like a security incident. The fix was a design system. Sellers were not failing to spot a fake. They had been taught, by Square's own mail, that Square can look like anything.",
        },
      ],
    ),
  },
  slide: {
    title: "45% of claims, no call",
    headline: "Insurance claims intake",
    meta: "Slide · Shipped 2022",
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
          text: "The business cost was the queue. The customer cost was the wait, and the feeling that you could not start until someone picked up. Both of those are the same design problem: the judgment for \"what kind of claim is this, and what do you need from me\" had never been written down as a flow.",
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
          text: "I owned that edit. Choosing the right claim online, and providing the smallest set of information for Slide to get started. Everything else could stay with a person, later, if the claim needed it.",
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
          text: "The web flow keeps the first part of the phone script: identify the claim type and collect only the facts a customer can provide without an agent.",
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
          text: "Within six months, 45% of claims started online without a phone call. The phone queue was no longer the only way to begin a claim.",
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
          text: "Another round of screens would have guessed at the script. The flow worked because it followed how agents actually sorted a claim, then dropped everything a customer did not need to provide up front. The number that matters is the 45%. The reason it moved is the week in Tampa, and the decision to digitize the start of the claim instead of the entire phone call.",
        },
      ],
    ),
  },
  "true-see": {
    title: "From the chart to the camera",
    headline: "EHR-agnostic capture",
    meta: "TRUE-See · 2025",
    role: "Sole product designer",
    timeline: "2025",
    team: ["TRUE-See"],
    skills: ["Research", "Workflow", "Interface"],
    sections: sections(
      [
        {
          type: "p",
          text: "A wound photo started in the chart and died in a second login. Clinicians signed into the record, then into TRUE-See, then rebuilt the patient before they could take the picture. The camera was a detour.",
        },
        {
          type: "p",
          text: "I led the EHR-agnostic path: pull the patient list from the record, then keep capture, wound type, measure, and save in one pass. The photograph that lands back in the chart is the color-calibrated image the product exists to make.",
        },
        {
          type: "p",
          text: "As sole designer I owned the research, the workflow, the information architecture, and the interface, including the Bootstrap system the app shipped on. Engineering and clinical stakeholders set what the record could already provide. I designed the path that stopped asking for it twice.",
        },
      ],
      [
        { type: "h3", text: "The old path made every photo a setup" },
        {
          type: "p",
          text: "The record and TRUE-See were two products taped together. Sign in to the EHR. Add the patient. Sign in to TRUE-See. View a list that came from the record anyway. Then take the picture, assign a wound type, measure, save it back, and only then look at it. The clinical work was step two. Everything before it was tax.",
        },
        {
          type: "stats",
          items: [
            { value: "2", label: "Logins in the old path: the chart, then TRUE-See, for the same patient." },
            { value: "1", label: "Pass in the new path: list, capture, wound type, measure, save." },
            { value: "4", label: "Breaks we marked in the old loop: find, shoot, file, and review." },
          ],
        },
        { type: "h3", text: "Unassigned photos are not a filing system" },
        {
          type: "p",
          text: "After capture, clinicians were selecting from a pile of unassigned images. A search by hashtag, #ulcer or #diabeticfootulcer, finds the photograph. A count of unassigned photos does not.",
        },
      ],
      [
        {
          type: "p",
          text: "The design question was how few steps sit between the patient list and a photograph the chart will accept. An EHR-specific build would have restarted the detour for every record. The path had to start from whatever list the record already had.",
        },
        { type: "h3", text: "Start from the list. Do not rebuild the patient." },
        {
          type: "p",
          text: "I mapped the old loop with clinicians, then cut the second setup. The list comes from the EHR. Capture, wound type, and measure stay on the phone. Save sends the image back. Review happens on the image that was just taken, not on a second copy the clinician has to go find.",
        },
        {
          type: "media",
          index: 1,
          caption: "Patient list to camera. The new path starts from the list the record already has.",
        },
        { type: "media", index: 0 },
      ],
      [
        {
          type: "p",
          text: "The shipped path is the camera a few steps from the chart, and a photograph a clinician can compare later.",
        },
        {
          type: "ul",
          items: [
            "Patient list pulled from the EHR, so the clinician does not re-enter the person.",
            "Capture, wound type, and measure in one pass.",
            "Save back to the chart, share, or assign, from the image just taken.",
            "Hashtag search, so a wound type is a way to find the photo.",
            "A color-calibrated, certified image, so the chart is not storing a guess at the phone's color.",
          ],
        },
        {
          type: "media",
          index: 2,
          caption: "The photograph the workflow is built around: a calibrated image a clinician can trust.",
        },
      ],
      [
        {
          type: "p",
          text: "Clinicians can reach the camera from the patient list and send a calibrated photo back to the record without the second setup. Finding an image no longer means scrolling a pile of unassigned shots.",
        },
        {
          type: "stats",
          items: [
            { value: "1 pass", label: "List, capture, wound type, measure, and save." },
            { value: "Hashtags", label: "Photos are found by wound type instead of an unassigned pile." },
            { value: "Certified", label: "The image in the chart is color-calibrated, not a raw phone photo." },
          ],
        },
      ],
      [
        {
          type: "p",
          text: "The product people remember is the calibrated photograph. The work that made it usable was the walk up to the camera. If the chart and the camera are two logins, the better image never gets taken.",
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
      ],
      [
        { type: "h3", text: "A lab demo is not an onboarding step" },
        {
          type: "p",
          text: "The technology could look at a face and judge age. What a person actually met was unclear: grant the camera, hold still, do something a photo of a face cannot do, wait, then land back in the product they were trying to join. Any one of those as a separate site is where people leave.",
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
          text: "Open your mouth is specific enough that a still photo fails it, and short enough that nobody needs a help doc. The outline shows where the face goes. Everything else, the age result, the retry, the return to onboarding, happens around that one action.",
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
          text: "The step that shipped in the prototype is the age check as a moment inside onboarding, not a product beside it.",
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
          text: "The scan can be asked for in the middle of onboarding. A person proves they are present without leaving the session they were already in.",
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
          text: "Biometric technology wants a screen that explains how clever it is. The person in onboarding wants to be done. The useful design was the sentence. The scan can stay in the lab. The prompt is the product.",
        },
      ],
    ),
  },
  peridot: {
    title: "Cite the minute",
    headline: "Peridot",
    meta: "Independent · Launched 2026",
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
        { type: "link", href: "https://askperidot.com", label: "askperidot.com" },
      ],
      [
        { type: "h3", text: "Synthesis was disappearing into decks" },
        {
          type: "p",
          text: "A finding without a citation is a claim. Teams were making more of them, faster, and could not get back to who said it or when. That is a retrieval problem dressed up as an insight problem. The models were happy to write the summary. They were not being asked to keep the timestamp.",
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
          text: "Search is useful only if the result can be audited. An insight in Peridot points at the moment in the recording. If you cannot land on the sentence, it does not ship as a finding. That rule kept the product from becoming another generator of plausible paragraphs.",
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
      ],
      [
        {
          type: "p",
          text: "Peridot launched publicly in 2026, including on Product Hunt, at askperidot.com. Users can search an interview, open the supporting sentence or moment in the call, and turn that evidence into a backlog item.",
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
          text: "Observations can be found. Insights still belong to a person who was in the room, or who can get back to the sentence in one click. The hundreds of conversations did not ask for more output. They asked for a way to trust the output they already had, which means being able to check it.",
        },
      ],
    ),
  },
  "southeast-bank": {
    title: "One product at a time",
    headline: "Bank account opening",
    meta: "SouthEast Bank · In market",
    role: "Deposit intake and the rate comparison",
    timeline: "Mar 2025 – Present",
    team: ["SouthEast Bank"],
    skills: ["End-to-end product design", "Research", "Flows"],
    sections: sections(
      [
        {
          type: "p",
          text: "SouthEast Bank had an account-opening tool. Customers were not allowed to touch it. A branch manager drove, and the customer watched. There was no version a person could finish alone, for checking, savings, or a CD.",
        },
        {
          type: "p",
          text: "I was hired to turn this internal intake into a customer-facing flow, including funding, identity checks, and joint owners. The original plan was to open checking, savings, and CDs in one application. The system could not support that reliably, so we changed the flow to one product per application. That is the intake customers use today.",
        },
        {
          type: "p",
          text: "I owned the end-to-end customer journey, interaction design, prototype validation, and engineering-ready specifications for desktop and mobile. I worked with product, compliance, operations, and engineering to turn core-banking rules into a flow customers could complete without branch staff.",
        },
        {
          type: "ul",
          items: [
            "Role: end-to-end product design of the deposit intake.",
            "Timeline: March 2025 to present.",
            "Outcome: one product at a time, in market, from the first screen to funding.",
          ],
        },
        { type: "h3", text: "Both rates, before the guess" },
        {
          type: "p",
          text: "Students were leaving the loan application, so the bank first treated it as a form problem. My research showed the form was not the issue: students could fill it out, but they could not confidently choose between fixed and variable rates.",
        },
        {
          type: "p",
          text: "Students were being asked to pick fixed or variable without understanding what either would cost them over the life of the loan. Fixed sounds safe. Variable sounds like a trick. Without a picture of the movement, both are a guess, and a guess is a reason to close the tab.",
        },
        {
          type: "p",
          text: "I owned student research, the comparison model, interface design, and prototype feedback. I worked with lending product, compliance, and engineering to keep the explanation accurate and add it to the existing application instead of waiting for a full rebuild.",
        },
      ],
      [
        { type: "h3", text: "The internal tool was the only product" },
        {
          type: "p",
          text: "If you wanted an account, you sat with someone who knew which screen came next. The knowledge was in the branch, not in the interface. That works until the bank wants a customer to start without an appointment, or finish on a phone after they leave.",
        },
        {
          type: "stats",
          items: [
            { value: "3", label: "Products in the original brief: checking, savings, and CDs, in one pass." },
            { value: "1", label: "Product per application, after the multi-product flow would not hold." },
            { value: "3", label: "Failure states designed in, not bolted on: funds, KYC, and joint owners." },
          ],
        },
        { type: "h3", text: "All three at once did not survive the system" },
        {
          type: "p",
          text: "Opening every product in one pass sounded simpler for customers, but funding, ownership, and product rules did not work reliably together. We changed the experience so customers open one product at a time.",
        },
        { type: "h3", text: "The form was finishable. The decision was not." },
        {
          type: "p",
          text: "I interviewed students who had abandoned the application to identify where and why they stopped. They were not stuck on labels, field order, or the length of the form. They could not price the choice between fixed and variable rates. That choice is only meaningful if they can see what a variable rate does over the years they would be paying.",
        },
        {
          type: "stats",
          items: [
            { value: "2", label: "Rate types on the decision: fixed and variable, previously unexplained as costs." },
            { value: "1", label: "Screen we kept. The calculator went under the options already there." },
            { value: "Months", label: "What a full rebuild of that screen would have taken. We did not have them." },
          ],
        },
        {
          type: "p",
          text: "The screen they were leaving explained the products. It did not explain the money. Rebuilding the entire application around a new decision model would have taken months the team did not have, and it would have moved the choice away from the place students were already making it.",
        },
      ],
      [
        {
          type: "p",
          text: "I designed the deposit flow from the first screen to funding, on desktop and on a phone. The happy path was the smaller part of the work. The flow had to keep going when the money was short, when identity checks failed, and when a second person was on the account.",
        },
        { type: "h3", text: "Sequence the products instead of stacking them" },
        {
          type: "p",
          text: "Cutting the multi-product pass was the decision that made the rest designable. A customer picks checking, or savings, or a CD. They do not assemble a bundle the core system cannot open in one transaction. A second product is a second pass, not a branch in the middle of the first one.",
        },
        {
          type: "media",
          index: 0,
          caption: "Study of the single-product intake on desktop and on a phone.",
        },
        { type: "h3", text: "Repair the decision. Leave the screen alone." },
        {
          type: "p",
          text: "Students were already deciding between fixed and variable rates on the existing application screen. I put the comparison on that screen because a separate calculator, new route, or full rebuild would make them leave the decision at the moment they needed help.",
        },
        {
          type: "p",
          text: "I designed the comparison to answer one question: what does variable actually mean when it moves, set next to a fixed rate that does not. Not a lecture on rate types. A side-by-side over the life of the loan.",
        },
        {
          type: "media",
          index: 2,
          caption: "Study of the comparison sitting under the existing loan options.",
        },
      ],
      [
        {
          type: "p",
          text: "The shipped intake is a single-product deposit flow a customer can finish without a branch manager driving the mouse.",
        },
        {
          type: "ul",
          items: [
            "Product choice up front: checking, savings, or CD, one at a time.",
            "The path from the first screen through funding.",
            "Insufficient funds, so a failed transfer is a state, not a dead end.",
            "Invalid KYC, so an identity failure explains itself and offers a next step.",
            "Joint owners, so a second person is part of the flow instead of a follow-up call.",
            "Desktop and mobile of the same flow.",
          ],
        },
        {
          type: "p",
          text: "The calculator shipped under the options students were already choosing between.",
        },
        {
          type: "ul",
          items: [
            "Fixed and variable, shown together, not as two definitions on two screens.",
            "Estimated fixed and variable costs shown side by side across the loan term.",
            "Placed under the existing loan options, so the decision stays where it already was.",
            "No rebuild of the surrounding application.",
          ],
        },
        {
          type: "media",
          index: 1,
          caption: "The old Elfi form asked for the whole refinance on one page. The new one is four steps, and a student can move between them.",
        },
      ],
      [
        {
          type: "p",
          text: "The single-product flow is now the customer-facing intake. Customers can open an account without a branch manager, including when funds are insufficient, identity checks fail, or a joint owner is added.",
        },
        {
          type: "stats",
          items: [
            { value: "In market", label: "Customer-facing account opening is live." },
            { value: "1 product", label: "Each application opens checking, savings, or a CD—not all three." },
            { value: "3", label: "Edge cases designed into the live flow: funds, identity, and joint owners." },
          ],
        },
        {
          type: "p",
          text: "The comparison shipped under the existing rate options. Students can now see fixed and variable costs over the life of the loan before choosing. The form stayed; the missing pricing information was added without a months-long rebuild.",
        },
        {
          type: "stats",
          items: [
            { value: "Shipped", label: "The comparison was added to the live loan application." },
            { value: "2 rates", label: "Fixed and variable costs are shown side by side." },
            { value: "0", label: "Extra screens needed; the comparison sits under the existing options." },
          ],
        },
      ],
      [
        {
          type: "p",
          text: "The brief was everything in one pass. The useful decision was to sequence the products instead of stacking them. A customer-facing bank flow is mostly the unhappy path. If funding, identity, and joint ownership are follow-up tickets, the customer is back in the branch you were trying to get them out of.",
        },
        {
          type: "p",
          text: "A choice without a consequence is a guess, and people do not like to guess with a loan. The research was short and it changed the brief: stop redrawing the form, and show the cost. Meeting students at the moment of doubt was faster than redrawing the application around it, and it was the more honest fix. The form was not what they were afraid of.",
        },
      ],
    ),
  },
};
