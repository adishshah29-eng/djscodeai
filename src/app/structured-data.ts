// JSON-LD structured data — helps Google show brand card + event chips in search
// Docs: https://developers.google.com/search/docs/appearance/structured-data

const SITE_URL = "https://www.djscodeai.in";
const CLUB_NAME = "DJS CodeAI";
const CLUB_DESCRIPTION =
  "The AI & ML club of DJ Sanghvi College of Engineering, Mumbai. A student-led community fostering innovation in artificial intelligence and machine learning through hands-on projects, hackathons, and mentorship.";
const CLUB_LOGO = `${SITE_URL}/icon.svg`;
const CONTACT_EMAIL = "contact.djscodeai@gmail.com";
const CONTACT_PHONE = "+91-8104665118";

const COLLEGE_NAME = "DJ Sanghvi College of Engineering";
const COLLEGE_URL = "https://www.djsce.ac.in";

const SOCIALS = [
  "https://github.com/djs-codeai",
  "https://www.linkedin.com/company/djs-codeai",
  "https://www.instagram.com/djs_codeai",
];

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Vile Parle West",
  addressLocality: "Mumbai",
  addressRegion: "Maharashtra",
  postalCode: "400056",
  addressCountry: "IN",
};

const events = [
  {
    name: "CodeVerse 1.0",
    description:
      "Revive the System, Redefine Intelligence — an offline flagship AI challenge where participants tackle real-world debugging and data-driven problem-solving tasks.",
    startDate: "2025-11-08T08:00:00+05:30",
    endDate: "2025-11-08T18:00:00+05:30",
    status: "https://schema.org/EventScheduled",
    attendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: "4th Floor, AIML Department, DJ Sanghvi College of Engineering",
  },
  {
    name: "CODEQUEST 2025",
    description:
      "A hybrid hackathon designed to introduce juniors to the full hackathon experience with mentorship, pitching, and teamwork across multiple stages.",
    startDate: "2025-10-05T00:00:00+05:30",
    endDate: "2025-10-12T23:59:00+05:30",
    status: "https://schema.org/EventScheduled",
    attendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: "Hybrid",
  },
  {
    name: "Roadmap to Becoming an AI Engineer",
    description:
      "An exclusive seminar to ignite your path to becoming a cutting-edge AI Engineer, guided by expert mentors from DJS CodeAI.",
    startDate: "2025-08-05T11:00:00+05:30",
    endDate: "2025-08-05T13:00:00+05:30",
    status: "https://schema.org/EventScheduled",
    attendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: "Seminar Hall, DJ Sanghvi College of Engineering",
  },
  {
    name: "Hackathon: AI for Good",
    description:
      "A 48-hour hackathon focused on developing AI solutions for social impact and sustainability challenges.",
    startDate: "2025-06-01T00:00:00+05:30",
    endDate: "2025-06-03T23:59:00+05:30",
    status: "https://schema.org/EventScheduled",
    attendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: "Innovation Center, DJ Sanghvi College of Engineering",
  },
];

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    // 1) The club as an EducationalOrganization
    {
      "@type": ["EducationalOrganization", "Organization"],
      "@id": `${SITE_URL}#organization`,
      name: CLUB_NAME,
      alternateName: [
        "DJS Code AI",
        "DJ Sanghvi CodeAI",
        "DJSCE AI ML Club",
      ],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: CLUB_LOGO,
        width: 512,
        height: 512,
      },
      image: `${SITE_URL}/opengraph-image`,
      description: CLUB_DESCRIPTION,
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      address: ADDRESS,
      parentOrganization: {
        "@type": "CollegeOrUniversity",
        name: COLLEGE_NAME,
        url: COLLEGE_URL,
      },
      sameAs: SOCIALS,
    },

    // 2) The website itself
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: CLUB_NAME,
      description: CLUB_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}#organization` },
      inLanguage: "en-IN",
    },

    // 3) Each event — makes Google show event chips in search results
    ...events.map((e, i) => ({
      "@type": "Event",
      "@id": `${SITE_URL}#event-${i}`,
      name: e.name,
      description: e.description,
      startDate: e.startDate,
      endDate: e.endDate,
      eventStatus: e.status,
      eventAttendanceMode: e.attendanceMode,
      location: {
        "@type": "Place",
        name: e.location,
        address: ADDRESS,
      },
      organizer: { "@id": `${SITE_URL}#organization` },
      image: `${SITE_URL}/opengraph-image`,
    })),
  ],
};
