import type { ImpactArea, RelationshipType } from "@/lib/types";
import { CREATOR_NAME, DESCRIPTOR_WORDS_MAX } from "@/lib/constants";

export interface StepPrompt {
  title: string;
  subtitle: string;
}

function personalize(text: string): string {
  return text
    .replace(/Mark's/g, `${CREATOR_NAME}'s`)
    .replace(/\bMark\b/g, CREATOR_NAME);
}

function personalizeList(items: string[]): string[] {
  return items.map(personalize);
}

const EXPERIENCE_BY_RELATIONSHIP: Record<RelationshipType, string[]> = {
  "Coaching Client": [
    "Every session gave me real clarity",
    "I always left with a clear action plan",
    "Mark asked the right questions at the right time",
    "I felt genuinely heard and understood",
    "He helped me see blind spots I couldn't see alone",
    "The coaching felt personal, not generic",
    "I gained confidence to make tough decisions",
    "Our conversations challenged me in a good way",
  ],
  Student: [
    "The teaching was practical and easy to apply",
    "Complex ideas were broken down simply",
    "I finally understood concepts I'd struggled with",
    "Mark made learning feel engaging, not boring",
    "I could use what I learned right away",
    "The examples and stories really stuck with me",
    "I felt encouraged to keep growing",
    "It changed how I think about the subject",
  ],
  "Business Client": [
    "Mark understood my business challenges quickly",
    "The advice was strategic and actionable",
    "I got clarity on what to focus on next",
    "Our work together saved me time and mistakes",
    "The guidance was practical, not just theory",
    "I felt more confident running my business",
    "Mark helped me think bigger and smarter",
    "The results showed up in my bottom line",
  ],
  "Marketing Client": [
    "My funnel finally started converting",
    "The design and messaging felt on-brand and professional",
    "I got a website that actually brings in leads",
    "The strategy was clear, not confusing",
    "My offers became easier to sell",
    "I stopped wasting money on marketing that didn't work",
    "The AI and automation advice saved me hours",
    "I saw real sales from the work we did together",
  ],
  "Church Member": [
    "Mark's messages spoke directly to where I was",
    "I felt spiritually encouraged and refreshed",
    "The teaching was relevant to everyday life",
    "I left feeling hopeful and motivated",
    "Mark made faith feel practical and real",
    "I grew closer to God through his ministry",
    "The community and leadership felt genuine",
    "I found answers I'd been searching for",
  ],
  "Mentorship Recipient": [
    "Mark invested in me personally",
    "I got guidance I couldn't find anywhere else",
    "He believed in me before I believed in myself",
    "The mentorship was consistent and genuine",
    "I learned lessons that changed my trajectory",
    "Mark opened doors I didn't know existed",
    "I felt supported through real challenges",
    "He modeled what great leadership looks like",
  ],
  Friend: [
    "Mark showed up when it mattered most",
    "His advice was honest and caring",
    "I always felt better after talking to him",
    "He celebrated my wins like they were his own",
    "Mark helped me through a tough season",
    "His perspective shifted how I see things",
    "I trust him completely with the real stuff",
    "He's the kind of friend everyone needs",
  ],
  "Social Media Follower": [
    "His content consistently added value to my day",
    "I applied something from his posts every week",
    "Mark's message felt like it was meant for me",
    "I shared his content because it actually helped",
    "It was more than entertainment — it was growth",
    "I felt connected even from a distance",
    "His online teaching sparked real change in me",
    "I went from watching to actually doing",
  ],
  Other: [
    "Mark made a real difference in my life",
    "The experience exceeded my expectations",
    "I got more value than I expected",
    "Mark's approach felt fresh and genuine",
    "I walked away with practical takeaways",
    "The impact was immediate and lasting",
    "I would recommend Mark without hesitation",
    "Something clicked that hadn't clicked before",
  ],
};

const EXPERIENCE_BY_IMPACT: Record<ImpactArea, string[]> = {
  Sales: [
    "My sales process got clearer and easier",
    "I closed deals I used to lose",
    "My offer finally felt easy to sell",
    "I learned how to follow up without being pushy",
  ],
  "Digital Marketing": [
    "My messaging finally connects with people",
    "I know how to reach the right audience",
    "My content started getting real engagement",
    "My marketing stopped feeling random",
  ],
  "Funnel Building": [
    "My funnel finally converts visitors into buyers",
    "The customer journey makes sense now",
    "I know exactly what to say at each step",
    "My landing pages started performing",
  ],
  "Web Design/Development": [
    "My website looks professional and trustworthy",
    "People actually stay and explore my site now",
    "The design matches my brand perfectly",
    "My site finally supports my sales goals",
  ],
  "Brand Designer": [
    "My brand visuals look polished and premium",
    "My social posts finally look professional",
    "The designs made my offer feel more valuable",
    "I feel proud sharing my marketing materials",
  ],
  "AI Consulting": [
    "AI finally feels practical, not overwhelming",
    "I save hours every week with smart automation",
    "I know exactly where AI fits in my business",
    "The AI strategy gave me a real competitive edge",
  ],
  "Personal Development": [
    "I understand myself better now",
    "I broke through a limiting belief",
    "I built habits that actually stuck",
  ],
  Business: [
    "My business strategy got sharper",
    "I stopped spinning my wheels on the wrong things",
    "Revenue and focus improved",
  ],
  Marketing: [
    "My messaging finally connects with people",
    "I know how to reach the right audience",
    "My content started getting real engagement",
  ],
  Leadership: [
    "I lead my team with more confidence",
    "I communicate vision more clearly",
    "People respond to me differently now",
  ],
  Career: [
    "I made a career move I'd been avoiding",
    "I got unstuck in my professional growth",
    "New opportunities opened up for me",
  ],
  Faith: [
    "My faith became more alive and personal",
    "I found peace I'd been missing",
    "I trust God more in daily decisions",
  ],
  Productivity: [
    "I get more done without burning out",
    "My daily systems finally work",
    "I stopped procrastinating on what matters",
  ],
  Mindset: [
    "I replaced fear with confidence",
    "I stopped talking myself out of growth",
    "My inner dialogue became more positive",
  ],
  Other: [
    "Something shifted that I can't fully explain",
    "The impact showed up in unexpected ways",
    "It touched areas of my life I didn't expect",
  ],
};

const OUTCOMES_BY_IMPACT: Record<ImpactArea, string[]> = {
  Sales: [
    "More closed deals",
    "Higher conversion rate",
    "Shorter sales cycles",
    "Confidence selling my offer",
  ],
  "Digital Marketing": [
    "More leads and customers",
    "Stronger brand presence",
    "Content that actually converts",
    "A message I'm proud to share",
  ],
  "Funnel Building": [
    "A funnel that converts consistently",
    "More booked calls or purchases",
    "Better lead quality",
    "A clear path from visitor to buyer",
  ],
  "Web Design/Development": [
    "A website that builds trust instantly",
    "More inquiries from my site",
    "Better user experience for customers",
    "A site I'm proud to send people to",
  ],
  "Brand Designer": [
    "Brand visuals that look premium",
    "Higher engagement on social media",
    "Marketing that looks professional",
    "Designs that support my sales",
  ],
  "AI Consulting": [
    "Hours saved every week",
    "Smarter workflows and automation",
    "Better decisions with AI tools",
    "A modern edge in my business",
  ],
  "Personal Development": [
    "More self-awareness and inner peace",
    "Stronger sense of who I am",
    "Healthier habits and routines",
    "Greater emotional resilience",
  ],
  Business: [
    "More revenue or profit",
    "Clearer business direction",
    "Better systems and operations",
    "Smarter decisions under pressure",
  ],
  Marketing: [
    "More leads and customers",
    "Stronger brand presence",
    "Content that actually converts",
    "A message I'm proud to share",
  ],
  Leadership: [
    "A team that trusts me more",
    "Better communication skills",
    "Confidence leading through change",
    "People who want to follow my vision",
  ],
  Career: [
    "A promotion or new role",
    "A career pivot I'm proud of",
    "Skills that made me more valuable",
    "A clearer long-term path",
  ],
  Faith: [
    "A deeper relationship with God",
    "More peace in hard seasons",
    "Purpose I didn't have before",
    "A faith that shows up daily",
  ],
  Productivity: [
    "More done in less time",
    "Less stress and overwhelm",
    "Better work-life balance",
    "Consistency I never had before",
  ],
  Mindset: [
    "Confidence I didn't have before",
    "Less fear, more action",
    "A winner's mindset",
    "Belief that I can figure it out",
  ],
  Other: [
    "Positive change I didn't expect",
    "Growth in multiple areas of life",
    "A fresh perspective on everything",
    "Momentum I didn't have before",
  ],
};

const DESCRIPTORS_BY_RELATIONSHIP: Record<RelationshipType, string[]> = {
  "Coaching Client": [
    "Insightful", "Encouraging", "Strategic", "Caring", "Direct",
    "Wise", "Motivating", "Trustworthy", "Practical", "Invested",
    "Challenging", "Supportive", "Clear", "Empowering", "Authentic",
  ],
  Student: [
    "Engaging", "Knowledgeable", "Patient", "Inspiring", "Clear",
    "Passionate", "Relatable", "Encouraging", "Practical", "Gifted",
    "Fun", "Dedicated", "Wise", "Motivating", "Approachable",
  ],
  "Business Client": [
    "Strategic", "Results-driven", "Sharp", "Reliable", "Innovative",
    "Professional", "Insightful", "Practical", "Visionary", "Trusted",
    "Experienced", "Focused", "Honest", "Impactful", "Brilliant",
  ],
  "Marketing Client": [
    "Creative", "Strategic", "Results-driven", "Innovative", "Skilled",
    "Professional", "Detail-oriented", "Conversion-focused", "Reliable", "Modern",
    "Insightful", "Efficient", "Talented", "Trustworthy", "Impactful",
  ],
  "Church Member": [
    "Inspiring", "Faithful", "Compassionate", "Wise", "Authentic",
    "Uplifting", "Genuine", "Powerful", "Loving", "Relatable",
    "Encouraging", "Humble", "Passionate", "Grounded", "Hopeful",
  ],
  "Mentorship Recipient": [
    "Invested", "Generous", "Wise", "Patient", "Believing",
    "Encouraging", "Honest", "Inspiring", "Reliable", "Caring",
    "Humble", "Strategic", "Supportive", "Authentic", "Empowering",
  ],
  Friend: [
    "Loyal", "Fun", "Honest", "Caring", "Real",
    "Supportive", "Wise", "Encouraging", "Genuine", "Dependable",
    "Positive", "Inspiring", "Humble", "Trustworthy", "Warm",
  ],
  "Social Media Follower": [
    "Relatable", "Inspiring", "Consistent", "Valuable", "Authentic",
    "Engaging", "Practical", "Motivating", "Clear", "Generous",
    "Creative", "Wise", "Positive", "Impactful", "Genuine",
  ],
  Other: [
    "Impactful", "Genuine", "Wise", "Encouraging", "Inspiring",
    "Practical", "Caring", "Authentic", "Motivating", "Trustworthy",
    "Positive", "Reliable", "Clear", "Generous", "Memorable",
  ],
};

const STEP4_PROMPTS: Record<RelationshipType, StepPrompt> = {
  "Coaching Client": {
    title: "What stood out in your coaching?",
    subtitle: "Tap everything that resonates — no writing needed",
  },
  Student: {
    title: "What made Mark's teaching hit different?",
    subtitle: "Pick what felt true for you",
  },
  "Business Client": {
    title: "What made working with Mark worthwhile?",
    subtitle: "Tap all that apply",
  },
  "Marketing Client": {
    title: "What stood out in the marketing work?",
    subtitle: "Tap funnels, design, web, AI, or sales wins that fit",
  },
  "Church Member": {
    title: "What impacted you most?",
    subtitle: "Select what stood out to you",
  },
  "Mentorship Recipient": {
    title: "What made this mentorship special?",
    subtitle: "Pick everything that fits",
  },
  Friend: {
    title: "What do you appreciate most about Mark?",
    subtitle: "Tap what feels right",
  },
  "Social Media Follower": {
    title: "What kept you coming back?",
    subtitle: "Select what resonated with you",
  },
  Other: {
    title: "What stood out about your experience?",
    subtitle: "Tap everything that applies",
  },
};

const STEP5_PROMPTS: Record<RelationshipType, StepPrompt> = {
  "Coaching Client": {
    title: "What's different now?",
    subtitle: "Pick the shifts you've noticed",
  },
  Student: {
    title: "How did you grow?",
    subtitle: "Select the changes you experienced",
  },
  "Business Client": {
    title: "What results showed up?",
    subtitle: "Tap the outcomes that happened for you",
  },
  "Marketing Client": {
    title: "What business results did you see?",
    subtitle: "Pick leads, sales, conversions, or growth you experienced",
  },
  "Church Member": {
    title: "What changed in your life?",
    subtitle: "Pick what shifted for you",
  },
  "Mentorship Recipient": {
    title: "Where are you now because of Mark?",
    subtitle: "Select the growth you experienced",
  },
  Friend: {
    title: "How did Mark's friendship change things?",
    subtitle: "Tap what feels true",
  },
  "Social Media Follower": {
    title: "What changed because of his content?",
    subtitle: "Pick the impact you felt",
  },
  Other: {
    title: "What changed for you?",
    subtitle: "Select the outcomes that fit",
  },
};

const RESULTS_BY_IMPACT: Record<ImpactArea, string[]> = {
  Sales: [
    "I made $1k - $5k",
    "I made $5k - $10k",
    "I made $10k+",
    "I made $25k+",
    "I doubled my sales",
    "I closed my biggest deal yet",
    "I hit my monthly sales goal",
  ],
  "Digital Marketing": [
    "More qualified leads every week",
    "Lower cost per lead",
    "Campaign ROI paid for itself",
    "Consistent inbound inquiries",
  ],
  "Funnel Building": [
    "First sale from my funnel",
    "Funnel conversion rate went up",
    "More booked calls from my funnel",
    "Launch paid for itself",
  ],
  "Web Design/Development": [
    "More website inquiries",
    "Higher time on site",
    "Site helped close more sales",
    "Professional look boosted trust",
  ],
  "Brand Designer": [
    "Higher engagement on posts",
    "Ads performed better",
    "Brand looked more premium",
    "Design helped me stand out",
  ],
  "AI Consulting": [
    "Saved 5+ hours per week",
    "Automated repetitive tasks",
    "AI helped me scale faster",
    "Smarter workflows with less effort",
  ],
  "Personal Development": [
    "Breakthrough that changed my results",
    "Confidence to take bigger action",
    "Consistency I never had before",
  ],
  Business: [
    "I made $1k - $5k",
    "I made $5k - $10k",
    "I made $10k+",
    "I made $25k+",
    "I doubled my revenue",
    "Profit went up after the project",
    "ROI paid for itself",
    "I had my best month ever",
  ],
  Marketing: [
    "More leads and customers",
    "Campaign ROI paid for itself",
    "Lower ad spend, better results",
    "Consistent weekly leads",
  ],
  Leadership: [
    "Team performance improved",
    "Better retention on my team",
    "Clearer goals and execution",
  ],
  Career: [
    "Raise or promotion",
    "New income stream",
    "Better job offer",
  ],
  Faith: [
    "Peace that improved my decisions",
    "Clarity on my next step",
    "Renewed purpose and direction",
  ],
  Productivity: [
    "More output in less time",
    "Finished projects I'd delayed",
    "Better daily momentum",
  ],
  Mindset: [
    "Took action I'd been avoiding",
    "Hit a goal I'd postponed",
    "More belief, more results",
  ],
  Other: [
    "Measurable improvement",
    "Positive ROI",
    "Results beyond what I expected",
  ],
};

const REVENUE_RESULTS = [
  "I made $1k - $5k",
  "I made $5k - $10k",
  "I made $10k - $25k",
  "I made $25k+",
  "I doubled my revenue",
  "I had my best sales month ever",
  "Profit went up after working together",
  "ROI paid for itself quickly",
];

const DEFAULT_RESULTS = [
  ...REVENUE_RESULTS,
  "First sale from my funnel",
  "More leads every week",
  "Record month in the business",
];

function unique(items: string[]): string[] {
  return [...new Set(items)];
}

export function getExperienceOptions(
  relationship: RelationshipType,
  impactAreas: ImpactArea[]
): string[] {
  const base = EXPERIENCE_BY_RELATIONSHIP[relationship] ?? [];
  const fromImpact = impactAreas.flatMap((area) => EXPERIENCE_BY_IMPACT[area] ?? []);
  return personalizeList(unique([...base, ...fromImpact]));
}

export function getOutcomeOptions(impactAreas: ImpactArea[]): string[] {
  if (impactAreas.length === 0) {
    return unique(Object.values(OUTCOMES_BY_IMPACT).flat());
  }
  return unique(impactAreas.flatMap((area) => OUTCOMES_BY_IMPACT[area] ?? []));
}

export function getResultsOptions(impactAreas: ImpactArea[]): string[] {
  const fromImpact =
    impactAreas.length === 0
      ? DEFAULT_RESULTS
      : unique(impactAreas.flatMap((area) => RESULTS_BY_IMPACT[area] ?? []));
  return unique([...REVENUE_RESULTS, ...fromImpact]);
}

export function getResultsPrompt(): StepPrompt {
  return {
    title: "What money or results did you get?",
    subtitle: "Tap what you made or achieved, then add the exact amount if you know it",
  };
}

export function getDescriptorOptions(relationship: RelationshipType): string[] {
  return DESCRIPTORS_BY_RELATIONSHIP[relationship] ?? DESCRIPTORS_BY_RELATIONSHIP.Other;
}

export function getStep4Prompt(relationship: RelationshipType): StepPrompt {
  const prompt = STEP4_PROMPTS[relationship] ?? STEP4_PROMPTS.Other;
  return { title: personalize(prompt.title), subtitle: prompt.subtitle };
}

export function getStep5Prompt(relationship: RelationshipType): StepPrompt {
  const prompt = STEP5_PROMPTS[relationship] ?? STEP5_PROMPTS.Other;
  return { title: personalize(prompt.title), subtitle: prompt.subtitle };
}

export function getStep7Prompt(): StepPrompt {
  return {
    title: `Pick ${DESCRIPTOR_WORDS_MAX} words that describe ${CREATOR_NAME}`,
    subtitle: `Just tap ${DESCRIPTOR_WORDS_MAX} — we'll handle the rest`,
  };
}

/** @deprecated use getStep7Prompt */
export function getStep6Prompt(_relationship: RelationshipType): StepPrompt {
  return getStep7Prompt();
}

export function selectionsToText(selections: string[]): string {
  return selections.join(", ");
}
