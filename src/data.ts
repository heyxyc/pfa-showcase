import { Course } from "./types";

export const initialCourses: Course[] = [
  {
    id: "pfa-plus",
    title: "Psychological First Aid+",
    shortDescription: "An introductory course that equips you with the essential skills to recognise distress and provide supportive help in the first moments that matter.",
    whoItIsFor: "Individuals, community volunteers, educators, frontline staff, and anyone who wants to help others.",
    learnBullets: [
      "Recognise common signs of distress.",
      "Approach and support someone in need with confidence.",
      "Connect to appropriate support and encourage self-care."
    ],
    modules: [
      {
        id: "m1",
        num: 1,
        title: "Understand Distress",
        description: "Recognise signs and triggers of common distress.",
        objectives: [
          "Identify emotional, cognitive, and physical indicators of panic and extreme distress.",
          "Understand key psychological triggers and environmental stress factors."
        ]
      },
      {
        id: "m2",
        num: 2,
        title: "Approach & Connect",
        description: "Build trust and start a supportive conversation.",
        objectives: [
          "Demonstrate active listening techniques without interrupting or judging.",
          "Introduce yourself calmly and establish a safe, comfortable environment."
        ]
      },
      {
        id: "m3",
        num: 3,
        title: "Provide Support",
        description: "Offer practical comfort and emotional support.",
        objectives: [
          "Help individuals address basic physical needs (water, shelter, information).",
          "Employ grounding exercises to help highly agitated individuals regain composure."
        ]
      },
      {
        id: "m4",
        num: 4,
        title: "Encourage & Refer",
        description: "Connect to resources and promote self-care.",
        objectives: [
          "Safely hand off individuals to medical professional services or community resources.",
          "Formulate custom self-care recovery steps to prevent responder burnout."
        ]
      }
    ],
    enquiryEmail: "academy@redcross.sg",
    courseOutlineUrl: "https://www.redcross.sg/singapore-red-cross-academy.html"
  },
  {
    id: "pfa-advanced",
    title: "Advanced Psychological First Aid",
    shortDescription: "A comprehensive course that builds on fundamental PFA concepts to equip participants with deep-dive crisis management, active listening, and self-care skills.",
    whoItIsFor: "Crisis response team members, HR professionals, healthcare workers, and PFA+ graduates seeking to deepen their supportive skills.",
    learnBullets: [
      "De-escalate intense emotional distress and crisis situations.",
      "Conduct advanced supportive listening and psychological triage.",
      "Design peer support structures and handle complex scenarios."
    ],
    modules: [
      {
        id: "m1",
        num: 1,
        title: "Crisis Dynamics",
        description: "Understand complex trauma and crisis cycles.",
        objectives: [
          "Analyze the developmental stages of trauma responses.",
          "Contrast acute stress responses with post-traumatic stress symptoms."
        ]
      },
      {
        id: "m2",
        num: 2,
        title: "Active Caretaking",
        description: "Utilise advanced active listening and de-escalation tools.",
        objectives: [
          "Defuse aggressive verbal outbursts using specialized tonal pacing.",
          "Navigate silence and heavy emotional breakdowns with professional care."
        ]
      },
      {
        id: "m3",
        num: 3,
        title: "Triage & Protocol",
        description: "Evaluate severity and implement safety protocols.",
        objectives: [
          "Determine immediate safety risks (e.g. self-harm or harm to others).",
          "Apply Singapore-specific medical and social emergency referral paths."
        ]
      },
      {
        id: "m4",
        num: 4,
        title: "Peer Care & Resiliency",
        description: "Build systematic self-care and institutional support plans.",
        objectives: [
          "Structure de-briefing protocols for responding peer squads.",
          "Evaluate cognitive fatigue parameters to sustain responder energy."
        ]
      }
    ],
    enquiryEmail: "academy@redcross.sg",
    courseOutlineUrl: "https://www.redcross.sg/singapore-red-cross-academy.html"
  },
  {
    id: "pfa-groups",
    title: "Psychological First Aid in Groups",
    shortDescription: "Designed for leaders, managers, and team coordinators to deliver psychological support and group de-briefs during shared community or workplace crises.",
    whoItIsFor: "Team leaders, managers, school administrators, and community coordinators managing groups.",
    learnBullets: [
      "Facilitate group peer-support sessions and collaborative coping.",
      "Identify group-level stress responses and address conflicts.",
      "Strengthen shared resilience and psychological safety in teams."
    ],
    modules: [
      {
        id: "m1",
        num: 1,
        title: "Group Stress",
        description: "Identify group dynamics and collective stress markers.",
        objectives: [
          "Detect changes in performance, communication patterns, and group tension.",
          "Identify circular group distress cascades and rumor spreading."
        ]
      },
      {
        id: "m2",
        num: 2,
        title: "Safety Framing",
        description: "Establish ground rules for group supportive talks.",
        objectives: [
          "Establish high trust guidelines to ensure confidentiality.",
          "Moderate turn-taking to prevent any individual from dominating the conversation."
        ]
      },
      {
        id: "m3",
        num: 3,
        title: "Safe Facilitation",
        description: "Guide group sharing sessions without re-traumatisation.",
        objectives: [
          "Pivot conversations from painful memories back to forward-looking coping strategies.",
          "Ensure secondary trauma triggers are defused in real time."
        ]
      },
      {
        id: "m4",
        num: 4,
        title: "Team Recovery",
        description: "Reinforce team bonding, coping plans, and follow-ups.",
        objectives: [
          "Establish collaborative support circles and continuous buddy checks.",
          "Design collaborative team coping strategies for high-stress projects."
        ]
      }
    ],
    enquiryEmail: "academy@redcross.sg",
    courseOutlineUrl: "https://www.redcross.sg/singapore-red-cross-academy.html"
  },
  {
    id: "pfa-customised",
    title: "Customised Training",
    shortDescription: "Bespoke PFA training programmes tailored specifically for your organisation's unique industry, operational environments, or employee profiles.",
    whoItIsFor: "Corporate organisations, government agencies, NGOs, and schools requiring custom workflows.",
    learnBullets: [
      "Adapt PFA protocols to your specific workplace regulations.",
      "Incorporate industry-specific scenarios and case study reviews.",
      "Equip staff with targeted tools matching daily operational stress."
    ],
    modules: [
      {
        id: "m1",
        num: 1,
        title: "Context Review",
        description: "Evaluate your organisation's daily stress points and roles.",
        objectives: [
          "Audit existing employee assistance workflows and mental wellness resources.",
          "Map potential industry-specific crisis triggers (e.g., customer service conflict, high-risk physical labor)."
        ]
      },
      {
        id: "m2",
        num: 2,
        title: "Bespoke Cases",
        description: "Practice with customised roleplay scenarios and prompts.",
        objectives: [
          "Solve contextual simulation models designed for your team profile.",
          "Develop custom communication guides for team managers."
        ]
      },
      {
        id: "m3",
        num: 3,
        title: "Integration Planning",
        description: "Align PFA workflows with internal HR/employee assistance.",
        objectives: [
          "Synchronize PFA interventions with official HR policies.",
          "Identify and integrate local standard operating referral lines."
        ]
      },
      {
        id: "m4",
        num: 4,
        title: "Scaled Resilience",
        description: "Develop ongoing training and support systems for scale.",
        objectives: [
          "Formulate a peer champion training program to sustain mental health support.",
          "Design quarterly self-directed refreshers and review checks."
        ]
      }
    ],
    enquiryEmail: "academy@redcross.sg",
    courseOutlineUrl: "https://www.redcross.sg/singapore-red-cross-academy.html"
  }
];
