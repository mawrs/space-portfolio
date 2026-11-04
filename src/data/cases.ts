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
        {
          type: "media",
          index: 5,
          caption: "Select profile. A personal account, then each Page and how many notifications it has.",
        },
      ],
      [
        {
          type: "p",
          text: "When I joined, my design partner had already outlined two concepts she wanted to test for this new notification panel.",
        },
        {
          type: "p",
          text: "Before contributing my own designs, I spent about a week in calls with the researchers, the PM, and the design manager to understand the goal of the project.",
        },
        {
          type: "p",
          text: "I reviewed the existing research on how admins used and managed Pages. The researchers had shared readout presentations and clips from the recordings. I went through that material to understand the context behind the project.",
        },
        {
          type: "media",
          index: 6,
          caption: "The two concepts already outlined. The notification panel on the personal profile, and the same panel under Pages You Manage.",
        },
      ],
      [
        {
          type: "p",
          text: "Once I gained a better understanding of the project, I started developing my own concepts for this notification panel, and I explored the interaction states that would make the design come to life.",
        },
        {
          type: "p",
          text: "I was tip-toeing between two thoughts. The first was catering to an admin's ability to see which Pages had new notifications. The second was showing comments as soon as possible, so they were more likely to click and interact with a fan.",
        },
        {
          type: "p",
          text: "These are some of my personal contributions.",
        },
        {
          type: "media",
          index: 3,
          caption: "States of the panel. A tab for every Page, and filters so comments, mentions, and shares can sit at the front of the list.",
        },
        {
          type: "p",
          text: "The most interesting approach came out of a conversation with the PM. She mentioned a digest of the notifications that were most relevant. We never agreed on what most relevant meant. In this example, the highlights were notifications from other public figures with huge followings.",
        },
        {
          type: "p",
          text: "Based on conversations with my design partner, the most promising approach was a simple horizontal scroll that spelled out every Page the admin managed, and how many notifications were on that Page.",
        },
      ],
      [
        {
          type: "p",
          text: "We had design critiques every Tuesday and Thursday, so there was a pretty steady rhythm to the work. Tuesday was the design org, so that was more of a show and tell. Thursday was our individual team. I’d develop something, bring it into critique, get feedback, and then work through the next version.",
        },
        {
          type: "p",
          text: "Two designs I brought to crit were centered around the notification badges themselves. Historically, we offered a way for users to see how many notifications were within that Page. I designed the notification panel, not thinking twice about the notification badge itself, since that was pretty standard. The feedback was that the badges were competing with the names in an already tight space.",
        },
        {
          type: "p",
          text: "Through a 1:1 with my design partner, we decided to move forward with dots instead of badges. With dots, you lost the exact count, but you could still tell which Pages had new activity. That was the trade-off we were dealing with.",
        },
        {
          type: "media",
          index: 7,
          caption: "Count badges on the filters, and a dot on the Page tab. The number competed with the name. The dot still showed which Page had something new.",
        },
      ],
      [
        {
          type: "p",
          text: "This is where we landed on the final design.",
        },
        {
          type: "p",
          text: "We stuck with a horizontal scroll instead of a See more. Engineering did not have the bandwidth to build a full-screen notifications page for Pages.",
        },
        {
          type: "p",
          text: "All brought every Page's activity together. The tabs beside it narrowed that list. If she selected Will Smith, she would see notifications for that Page, and she would still be using Facebook as herself.",
        },
        {
          type: "p",
          text: "That distinction mattered. At this point she was only changing which notifications she was looking at. She had not switched her active identity.",
        },
        {
          type: "p",
          text: "The dots also let her see that another Page had new activity before she opened its tab.",
        },
        {
          type: "media",
          index: 8,
          caption: "All, then a tab for each Page. Will Smith's notifications, while she is still on Facebook as herself.",
        },
      ],
      [
        {
          type: "p",
          text: "Alongside this, I contributed to how we organized the notification settings. Someone could choose which Pages they received notifications from, and then adjust the notification categories for an individual Page.",
        },
        {
          type: "p",
          text: "There were two parts to the experience. A quick way to check activity, and a place to control what activity you received.",
        },
        {
          type: "p",
          text: "This was effectively a solo project I took on once we understood the direction of the main surface we were going to pursue.",
        },
        {
          type: "media",
          index: 9,
          caption: "Which Pages send notifications, and the categories for one Page. With Page Interactions off, that Page stays quiet.",
        },
      ],
    ).map((section) => {
      if (section.id === "overview") return { ...section, label: "Switching between Pages" };
      if (section.id === "background") return { ...section, label: "Understanding the existing work" };
      if (section.id === "approach") return { ...section, label: "Exploring the options" };
      if (section.id === "solution") return { ...section, label: "Refining the details" };
      if (section.id === "outcomes") return { ...section, label: "Where we landed" };
      if (section.id === "reflection") return { ...section, label: "Notification settings" };
      return section;
    }).concat({
      id: "close",
      label: "Working through the handoff",
      blocks: [
        {
          type: "p",
          text: "When the direction was more defined, I documented the screens and the design-system components we were using in Figma. My design partner and I refined the work together.",
        },
        {
          type: "p",
          text: "My involvement with engineering included follow-up messages and calls to clarify the interactions. The calls also helped the engineers understand the small nuances of a particular behavior.",
        },
        {
          type: "media",
          index: 10,
          caption: "The panel annotated for handoff. The header, the horizontal Page tabs, a notification row, and the selected Page.",
        },
      ],
    }),
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
          text: "Our team flew to Tampa, Florida to conduct a 5-day design sprint to understand Slide's business and design goals with their new app experience.",
        },
        {
          type: "p",
          text: "After many deliberations, it became clear that the #1 goal was to deliver a self-service experience for all customers to interact digitally with Slide, and reduce the overhead of on-call insurance agents.",
        },
        {
          type: "p",
          text: "This includes the ability to file claims, track claims, make payments, view policies, and preview documents.",
        },
        {
          type: "stats",
          items: [
            { value: "20 min", label: "Average time an agent spent taking one claim over the phone." },
            { value: "45%", label: "Of claims came in with no phone call, within six months of launch." },
            { value: "1 week", label: "In Tampa with agents, learning the triage before drawing the flow." },
          ],
        },
        { type: "media", index: 3 },
      ],
      [
        {
          type: "p",
          text: "We followed the Google Ventures playbook of a 5-day sprint; starting with stakeholder interviews about their vision, and ending with user testing the prototype we built.",
        },
        { type: "media", index: 4 },
      ],
      [
        {
          type: "p",
          text: "Together with the stakeholders in the room, we sketched out ideas we liked that could potentially be implemented in the UI. This is where everyone got creative and came up with some really cool ideas.",
        },
        { type: "media", index: 5 },
      ],
      [
        {
          type: "p",
          text: "With sketches finalized, we started collaborating on a potential flow for the prototype on Friday. The finalized sketches represented the key moment in the workflow that mattered most to the stakeholders. My job was to fill in the gaps and create a cohesive end-to-end experience.",
        },
        { type: "media", index: 6 },
        { type: "media", index: 7 },
      ],
      [
        {
          type: "p",
          text: "When coming up with the prototype, we also needed to come up with the design system as we went. All we had to work with were some brand styles in Canva, which we had to translate into Figma tokens to design in a much more future-proof way.",
        },
        {
          type: "p",
          text: "In one day, we designed 22 screens and stitched them all together to create the prototype we were going to test on Friday. This doesn't sound like much in the age of AI, but it was a lot of work to cram into one day.",
        },
        { type: "media", index: 8 },
        { type: "media", index: 9 },
        { type: "media", index: 10 },
      ],
      [
        {
          type: "p",
          text: "We conducted five moderated and remote, hour-long interviews over the course of a single day. The sessions included context gathering and a prototype walkthrough.",
        },
        {
          type: "p",
          text: "A few opportunities came up:",
        },
        { type: "h3", text: "Insight" },
        {
          type: "p",
          text: "After making a payment, there is no receipt displayed or shared with the user.",
        },
        { type: "h3", text: "Opportunity" },
        {
          type: "p",
          text: "Show a confirmation number or downloadable receipt after the user completes a payment. If the user has opted into email, email the receipt.",
        },
        { type: "h3", text: "Insight" },
        {
          type: "p",
          text: "Saving your process if you need to leave and come back.",
        },
        { type: "h3", text: "Opportunity" },
        {
          type: "p",
          text: "Have a button/section that allows for progress to be saved. This saved process can generate a unique ID to come back to your spot later.",
        },
        { type: "h3", text: "Insight" },
        {
          type: "p",
          text: "Testers felt confident doing standard insurance processes through the app. They didn't feel the need to call their agent.",
        },
        { type: "h3", text: "Opportunity" },
        {
          type: "p",
          text: "Continue making the portal a fully self-service digital experience.",
        },
        { type: "media", index: 11 },
      ],
    ).map((section) => {
      if (section.id === "overview") return { ...section, label: "Kicking off the sprint" };
      if (section.id === "background") return { ...section, label: "Structuring our week" };
      if (section.id === "approach") return { ...section, label: "Sketches the possibilities" };
      if (section.id === "solution") return { ...section, label: "Deciding on a flow" };
      if (section.id === "outcomes") return { ...section, label: "Designing the prototype" };
      if (section.id === "reflection") return { ...section, label: "Opportunities arose during user interviews" };
      return section;
    }).concat({
      id: "close",
      label: "Our prototype landed us a huge contract",
      blocks: [
        {
          type: "p",
          text: "After presenting the results in a much more formal manner, including a roadmap of future features and changes to make, our agency landed a $300k deal to continue building out that roadmap.",
        },
        {
          type: "p",
          text: "As the design lead, I oversaw a design team of 4 that executed on this roadmap and made sure the client was happy with our engagement.",
        },
        { type: "media", index: 12 },
      ],
    }),
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
          text: "TRUE-See is a healthtech startup building smarter tools for capturing, sharing, and analyzing clinical photos.",
        },
        {
          type: "p",
          text: "The problem we were facing was that there was too much friction around our photo-capturing experience.",
        },
        {
          type: "ul",
          items: [
            "Getting to the camera took too long",
            "Taking photos took too long",
            "Managing those photos was counterintuitive",
          ],
        },
        {
          type: "p",
          text: "I led the end-to-end of this project, from the user research through the prototyping & development handoff.",
        },
        {
          type: "p",
          text: "There were 11 people on this project:",
        },
        {
          type: "ul",
          items: [
            "2x founders (CEO & COO)",
            "an onboarding specialist",
            "a product designer (me)",
            "a PM",
            "6x engineers",
          ],
        },
        { type: "media", index: 5 },
      ],
      [
        {
          type: "p",
          text: "Just a bit more context around how the company operates.",
        },
        {
          type: "p",
          text: "A lot of the Electronic Health Record software doesn't come with built-in media modules.",
        },
        {
          type: "p",
          text: "Some of the bigger ones do. But for the most part, these smaller EHRs rely on specialty tools like TRUE-See to handle the photo capturing aspects of it.",
        },
        {
          type: "p",
          text: "Those photos that are taken on TRUE-See get sent to the EHR to complete the patient's chart.",
        },
        {
          type: "media",
          index: 1,
          caption: "TRUE-See and Altera. Photos taken in the app are sent to the record to complete the chart.",
        },
      ],
      [
        {
          type: "p",
          text: "To kickoff this project, I interviewed 8 stakeholders & users to understand the purpose, opportunity, and challenges with the existing workflows.",
        },
        {
          type: "p",
          text: "There were several insights from our conversations.",
        },
        {
          type: "p",
          text: "The most revealing insights were around the photo-taking process.",
        },
        {
          type: "p",
          text: "And it turns out that some doctors end up just using their iPhone to take photos and they later Airdrop or email themselves the photos & upload them to the EHR manually.",
        },
        {
          type: "p",
          text: "This not only hurts our bottom line, but it's also a massive HIPAA violation.",
        },
        { type: "media", index: 2 },
      ],
      [
        {
          type: "p",
          text: "Once I began mapping out the existing workflow, it became very clear why users were bypassing TRUE-See.",
        },
        {
          type: "p",
          text: "With this flow, you can see how long it takes to go from the health record, into the TRUE-See app, and then start taking pictures.",
        },
        {
          type: "p",
          text: "You can't really start taking photos until step 6.",
        },
        {
          type: "p",
          text: "To put it into a different context, that's three clicks before you can get into the camera.",
        },
        {
          type: "p",
          text: "If you're a physician going room to room and talking to 5 or 6 patients in rapid succession, those clicks add up.",
        },
        {
          type: "p",
          text: "Not to mention the fact that if a single patient has multiple wounds, you have to repeat the last 2 steps to add a separate wound and take new pictures of that wound.",
        },
        {
          type: "p",
          text: "It may only be a few seconds of work, but it takes a huge toll on their overall sentiment towards the application.",
        },
        {
          type: "p",
          text: "It becomes less trustworthy, less appealing, and less used.",
        },
        {
          type: "media",
          index: 3,
          caption: "Six steps before a photo. Sign in to the record, add the patient, then sign in to TRUE-See and open them before the camera is available.",
        },
        {
          type: "media",
          index: 6,
          caption: "Three clicks to the camera. Open TRUE-See, pick the patient, add the wound, then the shot. Another wound repeats the last two.",
        },
      ],
      [
        {
          type: "p",
          text: "TRUE-See already had a goal of becoming EHR-agnostic. But that was primarily for business reasons and to expand into new markets.",
        },
        {
          type: "p",
          text: "I was originally brought on to the project to build the standalone app, which was going to be a replica of their existing app, with cosmetic upgrades and new APIs under the hood.",
        },
        {
          type: "p",
          text: "But through research we found major opportunities to overhaul the camera experience, and streamline that photo-taking process.",
        },
        {
          type: "media",
          index: 7,
          caption: "Sign in and take the photo inside TRUE-See. The patient list, the wound, and the measurement sync both ways with the record.",
        },
      ],
      [
        {
          type: "p",
          text: "To understand what the photo-taking experience could potentially look like, I sketched out several screens for the camera UI.",
        },
        {
          type: "p",
          text: "The first was for the action bar on the camera, which was the user interface for our camera experience.",
        },
        {
          type: "p",
          text: "I then sketched the Preview mode once a photo was taken.",
        },
        {
          type: "p",
          text: "Something not already in the existing application, but our migration to a standalone app afforded us some discovery in this direction.",
        },
        {
          type: "p",
          text: "And I sketched these green & red borders that depicted photo alignment.",
        },
        {
          type: "p",
          text: "Photo alignment was something already offered by TRUE-See, but in a very different visual language.",
        },
        { type: "media", index: 8 },
        { type: "media", index: 9 },
        { type: "media", index: 10 },
      ],
    ).map((section) => {
      if (section.id === "overview") return { ...section, label: "Capturing, sharing, and analysing photos" };
      if (section.id === "background") return { ...section, label: "How we partner with EHR vendors" };
      if (section.id === "approach") return { ...section, label: "Purpose, opportunity, and challenges" };
      if (section.id === "solution") return { ...section, label: "Far too many steps" };
      if (section.id === "outcomes") return { ...section, label: "The real opportunity" };
      if (section.id === "reflection") return { ...section, label: "Three key components" };
      return section;
    }).concat(
      {
        id: "close",
        label: "The job-to-be-done was clunky",
        blocks: [
          {
            type: "p",
            text: "On the old UI, you can see how empty the camera interface looked.",
          },
          {
            type: "p",
            text: "There was a little green square in the middle of the calibration slate. It would turn red if the photo was not aligned correctly.",
          },
          {
            type: "p",
            text: "The calibration slate in the middle is actually a separate value proposition of TRUE-Sees to provide more accurate wound observations. This was a constraint I had to work with, given that I wasn't going to remove one of the things that makes TRUE-See unique.",
          },
          {
            type: "p",
            text: "On the right, you can see some of the additions & changes we were proposing.",
          },
          {
            type: "p",
            text: "The photo previews on the bottom left invited users to take multiple images of multiple wounds, BEFORE ending the session. Something not possible before. This invited a lot of growth potential to one of our KPIs of having more photos taken daily.",
          },
          {
            type: "p",
            text: "Calibration states were also moved outside of the image frame, taking up the border & some of the top of the screen.",
          },
          {
            type: "p",
            text: "And the action bar remained fairly empty, only showing the Camera button and the End Session button.",
          },
          { type: "media", index: 11 },
          { type: "media", index: 12 },
        ],
      },
      {
        id: "end",
        label: "Introducing colored borders",
        blocks: [
          {
            type: "p",
            text: "These borders were my 3rd attempt at replacing the green & red squares with something different.",
          },
          {
            type: "p",
            text: "I felt like the old UI was not adding a ton of value for the end user, when their main goal was to take clinical photos.",
          },
          {
            type: "p",
            text: "I understood the purpose of the square & translated that to something a bit more visually apparent.",
          },
          {
            type: "p",
            text: "So I came up with these borders & alignment states that instructed them how fix a misaligned photo.",
          },
          { type: "media", index: 13 },
          { type: "media", index: 14 },
        ],
      },
      {
        id: "follow",
        label: "Significant improvements",
        blocks: [
          {
            type: "p",
            text: "Overall, the feedback from users has been overwhelmingly positive.",
          },
          {
            type: "p",
            text: "As a contractor on this project, I could argue that it's been a successful project already. I've gotten two project extensions as a result of my work.",
          },
          {
            type: "p",
            text: "This project was originally supposed to be a 1-month design sprint. And we are now on Month 3.",
          },
          {
            type: "p",
            text: "But I care about the metrics just as much as the qualitative feedback. So we're hoping to launch this new app in June of 2025 & begin tracking those numbers.",
          },
          {
            type: "p",
            text: "We've made some projections based on all of the qualitative feedback we received from tests.",
          },
          {
            type: "p",
            text: "And we believe we can triple our # of photos taken daily by bringing in a more streamlined photo-taking experience, and complimentary features like Photo Previews.",
          },
          {
            type: "p",
            text: "This flow would turn a 6-step process into a 2-step process.",
          },
          {
            type: "p",
            text: "And we project very conservatively that we can get at least 75% of users to take photos when they open the TRUE-See app.",
          },
          { type: "media", index: 15 },
        ],
      },
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
          text: "Arcoscan is a biometric age verification software that streamlines the age verification process through the use of facial recognition.",
        },
        {
          type: "p",
          text: "The scope of this particular project revolved around reducing abandonment rate for customers using the Arcoscan software as part of their onboarding experience.",
        },
        {
          type: "p",
          text: "Arcoscan was born out of the demand from the market to rethink how we verify age online, especially for age-restricted products like alcohol and cigarettes.",
        },
        {
          type: "p",
          text: "The problem we were solving was for these age-restricted companies that had long & tedious age-verification processes.",
        },
        {
          type: "p",
          text: "If a platform asked a customer to self-identify, they would almost say yes. There were no checks involved.",
        },
        {
          type: "p",
          text: "And if the age verification process is too long, you're probably going to leave. Even if you are over 21.",
        },
        {
          type: "p",
          text: "I led the end-to-end of this project, from conceptualizing the ideas, prototyping a version, and eventually the final implementation.",
        },
        {
          type: "p",
          text: "There were 5 people on this project:",
        },
        {
          type: "ul",
          items: ["CEO", "a product designer (me)", "a PM", "2x engineers"],
        },
        {
          type: "p",
          text: "By the end of our pilot program with one of our strategic partners, we were able to prove our product & reduce total abandonment rate for them from 51% to 20%.",
        },
        { type: "media", index: 1 },
      ],
      [
        {
          type: "p",
          text: "The bottom line for retailers is that long & complicated age verification flows threaten revenue.",
        },
        {
          type: "p",
          text: "Some of these flows end up being 15-steps long, which causes a tremendous amount of users to drop off.",
        },
        {
          type: "p",
          text: "I think it's great to have full ID checks that truly verify who you are and your age, but they take much longer & end up having higher abandonment rates.",
        },
        {
          type: "p",
          text: "So these companies are really stuck between a rock & a hard place.",
        },
        { type: "media", index: 2 },
      ],
      [
        {
          type: "p",
          text: "The market was ripe for disruption, and our team set out to build something different: a lightweight biometric system that used facial recognition and liveness detection to confirm a user’s age — no IDs, no friction. The underlying tech was solid, but the challenge was how to turn it into a product people would actually trust and use.",
        },
        {
          type: "p",
          text: "We built the underlying tech & were able to test it, but we really didn't have a product or an interface that users could use.",
        },
        {
          type: "p",
          text: "I was brought on shortly after the inception of Arcoscan to lead the UX and UI from the ground up. This meant turning a complex, backend-heavy system into an experience that felt simple, clear, and human.",
        },
        {
          type: "p",
          text: "This short video was my introduction to Arcoscan. And our goal was to somehow get large alcohol and tobacco companies using our product. So we had our work cut out for ourselves.",
        },
        {
          type: "ul",
          items: [
            "Convenient – a frictionless process for customers",
            "Speedy – a fast process that doesn’t waste customer’s time",
            "Secure – protects and doesn’t hold or share customer data or ask for any more than is necessary",
            "Reliable – an accurate process that will effectively prevent minors from accessing online age-restricted goods and services",
          ],
        },
        { type: "media", index: 4 },
      ],
      [
        {
          type: "p",
          text: "To start, I spent time looking at how other biometric tools handled similar flows — tools like CLEAR at airports, ID.me, and even onboarding flows in fintech apps with selfie verification.",
        },
        {
          type: "p",
          text: "Using this as inspiration along with others, I came up with UI components for each of the instructions we had to resolve during an age verification check.",
        },
        { type: "media", index: 3 },
      ],
      [
        {
          type: "p",
          text: "To understand what our instructions might be on the screen, when trying to get a user to verify their age, I worked with our lead engineer to understand the possible instructions & error states we tracked.",
        },
        {
          type: "p",
          text: "With this list, I had a better idea on the user experience we could provide for the user.",
        },
        { type: "media", index: 5 },
      ],
      [
        {
          type: "p",
          text: "After researching the market, it was clear that the first challenge was clarity with instructions. Users needed to grant camera access, center their face, perform a subtle gesture, and wait for a backend result — all in a few seconds.",
        },
        {
          type: "p",
          text: "I leaned into neutral, minimal UI — not only to avoid overwhelming the user, but to keep focus on the task. I prototyped motion cues for gestures, rewrote onboarding copy for calmness and clarity, and built error states that guided users back into the flow instead of locking them out.",
        },
        { type: "media", index: 6 },
      ],
    ).map((section) => {
      if (section.id === "overview") return { ...section, label: "Delivering facial recognition using AI/ML" };
      if (section.id === "background") return { ...section, label: "Complicated onboarding flows threaten revenue" };
      if (section.id === "approach") return { ...section, label: "Liveness checks became key" };
      if (section.id === "solution") return { ...section, label: "Studying the competition" };
      if (section.id === "outcomes") return { ...section, label: "Accurate verification required lots of instructions" };
      if (section.id === "reflection") return { ...section, label: "Translating tech into UI" };
      return section;
    }).concat(
      {
        id: "close",
        label: "Refining to 95% accuracy",
        blocks: [
          {
            type: "p",
            text: "Once we had an idea as to what the anatomy of Arcoscan would be, I built a quick prototype in Webflow and added an iFrame for the actual age verification.",
          },
          {
            type: "p",
            text: "We built an early MVP through Webflow and embedded an iframe into the demo page to test it. Even during early internal testing, we saw how easy it was for people to fail — and how much design could help them succeed.",
          },
          {
            type: "p",
            text: "And we used this prototype interface until we got our Mean Average Error down to 5 or less.",
          },
          {
            type: "p",
            text: "With this prototype, we realized that we couldn't provide such a wide age range so we instead pivoted to providing a single number & then give our confidence interval with that number.",
          },
          {
            type: "p",
            text: "If users still came back as under 21, they would have to go through the backup flow of manually uploading their ID for review.",
          },
          {
            type: "p",
            text: "That's if the AI could not confidently put an age to them.",
          },
          { type: "media", index: 7 },
        ],
      },
      {
        id: "end",
        label: "Partnering with JUUL",
        blocks: [
          {
            type: "p",
            text: "After months of trial & error. On both the UI and the backend technology, we were able to get our confidence score up to about 95%.",
          },
          {
            type: "p",
            text: "And with the new UI and confidence score, we started looking for strategic partners who might benefit from a tool like Arcoscan.",
          },
          {
            type: "p",
            text: "We talked to many large retailers, including those in the tobacco, cannabis, and gambling industries.",
          },
          {
            type: "p",
            text: "And we ended up landing a 3-month pilot with JUUL, which was a huge validation moment that also became a stress test.",
          },
          {
            type: "p",
            text: "The timing was perfect as we were looking for strategic partners to use our technology, and JUUL was looking to replace their existing age verification process.",
          },
          {
            type: "p",
            text: "After landing the pilot program with JUUL, I worked with their design team to clean up the UI and provide a new UI layout that could match the JUUL brand.",
          },
          {
            type: "p",
            text: "Working closely with JUUL’s product and engineering team, I redesigned key parts of the experience:",
          },
          {
            type: "ul",
            items: [
              "Introduced a “Hold Still” visual cue that guided users into proper face alignment",
              "Replaced static instructions with animated gesture guidance",
              "Rewrote error handling and added real-time feedback to recover from failed scans",
            ],
          },
          { type: "media", index: 8 },
        ],
      },
      {
        id: "follow",
        label: "The experience got better & better",
        blocks: [
          {
            type: "p",
            text: "Over the course of the pilot, user success improved dramatically.",
          },
          {
            type: "p",
            text: "The abandonment rate dropped steadily as we refined the flow — especially on mobile — and JUUL’s own data confirmed the experience was smoother and more reliable than where we started.",
          },
          {
            type: "p",
            text: "By the end of the 3-month pilot, we had reduced total abandonment (including failed verifications) from 51% down to 20%. While that was a huge improvement, it wasn’t quite enough to secure a long-term partnership.",
          },
          {
            type: "p",
            text: "Ultimately, JUUL chose to move forward with a more established vendor that had already reached industry-leading benchmarks. As a small startup, we didn’t have the scale or maturity yet — but the pilot validated that our design held up under pressure and that we were solving real problems for real users.",
          },
          { type: "media", index: 9 },
        ],
      },
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
